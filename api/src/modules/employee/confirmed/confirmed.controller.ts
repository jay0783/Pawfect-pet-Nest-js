import { Request } from 'express';
import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { EmployeeEntity, UserEntity } from '@pawfect/db/entities';
import {
  GetConfirmedOrdersRequest,
  GetConfirmedOrdersResponse,
} from './models';
import { ConfirmedService } from './confirmed.service';
import { GetConfirmedOrderDetailsResponse } from './models/get-confirmed-order-details.response';

@Controller('employee/confirmed')
@UseGuards(AuthGuard('employee-jwt'))
export class ConfirmedController {
  constructor(private readonly confirmedService: ConfirmedService) {}

  @Get()
  async getConfirmedOrders(
    @Req() req: Request,
    @Query() paginationOptions: GetConfirmedOrdersRequest,
  ): Promise<GetConfirmedOrdersResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const employeeEntity:
      | EmployeeEntity
      | undefined = await userEntity.employee;

    if (!employeeEntity) {
      throw new InternalServerErrorException(
        'Employee was not found on this user',
      );
    }

    const response = await this.confirmedService.getConfirmedOrders(
      employeeEntity,
      paginationOptions,
    );
    return response;
  }

  @Get(':orderId')
  async getConfirmedOrderDetails(
    @Req() req: Request,
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
  ): Promise<GetConfirmedOrderDetailsResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const employeeEntity:
      | EmployeeEntity
      | undefined = await userEntity.employee;

    if (!employeeEntity) {
      throw new InternalServerErrorException(
        'Employee was not found on this user',
      );
    }

    const response = await this.confirmedService.getConfirmedOrderDetails(
      employeeEntity,
      orderId,
    );
    return response;
  }
}
