import { Request } from 'express';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Patch,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { EmployeeEntity, UserEntity } from '@pawfect/db/entities';
import { DatesManager } from '@pawfect/services';
import {
  AddTimeOffRequest,
  GetTimeOffsResponse,
  UpdateTimeOffRequest,
} from './models';
import { TimeOffService } from './time-off.service';
import { PaginationRequest, SuccessModel } from '@pawfect/models';

@UseGuards(AuthGuard('employee-jwt'))
@Controller('employee/time-offs')
export class TimeOffController {
  constructor(private readonly timeOffsService: TimeOffService) {}

  @Put()
  async addTimeOff(
    @Req() req: Request,
    @Body() addTimeOffRequest: AddTimeOffRequest,
  ): Promise<SuccessModel> {
    const userEntity: UserEntity = req.getAuthEntity();
    const employeeEntity:
      | EmployeeEntity
      | undefined = await userEntity.employee;

    if (!employeeEntity) {
      throw new InternalServerErrorException(
        'Employee was not found on this user',
      );
    }

    const dateManager = new DatesManager(addTimeOffRequest.dates)
      .setDateTimesToZero()
      .removeDuplicates();

    if (!dateManager.hasOnlyFutureDates) {
      throw new BadRequestException(
        'Day offs do not contain future or present time',
      );
    }
    const response = await this.timeOffsService.addTimeOffs(
      employeeEntity,
      addTimeOffRequest,
      dateManager,
    );
    return response;
  }

  @Get()
  async getTimeOffs(
    @Req() req: Request,
    @Query() paginationRequest: PaginationRequest,
  ): Promise<GetTimeOffsResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const employeeEntity:
      | EmployeeEntity
      | undefined = await userEntity.employee;

    if (!employeeEntity) {
      throw new InternalServerErrorException(
        'Employee was not found on this user',
      );
    }

    const response = await this.timeOffsService.getTimeOffs(
      employeeEntity,
      paginationRequest,
    );
    return response;
  }

  @Patch(':timeOffId')
  async editTimeOff(
    @Req() req: Request,
    @Param('timeOffId', new ParseUUIDPipe()) timeOffId: string,
    @Body() updateTimeOffRequest: UpdateTimeOffRequest,
  ): Promise<SuccessModel> {
    const userEntity: UserEntity = req.getAuthEntity();
    const employeeEntity:
      | EmployeeEntity
      | undefined = await userEntity.employee;

    if (!employeeEntity) {
      throw new InternalServerErrorException(
        'Employee was not found on this user',
      );
    }

    const dateManager = new DatesManager(updateTimeOffRequest.dates)
      .setDateTimesToZero()
      .removeDuplicates();

    if (!dateManager.hasOnlyFutureDates) {
      throw new BadRequestException(
        'Day offs do not contain future or present time',
      );
    }

    const response = await this.timeOffsService.editTimeOff(
      employeeEntity,
      timeOffId,
      updateTimeOffRequest,
      dateManager,
    );
    return response;
  }
}
