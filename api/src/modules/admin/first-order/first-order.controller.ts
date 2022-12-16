import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { PaginationRequest, SuccessModel } from '@pawfect/models';
import { FirstOrderService } from './first-order.service';
import {
  GetFirstOrdersResponse,
  SetOrderRequest,
  SetPayRequest,
} from './models';

@ApiBearerAuth()
@ApiTags('Meet & Greet')
@UseGuards(AuthGuard('admin-jwt'))
@Controller('admin/first/order')
export class FirstOrderController {
  constructor(private readonly firatOrderService: FirstOrderService) {}

  @Get()
  async getFirstOrders(
    @Query() paginationRequest: PaginationRequest,
  ): Promise<GetFirstOrdersResponse> {
    const response = await this.firatOrderService.getFirstOrders(
      paginationRequest,
    );
    return response;
  }

  @Post(':orderId/employee/:employeeId')
  async setEmployeeToFirstOrder(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @Param('employeeId', new ParseUUIDPipe()) employeeId: string,
  ): Promise<SuccessModel> {
    const response: SuccessModel = await this.firatOrderService.setEmployeeFirstOrder(
      orderId,
      employeeId,
    );
    return response;
  }

  @Post(':orderId/cancel')
  async cancelOrder(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
  ): Promise<SuccessModel> {
    const response = await this.firatOrderService.cancelOrder(orderId);
    return response;
  }

  @Post(':orderId')
  async setOrder(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @Body() setRequest: SetOrderRequest,
  ): Promise<SuccessModel> {
    const response: SuccessModel = await this.firatOrderService.setOrder(
      orderId,
      setRequest,
    );
    return response;
  }

  @Post(':orderId/customer/:customerId')
  async payOrder(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
    @Body() setPayRequest: SetPayRequest,
  ): Promise<SuccessModel> {
    const response: SuccessModel = await this.firatOrderService.payOrder(
      orderId,
      customerId,
      setPayRequest,
    );
    return response;
  }

  @Get('cancel')
  async getCancelOrders(
    @Query() paginationRequest: PaginationRequest,
  ): Promise<GetFirstOrdersResponse> {
    const response = await this.firatOrderService.getCancelOrders(
      paginationRequest,
    );
    return response;
  }

  @Post(':orderId/complete')
  async CompleteOrders(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
  ): Promise<SuccessModel> {
    const response = await this.firatOrderService.CompleteOrders(orderId);
    return response;
  }
}
