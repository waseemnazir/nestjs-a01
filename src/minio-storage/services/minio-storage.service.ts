import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { AbstractApiResponse } from '../../utils/general-response';
import { v4 as uuid } from 'uuid';
@Injectable()
export class MinioStorageService implements OnModuleInit {
  constructor(
    @Inject(MINIO_CONNECTION) private readonly minioClient,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    const bucketName = await this.configService.get('minio.bucketName');

    if (!bucketName) {
      throw new HttpException(
        {
          data: null,
          error: 'ENV_MISSING',
          message: 'bucket name missing in env',
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const bucketExists = await this.minioClient.bucketExists(bucketName);

    if (!bucketExists) {
      await this.createBucket(bucketName);
    }
    await this.setBucketPolicy(bucketName);
  }

  async createBucket(bucketName: string) {
    await this.minioClient.makeBucket(bucketName);
  }

  async listBuckets() {
    const buckets = await this.minioClient.listBuckets();
    return buckets;
  }

  async bucketExists(bucketName: string) {
    const bucketExists = await this.minioClient.bucketExists(bucketName);
    return bucketExists;
  }

  async addObject<T>(
    objectName: string,
    fileBuffer: Buffer,
    metadata: object,
  ): Promise<AbstractApiResponse<T>> {
    const id = uuid();
    const contentType = metadata['Content-Type'];
    const fileData = contentType.split('/');
    let extension = fileData[1];
    if (extension == 'quicktime') {
      extension = 'mp4';
    }
    const generatedUrl = `${id}.${extension}`;
    const bucketName = this.configService.get('minio.bucketName');
    const bucketExists = await this.minioClient.bucketExists(bucketName);
    if (bucketExists) {
      await this.minioClient.putObject(
        bucketName,
        generatedUrl,
        fileBuffer,
        metadata,
      );
      return AbstractApiResponse.created(generatedUrl as T);
    } else {
      throw new HttpException(
        {
          error: HttpStatus.BAD_REQUEST,
          status: HttpStatus.BAD_REQUEST,
          message: "bucket doesn't exist",
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async removeObject<T>(objectId: string) {
    const bucketName = this.configService.get('minio.bucketName');
    const bucketExists = await this.minioClient.bucketExists(bucketName);
    if (bucketExists) {
      await this.minioClient.removeObject(bucketName, objectId);
      return {
        message: 'object removed successfully',
        status: HttpStatus.OK,
      } as T;
    }
  }

  getBaseUrl(presignedUrl: string): string {
    const baseUrl = presignedUrl.split('?')[0];
    return baseUrl;
  }

  async setBucketPolicy(bucketName: string): Promise<void> {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };

    await this.minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
  }
}
