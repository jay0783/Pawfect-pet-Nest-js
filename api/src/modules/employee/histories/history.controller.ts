import { Request } from "express";
import { Controller, Get, InternalServerErrorException, Param, ParseUUIDPipe, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { EmployeeEntity, UserEntity } from "@pawfect/db/entities";
import { GetHistoryDetailsResponse, GetOrdersResponse } from "./models";
import { HistoryService } from "./history.service";
import { PaginationRequest } from "@pawfect/models";


@Controller("employee/histories")
@UseGuards(AuthGuard("employee-jwt"))
export class HistoryController {

  constructor(
    private readonly historyService: HistoryService
  ) { }


  @Get('my')
  async getMyHistories(
    @Req() req: Request,
    @Query() paginationRequest: PaginationRequest,
  ): Promise<GetOrdersResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const employeeEntity: EmployeeEntity | undefined = await userEntity.employee;

    if (!employeeEntity) {
      throw new InternalServerErrorException('Employee was not found on this user');
    }

    const response = await this.historyService.getMyHistories(employeeEntity, paginationRequest);
    return response;
  }


  @Get(":orderId")
  async getHistoryDetails(
    @Req() req: Request,
    @Param("orderId", new ParseUUIDPipe()) orderId: string
  ): Promise<GetHistoryDetailsResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const employeeEntity: EmployeeEntity | undefined = await userEntity.employee;

    if (!employeeEntity) {
      throw new InternalServerErrorException('Employee was not found on this user');
    }

    const response = await this.historyService.getHistoryDetails(employeeEntity, orderId);
    return response;
  }
}
