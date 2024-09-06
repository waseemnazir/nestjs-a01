import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestMinioModule } from 'nestjs-minio';
import { MinioStorageController } from './controllers/minio-storage.controller';
import { MinioStorageService } from './services/minio-storage.service';

@Module({
  imports: [
    NestMinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        endPoint: configService.get('minio.endPoint'),
        port: parseInt(configService.get<string>('minio.port')),
        useSSL: configService.get<boolean>('minio.useSsl'),
        accessKey: configService.get<string>('minio.accessKey'),
        secretKey: configService.get<string>('minio.secretKey'),
      }),
    }),
  ],
  controllers: [MinioStorageController],
  providers: [MinioStorageService],
})
export class MinioStorageModule {}
