import {
  Controller,
  Get,
  UseGuards,
  Param,
  ParseUUIDPipe, InternalServerErrorException, Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { CustomerService } from './customer.service';
import { EmployeeEntity, UserEntity } from '@pawfect/db/entities';
import { GetCustomerProfileResponse } from './models';


@Controller('employee/customers')
@UseGuards(AuthGuard('employee-jwt'))
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
  ) {
  }

  @Get(':customerId')
  async getPetInfo(
    @Req() req: Request,
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
  ): Promise<GetCustomerProfileResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const employeeEntity: EmployeeEntity | undefined = await userEntity.employee;

    if (!employeeEntity) {
      throw new InternalServerErrorException('Employee was not found on this user');
    }

    const customerInfo: GetCustomerProfileResponse = await this.customerService.getCustomerProfileForOrder(customerId);

    return customerInfo;
  }

}
