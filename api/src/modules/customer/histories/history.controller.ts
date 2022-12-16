import { Request } from "express";
import { Controller, Get, InternalServerErrorException, Param, ParseUUIDPipe, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { CustomerEntity, UserEntity } from "@pawfect/db/entities";
import { GetHistoryDetailsResponse, GetOrdersResponse } from "./models";
import { HistoryService } from "./history.service";
import { PaginationRequest } from "@pawfect/models";


@Controller("customer/histories")
@UseGuards(AuthGuard("customer-jwt"))
export class HistoryController {

  constructor(
    private readonly historyService: HistoryService
  ) { }


  @Get("my")
  async getMyHistories(
    @Req() req: Request,
    @Query() paginationRequest: PaginationRequest,
  ): Promise<GetOrdersResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity: CustomerEntity | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException("User has not customer entity!", userEntity.id);
    }

    const response = await this.historyService.getMyHistories(customerEntity, paginationRequest);
    return response;
  }


  @Get(":orderId")
  async getHistoryDetails(
    @Req() req: Request,
    @Param("orderId", new ParseUUIDPipe()) orderId: string
  ): Promise<GetHistoryDetailsResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity: CustomerEntity | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException("User has not customer entity!", userEntity.id);
    }

    const response = await this.historyService.getHistoryDetails(customerEntity, orderId);
    return response;
  }
}
