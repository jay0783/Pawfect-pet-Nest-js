import { Module } from "@nestjs/common";

import { AwsS3Module } from "@pawfect/libs/aws-s3";
import { AppMulterModule } from "@pawfect/libs/multer";
import { NodeMailerModule } from "@pawfect/libs/nodemailer";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";


@Module({
  imports: [
    AwsS3Module,
    AppMulterModule.forFeature(),
    NodeMailerModule
  ],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule { }
