import { Module } from "@nestjs/common";

import { FeeController } from "./fee.controller";
import { FeeService } from "./fee.service";


@Module({
  imports: [
  ],
  controllers: [FeeController],
  providers: [FeeService],
  exports: []
})
export class FeeModule { }
