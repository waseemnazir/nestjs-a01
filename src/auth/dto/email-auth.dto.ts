import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

import { Transform } from 'class-transformer';

export class EmailAuthDTO {
  @ApiProperty({ example: 'test@yopmail.com' })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
