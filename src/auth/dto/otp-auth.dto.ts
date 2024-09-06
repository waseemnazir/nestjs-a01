import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDTO {
  @ApiProperty({ example: '1234' })
  @IsNotEmpty()
  @IsString()
  otp: string;

  @ApiProperty({ example: '9906990600' })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}
