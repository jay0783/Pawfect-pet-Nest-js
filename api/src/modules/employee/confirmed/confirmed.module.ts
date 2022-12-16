import { Module } from "@nestjs/common";

import { ConfirmedController } from "./confirmed.controller";
import { ConfirmedService } from "./confirmed.service";


@Module({
  controllers: [ConfirmedController],
  providers: [ConfirmedService]
})
export class ConfirmedModule { }
