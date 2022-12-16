import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationRequest } from '@pawfect/models';
import { HistoryService } from './history.service';
import {
  GetHistoryOrderDetailsResponse,
  GetHistoryOrdersResponse,
} from './models';

@ApiBearerAuth()
@ApiTags('History')
@Controller('admin/histories')
@UseGuards(AuthGuard('admin-jwt'))
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  async getHistoryOrders(
    @Query() paginationRequest: PaginationRequest,
    @Query() name: PaginationRequest,
  ): Promise<GetHistoryOrdersResponse> {
    const response = await this.historyService.getHistoryOrders(
      paginationRequest,
      name,
    );
    return response;
  }

  @Get(':orderId')
  async getHistoryOrderDetails(
    @Param('orderId') orderId: string,
  ): Promise<GetHistoryOrderDetailsResponse> {
    const response = await this.historyService.getHistoryOrderDetails(orderId);
    return response;
  }
}
