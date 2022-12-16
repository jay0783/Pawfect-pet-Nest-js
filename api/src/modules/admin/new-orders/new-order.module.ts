import { Module } from "@nestjs/common";

import { NewOrderController } from "./new-order.controller";
import { NewOrderService } from "./new-order.service";


@Module({
  controllers: [
    NewOrderController
  ],
  providers: [
    NewOrderService
  ]
})
export class NewOrderModule { }
