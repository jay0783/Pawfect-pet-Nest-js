import { Module } from "@nestjs/common";

import { HolidayController } from "./holiday.controller";
import { HolidayService } from "./holiday.service";


@Module({
  imports: [
  ],
  controllers: [HolidayController],
  providers: [HolidayService],
  exports: []
})
export class HolidayModule { }
