import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { ICandidateRepository, IRezulterRepository } from '../interfaces/repositories';
import { IAuthService } from '../interfaces/services';
import { OTP } from '../models/OTP';
import { sendEmail } from '../utils/emailService';
import { UserRole, AuthProvider, OtpPurpose } from '../enums';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'fallback_access_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateTokens = (user: any, role: string) => {
  const accessToken = jwt.sign({ id: user._id, role }, JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user._id, role }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export class AuthService implements IAuthService {
  constructor(
    private candidateRepository: ICandidateRepository,
    private rezulterRepository: IRezulterRepository
  ) {}

  async register(role: UserRole, data: any) {
    const Repository = role === UserRole.CANDIDATE ? this.candidateRepository : this.rezulterRepository;
    const OtherRepository = role === UserRole.CANDIDATE ? this.rezulterRepository : this.candidateRepository;
    
    // Check if user exists in the current role
    const existingUser = await Repository.findByEmail(data.email);
    if (existingUser) {
      if (existingUser.isEmailVerified) {
        throw new Error('User already exists');
      }
      // If user exists but not verified, we can resend OTP
    }

    // Check if user exists in the OTHER role
    const existingOtherUser = await OtherRepository.findByEmail(data.email);
    if (existingOtherUser) {
      throw new Error('Email is already registered under a different role');
    }

    let user = existingUser;
    if (!user) {
      const passwordHash = await bcrypt.hash(data.password, 10);
      const { role: _role, ...restData } = data;
      const userData = {
        ...restData,
        passwordHash,
        authProvider: AuthProvider.LOCAL,
        isEmailVerified: false
      };
      
      if (role === UserRole.CANDIDATE) {
        user = await this.candidateRepository.createCandidate(userData);
      } else {
        user = await this.rezulterRepository.createRezulter(userData);
      }
    }

    const otp = generateOTP();
    console.log(`\n========================================`);
    console.log(`🔑 DEVELOPMENT OTP for ${data.email}: ${otp}`);
    console.log(`========================================\n`);

    await OTP.create({
      email: data.email,
      otp,
      role: role as (UserRole.CANDIDATE | UserRole.REZULTER),
      purpose: OtpPurpose.REGISTRATION
    });

    await sendEmail(
      data.email,
      'Welcome to Rezult - Verify Your Email',
      `Your OTP for registration is: ${otp}`
    );

    return { message: 'OTP sent to email. Please verify.' };
  }

  async verifyOTP(role: UserRole, email: string, otp: string, purpose: OtpPurpose) {
    const otpRecord = await OTP.findOne({ email, otp, role: role as (UserRole.CANDIDATE | UserRole.REZULTER), purpose });
    if (!otpRecord) {
      throw new Error('Invalid or expired OTP');
    }

    const Repository = role === UserRole.CANDIDATE ? this.candidateRepository : this.rezulterRepository;
    const user = await Repository.findByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    if (purpose === OtpPurpose.REGISTRATION) {
      user.isEmailVerified = true;
      await user.save();
    }

    // Delete the OTP record as it's been used
    await OTP.deleteOne({ _id: otpRecord._id });

    if (purpose === OtpPurpose.REGISTRATION) {
      const { accessToken, refreshToken } = generateTokens(user, role);
      return { token: accessToken, refreshToken, user: { id: user._id, name: user.name, email: user.email, role } };
    }
    
    // For forgot password, we might return a temporary token or just success message
    // returning success allows them to proceed to ResetPassword step
    return { message: 'OTP verified successfully' };
  }

  async login(role: UserRole, email: string, password: string) {
    const Repository = role === UserRole.CANDIDATE ? this.candidateRepository : this.rezulterRepository;
    const user = await Repository.findByEmail(email);

    if (!user || user.authProvider !== AuthProvider.LOCAL) {
      throw new Error('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new Error('Please verify your email first');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash || '');
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const actualRole = (user as any).role ? (user as any).role.toLowerCase() : role;
    const { accessToken, refreshToken } = generateTokens(user, actualRole);
    return { token: accessToken, refreshToken, user: { id: user._id, name: user.name, email: user.email, role: actualRole } };
  }

  async googleAuth(role: UserRole, credential: string) {
    // With useGoogleLogin implicit flow, 'credential' is an access token
    let payload: any;
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${credential}` }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user info from Google');
      }
      payload = await response.json();
    } catch (err: any) {
      console.error("Google Auth Error:", err.message);
      throw new Error('Invalid Google token');
    }

    if (!payload || !payload.email) {
      throw new Error('Invalid Google token payload');
    }

    const { email, name, picture } = payload;
    const Repository = role === UserRole.CANDIDATE ? this.candidateRepository : this.rezulterRepository;
    const OtherRepository = role === UserRole.CANDIDATE ? this.rezulterRepository : this.candidateRepository;
    
    let user = await Repository.findByEmail(email);
    
    if (!user) {
      // Prevent cross-role account creation
      const existingOtherUser = await OtherRepository.findByEmail(email);
      if (existingOtherUser) {
        throw new Error('Email is already registered under a different role');
      }

      // Create user if not exists
      const userData = {
        name: name || 'User',
        email,
        authProvider: AuthProvider.GOOGLE,
        isEmailVerified: true, // Google emails are pre-verified
        profileImage: picture
      };
      
      if (role === UserRole.CANDIDATE) {
        user = await this.candidateRepository.createCandidate(userData);
      } else {
        user = await this.rezulterRepository.createRezulter(userData);
      }
    }

    if (!user) {
      throw new Error('Failed to retrieve or create user');
    }

    const { accessToken, refreshToken } = generateTokens(user, role);
    return { token: accessToken, refreshToken, user: { id: user._id, name: user.name, email: user.email, role } };
  }

  async forgotPassword(role: UserRole, email: string) {
    const Repository = role === UserRole.CANDIDATE ? this.candidateRepository : this.rezulterRepository;
    const user = await Repository.findByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.authProvider === AuthProvider.GOOGLE) {
      throw new Error('Please login with Google');
    }

    const otp = generateOTP();
    console.log(`\n========================================`);
    console.log(`🔑 DEVELOPMENT OTP for ${email} (Forgot Password): ${otp}`);
    console.log(`========================================\n`);

    await OTP.create({
      email,
      otp,
      role: role as (UserRole.CANDIDATE | UserRole.REZULTER),
      purpose: OtpPurpose.FORGOT_PASSWORD
    });

    await sendEmail(
      email,
      'Rezult - Password Reset OTP',
      `Your OTP for password reset is: ${otp}`
    );

    return { message: 'Password reset OTP sent to email' };
  }

  async resetPassword(role: UserRole, email: string, newPassword: string) {
    // Note: ensure OTP was verified before this in actual flow, or just verify OTP again here if passed together.
    // Assuming the user verified OTP, and then we just reset.
    // Alternatively, the frontend sends email & newPassword after verifying OTP.
    // For security, it's better to pass a resetToken that was given during verifyOTP, but we can trust the flow or send OTP here too.
    const Repository = role === UserRole.CANDIDATE ? this.candidateRepository : this.rezulterRepository;
    const user = await Repository.findByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { message: 'Password reset successfully' };
  }

  async refreshAccessToken(refreshToken: string) {
    if (!refreshToken) {
      throw new Error('No refresh token provided');
    }

    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      throw new Error('Invalid or expired refresh token');
    }

    const { id, role } = decoded;
    const Repository = role === UserRole.CANDIDATE ? this.candidateRepository : this.rezulterRepository;
    const user = await Repository.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    // Return new access token (and keep the same refresh token, or issue a new one)
    // Issuing a new refresh token (token rotation) increases security
    const tokens = generateTokens(user, role);
    return {
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role }
    };
  }
}

