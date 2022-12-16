import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

import { Observable } from 'rxjs';
import { OrderService } from '../customer/orders/order.service';
@WebSocketGateway()
export class SocketGateway implements OnGatewayInit {
  //   constructor(private readonly orderService: OrderService) {}
  @WebSocketServer()
  wss: Server;

  private logger: Logger = new Logger('SocketGateway');

  afterInit(server: any) {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('chatToServer')
  handleMessage(
    client: Socket,
    message: { sender: string; room: string; message: string },
  ) {
    console.log('[][]===', message);

    this.wss.to(message.room).emit('chatToClient', message);
  }

  @SubscribeMessage('joinRoom')
  handleRoomJoin(client: Socket, room: string) {
    client.join(room);
    console.log('User Connected');
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleRoomLeave(client: Socket, room: string) {
    client.leave(room);
    console.log('user Leave');
    client.emit('leftRoom', room);
  }

  @SubscribeMessage('subscribe')
  onHandelSubscribe(
    client: Socket,
    message: { room: string; message: string },
  ) {
    console.log('insubscribe-=======', client.id, message);
    client.emit('subscribe', message);
    // this.wss.to(message.room).emit('subscribe', message);
  }
}
