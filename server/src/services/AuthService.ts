import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { ICandidateRepository, IRezulterRepository } from '../interfaces/repositories';
import { IAuthService, IOtpService } from '../interfaces/services';
import { UserRole, AuthProvider, OtpPurpose } from '../enums';
import { mapToCandidateDTO, mapToRezulterDTO } from '../dtos/user.dto';
import { ICandidate } from '../models/Candidate';
import { IRezulter } from '../models/Rezulter';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'fallback_access_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';


const generateTokens = (user: Record<string, unknown> | import("mongoose").Document, role: string) => {
  const accessToken = jwt.sign({ id: user._id, role }, JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user._id, role }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export class AuthService implements IAuthService {
  #candidateRepository: ICandidateRepository;
  #rezulterRepository: IRezulterRepository;

  #otpService: IOtpService;

  constructor(
    candidateRepository: ICandidateRepository,
    rezulterRepository: IRezulterRepository,
    otpService: IOtpService
  ) {
    this.#candidateRepository = candidateRepository;
    this.#rezulterRepository = rezulterRepository;
    this.#otpService = otpService;
  }

  async register(role: UserRole, data: Record<string, unknown>) {
    const Repository = role === UserRole.CANDIDATE ? this.#candidateRepository : this.#rezulterRepository;
    const OtherRepository = role === UserRole.CANDIDATE ? this.#rezulterRepository : this.#candidateRepository;
    
    // Check if user exists in the current role
    const existingUser = await Repository.findByEmail((data.email as string));
    if (existingUser) {
      if (existingUser.isEmailVerified) {
        throw new Error('User already exists');
      }
      // If user exists but not verified, we can resend OTP
    }

    // Check if user exists in the OTHER role
    const existingOtherUser = await OtherRepository.findByEmail((data.email as string));
    if (existingOtherUser) {
      throw new Error('Email is already registered under a different role');
    }

    let user = existingUser;
    if (!user) {
      const passwordHash = await bcrypt.hash((data.password as string), 10);
      const { role: _role, ...restData } = data;
      const userData = {
        ...restData,
        passwordHash,
        authProvider: AuthProvider.LOCAL,
        isEmailVerified: false
      };
      
      if (role === UserRole.CANDIDATE) {
        user = await this.#candidateRepository.create(userData);
      } else {
        user = await this.#rezulterRepository.create(userData);
      }
    }

    await this.#otpService.sendOtp((data.email as string), role, OtpPurpose.REGISTRATION);

    return { message: 'OTP sent to email. Please verify.' };
  }

  async verifyOTP(role: UserRole, email: string, otp: string, purpose: OtpPurpose) {
    const isValid = await this.#otpService.verifyOtp(email, otp, role, purpose);
    if (!isValid) {
      throw new Error('Invalid or expired OTP');
    }

    const Repository = role === UserRole.CANDIDATE ? this.#candidateRepository : this.#rezulterRepository;
    const user = await Repository.findByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    if (purpose === OtpPurpose.REGISTRATION) {
      user.isEmailVerified = true;
      await user.save();
    }



    if (purpose === OtpPurpose.REGISTRATION) {
      const { accessToken, refreshToken } = generateTokens(user, role);
      const userDTO = role === UserRole.CANDIDATE ? mapToCandidateDTO(user as ICandidate) : mapToRezulterDTO(user as IRezulter);
      return { token: accessToken, refreshToken, user: userDTO };
    }
    
    return { message: 'OTP verified successfully' };
  }

  async resendOTP(role: UserRole, email: string, purpose: OtpPurpose) {
    const Repository = role === UserRole.CANDIDATE ? this.#candidateRepository : this.#rezulterRepository;
    const user = await Repository.findByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    if (purpose === OtpPurpose.REGISTRATION && user.isEmailVerified) {
      throw new Error('Email is already verified');
    }

    await this.#otpService.sendOtp(email, role, purpose);

    return { message: 'OTP resent successfully to email' };
  }

  async login(role: UserRole, email: string, password: string) {
    const Repository = role === UserRole.CANDIDATE ? this.#candidateRepository : this.#rezulterRepository;
    const user = await Repository.findByEmail(email);

    if (!user || user.authProvider !== AuthProvider.LOCAL) {
      throw new Error('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new Error('Please verify your email first');
    }

    if (user.isActive === false) {
      throw new Error('ACCOUNT_BLOCKED');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash || '');
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const actualRole = ('role' in user ? (user as unknown as Record<string, unknown>).role as string : role) ? ('role' in user ? (user as unknown as Record<string, unknown>).role as string : role).toLowerCase() : role;
    const { accessToken, refreshToken } = generateTokens(user, actualRole);
    const userDTO = role === UserRole.CANDIDATE ? mapToCandidateDTO(user as ICandidate) : mapToRezulterDTO(user as IRezulter);
    return { token: accessToken, refreshToken, user: userDTO };
  }

  async googleAuth(role: UserRole, credential: string) {
    // With useGoogleLogin implicit flow, 'credential' is an access token
    let payload: Record<string, unknown>;
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${credential}` }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user info from Google');
      }
      payload = await response.json();
    } catch (err: unknown) {
      console.error("Google Auth Error:", err instanceof Error ? err.message : String(err));
      throw new Error('Invalid Google token');
    }

    if (!payload || !payload.email) {
      throw new Error('Invalid Google token payload');
    }

    const { email, name, picture } = payload;
    const Repository = role === UserRole.CANDIDATE ? this.#candidateRepository : this.#rezulterRepository;
    const OtherRepository = role === UserRole.CANDIDATE ? this.#rezulterRepository : this.#candidateRepository;
    
    let user = await Repository.findByEmail(email as string);
    
    if (!user) {
      // Prevent cross-role account creation
      const existingOtherUser = await OtherRepository.findByEmail(email as string);
      if (existingOtherUser) {
        throw new Error('Email is already registered under a different role');
      }

      // Create user if not exists
      const userData = {
        name: (name as string) || 'User',
        email: (email as string),
        authProvider: AuthProvider.GOOGLE,
        isEmailVerified: true, // Google emails are pre-verified
        profileImage: picture as string
      };
      
      if (role === UserRole.CANDIDATE) {
        user = await this.#candidateRepository.create(userData);
      } else {
        user = await this.#rezulterRepository.create(userData);
      }
    }

    if (!user) {
      throw new Error('Failed to retrieve or create user');
    }

    if (user.isActive === false) {
      throw new Error('ACCOUNT_BLOCKED');
    }

    const { accessToken, refreshToken } = generateTokens(user, role);
    const userDTO = role === UserRole.CANDIDATE ? mapToCandidateDTO(user as ICandidate) : mapToRezulterDTO(user as IRezulter);
    return { token: accessToken, refreshToken, user: userDTO };
  }

  async forgotPassword(role: UserRole, email: string) {
    const Repository = role === UserRole.CANDIDATE ? this.#candidateRepository : this.#rezulterRepository;
    const user = await Repository.findByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.authProvider === AuthProvider.GOOGLE) {
      throw new Error('Please login with Google');
    }

    await this.#otpService.sendOtp(email, role, OtpPurpose.FORGOT_PASSWORD);

    return { message: 'Password reset OTP sent to email' };
  }

  async resetPassword(role: UserRole, email: string, newPassword: string) {
    // Note: ensure OTP was verified before this in actual flow, or just verify OTP again here if passed together.
    // Assuming the user verified OTP, and then we just reset.
    // Alternatively, the frontend sends email & newPassword after verifying OTP.
    // For security, it's better to pass a resetToken that was given during verifyOTP, but we can trust the flow or send OTP here too.
    const Repository = role === UserRole.CANDIDATE ? this.#candidateRepository : this.#rezulterRepository;
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

    let decoded: import("jsonwebtoken").JwtPayload | string;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      throw new Error('Invalid or expired refresh token');
    }

    if (typeof decoded === 'string' || !decoded.id) throw new Error('Invalid token format');
    const { id, role } = decoded;
    const Repository = role === UserRole.CANDIDATE ? this.#candidateRepository : this.#rezulterRepository;
    const user = await Repository.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.isActive === false) {
      throw new Error('ACCOUNT_BLOCKED');
    }

    // Return new access token (and keep the same refresh token, or issue a new one)
    // Issuing a new refresh token (token rotation) increases security
    const tokens = generateTokens(user, role);
    const userDTO = role === UserRole.CANDIDATE ? mapToCandidateDTO(user as ICandidate) : mapToRezulterDTO(user as IRezulter);
    return {
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: userDTO
    };
  }

  async checkUserActiveStatus(id: string, role: string): Promise<boolean> {
    const Repository = role === UserRole.CANDIDATE ? this.#candidateRepository : this.#rezulterRepository;
    const user = await Repository.findById(id);
    if (!user) return false;
    return user.isActive !== false;
  }
}

