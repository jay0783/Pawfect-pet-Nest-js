import { Module } from '@nestjs/common';

import { CanceledOrderController } from './canceled-order.controller';
import { CanceledOrderService } from './canceled-order.service';


@Module({
  controllers: [CanceledOrderController],
  providers: [CanceledOrderService],
})
export class CanceledOrderModule {
}
