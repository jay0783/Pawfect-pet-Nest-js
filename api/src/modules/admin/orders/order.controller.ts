import { Request } from 'express';
import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
  Patch,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationRequest, SuccessModel } from '@pawfect/models';

import {
  CancelOrderRequest,
  ChangeDateRequest,
  GetMainOrdersResponse,
  GetMainOrderDetailsResponse,
  ApplyDiscountRequest,
} from './models';
import { OrderService } from './order.service';
import { MainOrderEntity, OrderEntity } from '@pawfect/db/entities';

@ApiBearerAuth()
@ApiTags('Orders')
@UseGuards(AuthGuard('admin-jwt'))
@Controller('admin/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getMainOrders(
    @Query() paginationRequest: PaginationRequest,
  ): Promise<GetMainOrdersResponse> {
    const response = await this.orderService.getMainOrders(paginationRequest);
    return response;
  }

  @Get('confirmed')
  async getConfirmedMainOrders(
    @Query() paginationRequest: PaginationRequest,
  ): Promise<GetMainOrdersResponse> {
    const response = await this.orderService.getCofirmedMainOrders(
      paginationRequest,
    );
    return response;
  }

  @Get(':mainOrderId')
  async getMainOrderDetails(
    @Req() req: Request,
    @Param('mainOrderId', new ParseUUIDPipe()) mainOrderId: string,
  ): Promise<GetMainOrderDetailsResponse> {
    // const userEntity: UserEntity = req.getAuthEntity();
    // const customerEntity:
    //   | CustomerEntity
    //   | undefined = await userEntity.customer;
    // if (!customerEntity) {
    //   throw new InternalServerErrorException(
    //     'User has not customer entity!',
    //     userEntity.id,
    //   );
    // }

    const response: GetMainOrderDetailsResponse = await this.orderService.getMainOrderDetails(
      mainOrderId,
    );
    return response;
  }

  @Post(':orderId/employee/:employeeId')
  async setEmployeeToOrder(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @Param('employeeId', new ParseUUIDPipe()) employeeId: string,
  ): Promise<SuccessModel> {
    const response: SuccessModel = await this.orderService.setEmployeeOrder(
      orderId,
      employeeId,
    );
    return response;
  }

  @Post('all/:mainOrderId/employee/:employeeId')
  async setEmployeeToMainOrder(
    @Param('mainOrderId', new ParseUUIDPipe()) mainOrderId: string,
    @Param('employeeId', new ParseUUIDPipe()) employeeId: string,
  ): Promise<SuccessModel> {
    const mainOrderEntity: MainOrderEntity = await this.orderService.findMainOrder(
      mainOrderId,
    );

    let ordersAssigned: Boolean[] = new Array();
    const orders: Array<OrderEntity> = await mainOrderEntity.orders;
    for (let i = 0; i < orders.length; i++) {
      const assignOrder: Boolean = await this.orderService.setEmployeeToMainOrder(
        String(orders[i]),
        employeeId,
      );
      ordersAssigned.push(assignOrder);
    }
    const allOrdersAssigned = ordersAssigned.every(Boolean);
    if (!allOrdersAssigned) {
      throw new InternalServerErrorException('Some orders were not assigned !');
    }
    return new SuccessModel();
  }

  @Post(':orderId/date/change')
  async changeDate(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @Body() changeDateRequest: ChangeDateRequest,
  ): Promise<SuccessModel> {
    const response = await this.orderService.changeDate(
      orderId,
      changeDateRequest,
    );
    return response;
  }

  @Post(':orderId/cancel')
  async cancelOrder(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @Body() commentRequest: CancelOrderRequest,
  ): Promise<SuccessModel> {
    const response = await this.orderService.cancelOrder(
      orderId,
      commentRequest,
    );
    return response;
  }

  @Patch(':mainOrderId/change-service/:serviceId')
  async changeService(
    @Param('mainOrderId', new ParseUUIDPipe()) mainOrderId: string,
    @Param('serviceId', new ParseUUIDPipe()) serviceId: string,
  ): Promise<SuccessModel> {
    const changeService = await this.orderService.changeService(
      mainOrderId,
      serviceId,
    );
    return new SuccessModel();
  }

  @Patch('discount/:orderId')
  async applyDiscount(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @Body() applyDiscountRequest: ApplyDiscountRequest,
  ): Promise<SuccessModel> {
    const status = await this.orderService.applyDiscountOnOrder(
      orderId,
      applyDiscountRequest.discount,
    );
    return new SuccessModel();
  }
}
