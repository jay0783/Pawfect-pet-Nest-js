import { Request } from "express";
import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { CustomerEntity, UserEntity } from "@pawfect/db/entities";
import { GetUpcomingOrderDetailsResponse,GetUpcomingOrdersRequest, GetUpcomingOrdersResponse } from "./models";
import { UpcomingService } from "./upcoming.service";


@Controller('customer/upcomings')
@UseGuards(AuthGuard('customer-jwt'))
export class UpcomingController {
  constructor(
    private readonly upcomingOrdersService: UpcomingService,
  ) {
  }


  @Get()
  async getUpcomingOrders(
    @Req() req: Request,
    @Query() getUpcomingOrdersRequest: GetUpcomingOrdersRequest,
  ): Promise<GetUpcomingOrdersResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity: CustomerEntity | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException("User has not customer entity", userEntity.id);
    }

    const response = await this.upcomingOrdersService.getUpcomingOrders(customerEntity, getUpcomingOrdersRequest);
    return response;
  }


  @Get(":orderId")
  async getUpcomingOrderDetails(
    @Req() req: Request,
    @Param('orderId', new ParseUUIDPipe()) orderId: string
  ): Promise<GetUpcomingOrderDetailsResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity: CustomerEntity | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException("User has not customer entity", userEntity.id);
    }

    const response = await this.upcomingOrdersService.getUpcomingOrderDetails(customerEntity, orderId);
    return response;
  }

}
