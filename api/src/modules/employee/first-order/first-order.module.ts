import { Module } from '@nestjs/common';

import { FirstOrderController } from './first-order.controller';
import { FirstOrderService } from './first-order.service';

@Module({
  controllers: [FirstOrderController],
  providers: [FirstOrderService],
})
export class FirstOrderModule {}
