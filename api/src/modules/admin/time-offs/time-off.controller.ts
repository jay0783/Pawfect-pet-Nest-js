import {
  Controller,
  Get,
  Post,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PaginationRequest, SuccessModel } from '@pawfect/models';
import { TimeOffService } from './time-off.service';
import { GetTimeOffDetailsResponse, GetTimeOffsResponse } from './models';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Time-off')
@Controller('admin/time-offs')
@UseGuards(AuthGuard('admin-jwt'))
export class TimeOffController {
  constructor(private readonly timeOffService: TimeOffService) {}

  @Get()
  async getAll(
    @Query() paginationOpt: PaginationRequest,
  ): Promise<GetTimeOffsResponse> {
    const response = await this.timeOffService.getAllTimeOffs(paginationOpt);
    return response;
  }

  @Get(':timeOffId')
  async getTimeOffDetails(
    @Param('timeOffId', new ParseUUIDPipe()) timeOffId: string,
  ): Promise<GetTimeOffDetailsResponse> {
    const response = await this.timeOffService.getTimeOffDetails(timeOffId);
    return response;
  }

  @Post(':timeOffId/accept')
  async acceptTimeOff(
    @Param('timeOffId', new ParseUUIDPipe()) timeOffId: string,
  ): Promise<SuccessModel> {
    const response = await this.timeOffService.acceptTimeOff(timeOffId);
    return response;
  }

  @Post(':timeOffId/decline')
  async declineTimeOff(
    @Param('timeOffId', new ParseUUIDPipe()) timeOffId: string,
  ): Promise<SuccessModel> {
    const response = await this.timeOffService.declineTimeOff(timeOffId);
    return response;
  }
}
