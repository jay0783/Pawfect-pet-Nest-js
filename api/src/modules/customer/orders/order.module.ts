import { Module } from '@nestjs/common';
import { SocketGateway } from 'src/modules/socket/socket.gateway';
import { SocketModule } from 'src/modules/socket/socket.module';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [SocketModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
