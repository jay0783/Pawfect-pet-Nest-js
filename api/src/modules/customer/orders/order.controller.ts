import { Request } from 'express';
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CustomerEntity, UserEntity } from '@pawfect/db/entities';
import { PaginationRequest, SuccessModel } from '@pawfect/models';
import {
  CreateMainOrderRequest,
  GetMainOrderDetailsResponse,
  GetMainOrdersResponse,
  MainOrderViewModel,
  CancelMainOrderRequest,
  CancelOrderRequest,
  CreateFirstOrderRequest,
  StatusResponse,
} from './models';
import { OrderService } from './order.service';
import { ExtraOrderViewModel } from './models/extra-order.vm';
import { SocketGateway } from 'src/modules/socket/socket.gateway';

@Controller('customer/orders')
@UseGuards(AuthGuard('customer-jwt'))
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly socketGateway: SocketGateway,
  ) {}

  @Get()
  async getMainOrders(
    @Req() req: Request,
    @Query() paginationRequest: PaginationRequest,
  ): Promise<GetMainOrdersResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException(
        'User has not customer entity!',
        userEntity.id,
      );
    }

    const response = await this.orderService.getMainOrders(
      customerEntity,
      paginationRequest,
    );
    return response;
  }

  @Get('status')
  async getStatus(
    @Req() req: Request,
    // @Query() paginationRequest: PaginationRequest,
  ): Promise<StatusResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException(
        'User has not customer entity!',
        userEntity.id,
      );
    }

    const response = await this.orderService.getStatus(customerEntity);
    return response;
  }

  @Get(':mainOrderId')
  async getMainOrderDetails(
    @Req() req: Request,
    @Param('mainOrderId', new ParseUUIDPipe()) mainOrderId: string,
  ): Promise<GetMainOrderDetailsResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException(
        'User has not customer entity!',
        userEntity.id,
      );
    }

    const response: GetMainOrderDetailsResponse = await this.orderService.getMainOrderDetails(
      customerEntity,
      mainOrderId,
    );
    return response;
  }

  @Post()
  async createMainOrder(
    @Req() req: Request,
    @Body() createMainOrderRequest: CreateMainOrderRequest,
  ): Promise<MainOrderViewModel> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException(
        'User has not customer entity!',
        userEntity.id,
      );
    }
    // console.log('dates_request=====>', createMainOrderRequest.dates);
    const response: MainOrderViewModel = await this.orderService.createMainOrder(
      customerEntity,
      createMainOrderRequest,
    );
    this.socketGateway.wss.emit('new_order', { response: response });
    return response;
  }

  @Post('cancel')
  async cancelMainOrder(
    @Req() req: Request,
    @Body() cancelRequest: CancelMainOrderRequest,
  ): Promise<SuccessModel> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException(
        'User has not customer entity!',
        userEntity.id,
      );
    }

    const response: SuccessModel = await this.orderService.cancelMainOrder(
      customerEntity,
      cancelRequest,
    );
    return response;
  }

  @Post('cancel/order')
  async cancelOrder(
    @Req() req: Request,
    @Body() cancelRequest: CancelOrderRequest,
  ): Promise<SuccessModel> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException(
        'User has not customer entity!',
        userEntity.id,
      );
    }
    const response = await this.orderService.cancelOrder(
      customerEntity,
      cancelRequest,
    );

    this.socketGateway.wss.emit('cancelOrder', response);
    return response;
  }

  @Post('first')
  async createExtraMainOrder(
    @Req() req: Request,
    @Body() createFirstOrderRequest: CreateFirstOrderRequest,
  ): Promise<SuccessModel> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException(
        'User has not customer entity!',
        userEntity.id,
      );
    }

    const response = await this.orderService.createExtraMainOrder(
      customerEntity,
      createFirstOrderRequest,
    );
    return response;
  }
}
