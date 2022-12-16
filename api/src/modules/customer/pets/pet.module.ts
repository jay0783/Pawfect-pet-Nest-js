import { Module } from "@nestjs/common";

import { AwsS3Module } from "@pawfect/libs/aws-s3";
import { AppMulterModule } from "@pawfect/libs/multer";
import { PetService } from "./pet.service";
import { PetController } from "./pet.controller";


@Module({
  imports: [
    AwsS3Module,
    AppMulterModule.forFeature()
  ],
  controllers: [PetController],
  providers: [PetService],
  exports: []
})
export class PetModule { }
