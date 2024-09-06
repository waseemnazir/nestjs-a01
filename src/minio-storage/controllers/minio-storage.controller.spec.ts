import { Test, TestingModule } from '@nestjs/testing';
import { MinioStorageController } from './minio-storage.controller';
import { MinioStorageService } from '../services/minio-storage.service';

describe('MinioStorageController', () => {
  let controller: MinioStorageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MinioStorageController],
      providers: [MinioStorageService],
    }).compile();

    controller = module.get<MinioStorageController>(MinioStorageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
