import { IOtpService } from '../interfaces/services';
import { IOtpRepository } from '../interfaces/repositories';
import { sendEmail } from '../utils/emailService';
import { UserRole, OtpPurpose } from '../enums';

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export class OtpService implements IOtpService {
  #otpRepository: IOtpRepository;

  constructor(otpRepository: IOtpRepository) {
    this.#otpRepository = otpRepository;
  }

  async sendOtp(email: string, role: UserRole, purpose: OtpPurpose): Promise<void> {
    const otp = generateOTP();
    console.log(`\n========================================`);
    console.log(`🔑 DEVELOPMENT OTP for ${email} (${purpose}): ${otp}`);
    console.log(`========================================\n`);

    await this.#otpRepository.create({ email, otp, role, purpose });

    let subject = 'Rezult - OTP Verification';
    let message = `Your OTP is: ${otp}`;

    if (purpose === OtpPurpose.REGISTRATION) {
      subject = 'Welcome to Rezult - Verify Your Email';
      message = `Your OTP for registration is: ${otp}`;
    } else if (purpose === OtpPurpose.FORGOT_PASSWORD) {
      subject = 'Rezult - Password Reset OTP';
      message = `Your OTP for password reset is: ${otp}`;
    }

    await sendEmail(email, subject, message);
  }

  async verifyOtp(email: string, otp: string, role: UserRole, purpose: OtpPurpose): Promise<boolean> {
    const otpRecord = await this.#otpRepository.findValidOtp(email, otp, role, purpose);
    if (!otpRecord) {
      return false;
    }

    // Delete the OTP record as it's been used
    await this.#otpRepository.delete(otpRecord._id as string);
    return true;
  }
}
