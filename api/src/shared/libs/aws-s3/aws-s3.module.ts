import { Module } from "@nestjs/common";

import { AwsS3Lib } from "./aws-s3.lib";
import { CompressService } from "./compress.service";


@Module({
  imports: [],
  providers: [AwsS3Lib, CompressService],
  exports: [AwsS3Lib]
})
export class AwsS3Module { }
