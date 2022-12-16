import { Request } from "express";
import { Controller, Get, InternalServerErrorException, Param, ParseUUIDPipe, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { PaginationRequest } from "@pawfect/models";
import { CustomerEntity, UserEntity } from "@pawfect/db/entities";
import { GetOrdersResponse, GetOrderDetailsResponse } from "./models";
import { MapService } from "./map.service";


@Controller("customer/map")
@UseGuards(AuthGuard('customer-jwt'))
export class MapController {
  constructor(
    private readonly mapService: MapService
  ) { }


  @Get()
  async getMapOrders(
    @Req() req: Request,
    @Query() paginationRequest: PaginationRequest
  ): Promise<GetOrdersResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity: CustomerEntity | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException("User has not customer entity!", userEntity.id);
    }

    const response = await this.mapService.getMapOrders(customerEntity, paginationRequest);
    return response;
  }


  @Get(":orderId")
  async getOrderDetails(
    @Req() req: Request,
    @Param("orderId", new ParseUUIDPipe()) orderId: string
  ): Promise<GetOrderDetailsResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity: CustomerEntity | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException("User has not customer entity!", userEntity.id);
    }

    const response = await this.mapService.getOrderDetails(customerEntity, orderId);
    return response;
  }
}
