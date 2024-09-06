import { appConfig } from "./app.config";
import { razorpayConfig } from "./razorpay.config";
import { databaseConfig } from "./database.config";
import { otpConfig } from "./otp.config";
import { mongoConfig } from "./mongo.config";
import { minioConfig } from "./minio.config";
export const configs = [
  appConfig,
  databaseConfig,
  razorpayConfig,
  otpConfig,
  mongoConfig,
  minioConfig,
];
