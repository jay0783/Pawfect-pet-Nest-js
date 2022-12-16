import { Module } from '@nestjs/common';
import { OrderModule } from '../customer/orders/order.module';
import { SocketGateway } from './socket.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
