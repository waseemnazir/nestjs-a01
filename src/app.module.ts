import { Module } from "@nestjs/common";
import { configs } from "./config";
import { DataSource } from "typeorm";
import { TypeOrmConfigService } from "./database/typeorm-config.service";
import { MinioStorageModule } from "./minio-storage/minio-storage.module";

import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      // envFilePath: [`.env.${process.env.NODE_ENV}`],
      envFilePath: [`.env`],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    UsersModule,
    // MinioStorageModule,
  ],
})
export class AppModule {}
