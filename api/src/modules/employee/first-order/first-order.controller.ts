import { Request } from 'express';
import {
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
import { FirstOrderService } from './first-order.service';
import { GetFirstOrdersResponse, GetNewOrderDetailsResponse } from './models';

@UseGuards(AuthGuard('employee-jwt'))
@Controller('employee/first-orders')
export class FirstOrderController {
  constructor(private readonly firstOrderService: FirstOrderService) {}

  @Get()
  async getNewOrders(
    @Req() req: Request,
    @Query() paginationRequest: PaginationRequest,
  ): Promise<GetFirstOrdersResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const employeeEntity:
      | EmployeeEntity
      | undefined = await userEntity.employee;

    if (!employeeEntity) {
      throw new InternalServerErrorException(
        'Employee was not found on this user',
      );
    }

    const response = await this.firstOrderService.getNewOrders(
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

    const response = await this.firstOrderService.getNewOrderDetails(
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

    const response = await this.firstOrderService.acceptOrder(
      employeeEntity,
      orderId,
    );
    return response;
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

    const response = await this.firstOrderService.cancelOrder(
      employeeEntity,
      orderId,
    );
    return response;
  }

  @Post(':orderId/finished')
  async finishedOrder(
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

    const response = await this.firstOrderService.finishedOrder(
      employeeEntity,
      orderId,
    );
    return response;
  }
}
