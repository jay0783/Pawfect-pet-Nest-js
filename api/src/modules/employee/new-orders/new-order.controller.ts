import { Request } from 'express';
import {
  BadRequestException,
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

import { EmployeeEntity, UserEntity } from '@pawfect/db/entities';
import { PaginationRequest, SuccessModel } from '@pawfect/models';
import {
  GetNewOrderDetailsResponse,
  GetNewOrdersResponse,
  AcceptOrdersRequest,
} from './models';
import { NewOrderService } from './new-order.service';

@UseGuards(AuthGuard('employee-jwt'))
@Controller('employee/new-orders')
export class NewOrderController {
  constructor(private readonly newOrderService: NewOrderService) {}

  @Get()
  async getNewOrders(
    @Req() req: Request,
    @Query() paginationRequest: PaginationRequest,
  ): Promise<GetNewOrdersResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const employeeEntity:
      | EmployeeEntity
      | undefined = await userEntity.employee;

    if (!employeeEntity) {
      throw new InternalServerErrorException(
        'Employee was not found on this user',
      );
    }

    const response = await this.newOrderService.getNewOrders(
      employeeEntity,
      paginationRequest,
    );
    return response;
  }

  @Get(':orderId')
  async getNewOrderDetails(
    @Req() req: Request,
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
  ): Promise<GetNewOrderDetailsResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const employeeEntity:
      | EmployeeEntity
      | undefined = await userEntity.employee;

    if (!employeeEntity) {
      throw new InternalServerErrorException(
        'Employee was not found on this user',
      );
    }

    const response = await this.newOrderService.getNewOrderDetails(
      employeeEntity,
      orderId,
    );
    return response;
  }

  @Post(':orderId/accept')
  async acceptOrder(
    @Req() req: Request,
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
  ): Promise<SuccessModel> {
    const userEntity: UserEntity = req.getAuthEntity();
    const employeeEntity:
      | EmployeeEntity
      | undefined = await userEntity.employee;

    if (!employeeEntity) {
      throw new InternalServerErrorException(
        'Employee was not found on this user',
      );
    }

    const response = await this.newOrderService.acceptOrder(
      employeeEntity,
      orderId,
    );
    return response;
  }

  @Post('accept-orders')
  async acceptPartialOrders(
    @Req() req: Request,
    @Body() acceptOrdersRequest: AcceptOrdersRequest,
  ): Promise<SuccessModel> {
    const { orderIds } = acceptOrdersRequest;
    if (!orderIds || !orderIds.length) {
      throw new BadRequestException('Please select atleast one order');
    }
    const userEntity: UserEntity = req.getAuthEntity();
    const employeeEntity:
      | EmployeeEntity
      | undefined = await userEntity.employee;

    if (!employeeEntity) {
      throw new InternalServerErrorException(
        'Employee was not found on this user',
      );
    }

    for (const orderId of orderIds) {
      const response = await this.newOrderService.acceptOrder(
        employeeEntity,
        orderId,
      );
    }
    return new SuccessModel();
  }

  @Post(':orderId/cancel')
  async cancelOrder(
    @Req() req: Request,
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
  ): Promise<SuccessModel> {
    const userEntity: UserEntity = req.getAuthEntity();
    const employeeEntity:
      | EmployeeEntity
      | undefined = await userEntity.employee;

    if (!employeeEntity) {
      throw new InternalServerErrorException(
        'Employee was not found on this user',
      );
    }

    const response = await this.newOrderService.cancelOrder(
      employeeEntity,
      orderId,
    );
    return response;
  }
}
