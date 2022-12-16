import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { FeeEnum } from '@pawfect/db/entities/enums';
import { FeeService } from './fee.service';
import { GetFeeResponse, SetFeeRequest } from './models';

@ApiBearerAuth()
@ApiTags('Fees')
@UseGuards(AuthGuard('admin-jwt'))
@Controller('admin/fees')
export class FeeController {
  constructor(private readonly feeService: FeeService) {}

  @Get('cancellation')
  async getCancellationFee(): Promise<GetFeeResponse> {
    const response = await this.feeService.getFee(FeeEnum.CANCELLATION);
    return response;
  }

  @Patch('cancellation')
  async setCancellationFee(
    @Body() setFeeRequest: SetFeeRequest,
  ): Promise<GetFeeResponse> {
    const response = await this.feeService.setFee(
      setFeeRequest,
      FeeEnum.CANCELLATION,
    );
    return response;
  }

  @Get('holiday')
  async getHolidayFee(): Promise<GetFeeResponse> {
    const response = await this.feeService.getFee(FeeEnum.HOLIDAY);
    return response;
  }

  @Patch('holiday')
  async setHolidayFee(
    @Body() setFeeRequest: SetFeeRequest,
  ): Promise<GetFeeResponse> {
    const response = await this.feeService.setFee(
      setFeeRequest,
      FeeEnum.HOLIDAY,
    );
    return response;
  }
}
