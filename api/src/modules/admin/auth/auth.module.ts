import { Module } from "@nestjs/common";

import { AppPassportModule } from "@pawfect/libs/passport";
import { AwsS3Module } from "@pawfect/libs/aws-s3";
import { AppMulterModule } from "@pawfect/libs/multer";
import { AppJwtModule } from "@pawfect/libs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";


@Module({
  imports: [
    AppJwtModule,
    AppPassportModule,
    AwsS3Module,
    AppMulterModule.forFeature()
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
