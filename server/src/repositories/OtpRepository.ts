import { OTP, IOTP } from '../models/OTP';
import { IOtpRepository } from '../interfaces/repositories';
import { UserRole, OtpPurpose } from '../enums';

export class OtpRepository implements IOtpRepository {
  async create(data: { email: string; otp: string; role: UserRole; purpose: OtpPurpose }): Promise<IOTP> {
    return await OTP.create({
      ...data,
      role: data.role as (UserRole.CANDIDATE | UserRole.REZULTER)
    });
  }

  async findValidOtp(email: string, otp: string, role: UserRole, purpose: OtpPurpose): Promise<IOTP | null> {
    return await OTP.findOne({ email, otp, role: role as (UserRole.CANDIDATE | UserRole.REZULTER), purpose });
  }

  async delete(id: string): Promise<void> {
    await OTP.deleteOne({ _id: id });
  }
}
