import { Request } from "express";
import { Controller, Get, InternalServerErrorException, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { EmployeeEntity, UserEntity } from "@pawfect/db/entities";
import { PaginationRequest } from "@pawfect/models";
import { GetMyPayrollsResponse, GetTotalPayrollsResponse } from "./models";
import { PayrollService } from "./payroll.service";


@Controller("employee/payrolls")
@UseGuards(AuthGuard("employee-jwt"))
export class PayrollController {
  constructor(
    private readonly payrollService: PayrollService
  ) { }


  @Get("my")
  async getMyPayrolls(
    @Req() req: Request,
    @Query() paginationRequest: PaginationRequest
  ): Promise<GetMyPayrollsResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const employeeEntity: EmployeeEntity | undefined = await userEntity.employee;

    if (!employeeEntity) {
      throw new InternalServerErrorException('Employee was not found on this user');
    }
    const response = await this.payrollService.getMyPayrolls(employeeEntity, paginationRequest);
    return response;
  }


  @Get("my/total")
  async getMyTotalPayrolls(
    @Req() req: Request
  ): Promise<GetTotalPayrollsResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const employeeEntity: EmployeeEntity | undefined = await userEntity.employee;

    if (!employeeEntity) {
      throw new InternalServerErrorException('Employee was not found on this user');
    }

    const response = await this.payrollService.getMyTotalPayrolls(employeeEntity);
    return response;
  }
}
