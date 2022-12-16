import { Module } from "@nestjs/common";

import { ScheduleOrderService } from "./schedule-order.service";
import { ScheduleOrderController } from "./schedule-order.controller";


@Module({
  providers: [ScheduleOrderService],
  controllers: [ScheduleOrderController],
})
export class ScheduleOrderModule {
}
