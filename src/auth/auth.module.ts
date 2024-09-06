import { Module, forwardRef } from "@nestjs/common";

import { IsNotExist } from "../utils/validators/is-not-exists.validator";
import { IsExist } from "../utils/validators/is-exists.validator";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "src/users/users.module";

import { OtpModule } from "src/providers/otp/otp.module";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AnonymousStrategy } from "./strategies/anonymous.strategy";

import { redisModule } from "src/redis/redis.config";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("auth.secret"),
        signOptions: {
          expiresIn: configService.get("auth.expires"),
        },
      }),
    }),
    forwardRef(() => UsersModule),
    OtpModule,
    redisModule,
  ],
  providers: [IsNotExist, IsExist, JwtStrategy, AnonymousStrategy],
  exports: [],
})
export class AuthModule {}
