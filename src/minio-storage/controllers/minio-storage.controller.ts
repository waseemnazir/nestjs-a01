import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { AbstractApiResponse } from 'src/utils/general-response';
import { CreateBucketDto } from '../dto/create-minio-storage.dto';
import { MinioStorageService } from '../services/minio-storage.service';
import { Express } from 'express';

@ApiTags('assets')
@Controller({
  path: 'assets',
  version: '1',
})
export class MinioStorageController {
  constructor(private minioService: MinioStorageService) {}
  @Get('buckets')
  async listBuckets() {
    return this.minioService.listBuckets();
  }

  @Post('make-bucket')
  async createBucket(@Body() createBucketDto: CreateBucketDto) {
    try {
      console.log('bucketName: ', createBucketDto.bucketName);
      return this.minioService.createBucket(createBucketDto.bucketName);
    } catch (error) {
      throw new HttpException(
        {
          error: error.response,
          message: error.response.message,
          status: error.response.status,
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('upload')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File Upload',
    type: 'object',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException(
        {
          error: 'INVALID',
          status: HttpStatus.BAD_REQUEST,
          message: 'file missing',
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const objectName = file.originalname;
    const metadata = {
      'Content-Type': file.mimetype,
    };
    const response = this.minioService.addObject(
      objectName,
      file.buffer,
      metadata,
    );
    return response;
  }

  @Delete('/:objectName')
  async removeObject(@Param('objectName') objectName: string) {
    try {
      const response = this.minioService.removeObject(objectName);
      console.log('response: ', response);
      return response;
    } catch (error) {
      throw new HttpException(
        {
          error: error.response,
          message: error.response.message,
          status: error.response.status,
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
