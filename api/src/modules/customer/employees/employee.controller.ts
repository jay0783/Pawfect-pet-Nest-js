import { Request } from "express";
import { Body, Controller, Get, InternalServerErrorException, Param, ParseUUIDPipe, Post, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { CustomerEntity, UserEntity } from "@pawfect/db/entities";
import { EmployeeService } from "./employee.service";
import { GetEmployeeProfileResponse, RateEmployeeRequest } from "./models";
import { SuccessModel } from "@pawfect/models";


@UseGuards(AuthGuard("customer-jwt"))
@Controller("customer/employees")
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService
  ) { }


  @Get(":employeeId")
  async getEmployeeProfile(
    @Req() req: Request,
    @Param("employeeId", new ParseUUIDPipe()) employeeId: string,
    @Query("orderId", new ParseUUIDPipe()) orderId: string
  ): Promise<GetEmployeeProfileResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity: CustomerEntity | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException('User has not customer entity!');
    }

    const response = await this.employeeService.getEmployeeProfile(customerEntity, employeeId, orderId);
    return response;
  }


  @Post(":employeeId/rate")
  async rateEmployee(
    @Req() req: Request,
    @Param("employeeId", new ParseUUIDPipe()) employeeId: string,
    @Body() rateRequest: RateEmployeeRequest
  ): Promise<SuccessModel> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity: CustomerEntity | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException('User has not customer entity!');
    }

    const response = await this.employeeService.rateEmployee(customerEntity, employeeId, rateRequest);
    return response;
  }
}
