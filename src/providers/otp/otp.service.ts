import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { totp } from 'otplib';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private secret: string;

  constructor(private readonly configService: ConfigService) {
    this.secret = this.configService.get<string>('OTP_SECRET');
    totp.options = {
      digits: 6,
      step: 600,
    };
  }

  generateOtp(): string {
    this.logger.debug('OTP generated ');
    return totp.generate(this.secret);
  }

  verifyOtp(token: string): boolean {
    return totp.check(token, this.secret);
  }
}
