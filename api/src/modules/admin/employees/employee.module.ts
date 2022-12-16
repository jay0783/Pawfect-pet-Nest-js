import { Module } from "@nestjs/common";

import { AwsS3Module } from "@pawfect/libs/aws-s3";
import { AppMulterModule } from "@pawfect/libs/multer";
import { EmployeeManagementController } from "./employee.controller";
import { EmployeeManagementService } from "./employee.service";


@Module({
  imports: [
    AwsS3Module,
    AppMulterModule.forFeature()
  ],
  controllers: [EmployeeManagementController],
  providers: [EmployeeManagementService]
})
export class EmployeeManagementModule { }
