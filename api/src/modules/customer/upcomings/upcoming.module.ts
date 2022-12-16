import { Module } from "@nestjs/common";

import { UpcomingService } from "./upcoming.service";
import { UpcomingController } from "./upcoming.controller";


@Module({
  controllers: [UpcomingController],
  providers: [UpcomingService],
})
export class UpcomingModule {
}
