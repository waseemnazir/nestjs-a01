import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

import { Transform } from 'class-transformer';

export class MobileNumberAuthDTO {
  @ApiProperty({ example: '9906012345' })
  @IsString()
  @Transform(({ value }) => value.toLowerCase().trim())
  @MinLength(10)
  @MaxLength(10)
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
