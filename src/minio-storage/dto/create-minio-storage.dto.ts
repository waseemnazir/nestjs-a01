import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBucketDto {
  @ApiProperty()
  @IsNotEmpty()
  bucketName: string;
}
