import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as url from 'url';

import { FileLib } from '@pawfect/libs/multer';
import { EmployeeEntity, UserEntity } from '@pawfect/db/entities';
import { SuccessModel } from '@pawfect/models';
import { MapService } from './map.service';
import {
  GetOrderDetailsResponse,
  GetOrdersResponse,
  SaveActionRequest,
  SavePositionRequest,
  SaveTrackedTimeRequest,
  AttachPhotoRequest,
  AttachPhotoResponse,
} from './models';
import { GetHistoryDetailsResponse } from './models/map.history';

@UseGuards(AuthGuard('employee-jwt'))
@Controller('employee/map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get()
  async getMapOrders(@Req() req: Request): Promise<GetOrdersResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const employeeEntity:
      | EmployeeEntity
      | undefined = await userEntity.employee;

    if (!employeeEntity) {
      throw new InternalServerErrorException(
        'Employee was not found on this user',
      );
    }

    const response = await this.mapService.getMapOrders(employeeEntity);
    return response;
  }

  @Get(':orderId')
  async getMapOrderDetails(
    @Req() req: Request,
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
  ): Promise<GetOrderDetailsResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const employeeEntity:
      | EmployeeEntity
      | undefined = await userEntity.employee;

    if (!employeeEntity) {
      throw new InternalServerErrorException(
        'Employee was not found on this user',
      );
    }

    const response = await this.mapService.getMapOrderDetails(
      employeeEntity,
      orderId,
    );
    return response;
  }

  @Post(':orderId/next')
  async toNextStage(
    @Req() req: Request,
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
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

    const response = await this.mapService.toNextStage(employeeEntity, orderId);
    return response;
  }

  @Post(':orderId/position')
  async savePosition(
    @Req() req: Request,
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @Body() savePositionRequest: SavePositionRequest,
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

    const response = await this.mapService.savePosition(
      employeeEntity,
      orderId,
      savePositionRequest,
    );
    return response;
  }

  @Post(':orderId/action')
  async saveAction(
    @Req() req: Request,
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @Body() saveActionRequest: SaveActionRequest,
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

    const response = await this.mapService.saveAction(
      employeeEntity,
      orderId,
      saveActionRequest,
    );
    return response;
  }

  @Post(':orderId/time')
  async saveTrackedTime(
    @Req() req: Request,
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @Body() saveTimeRequest: SaveTrackedTimeRequest,
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

    const response = await this.mapService.saveTrackedTime(
      employeeEntity,
      orderId,
      saveTimeRequest,
    );
    return response;
  }

  @Post(':orderId/attachment')
  @UseInterceptors(FileInterceptor('attachment'))
  async attachPhoto(
    @Req() req: Request,
    @Param('orderId') orderId: string,
    @UploadedFile() attachment: FileLib,
    @Body() attachPhotoRequest: AttachPhotoRequest,
  ): Promise<AttachPhotoResponse> {
    if (!attachment) {
      throw new BadRequestException('attachment is required');
    }

    const userEntity: UserEntity = req.getAuthEntity();
    const employeeEntity:
      | EmployeeEntity
      | undefined = await userEntity.employee;

    if (!employeeEntity) {
      throw new InternalServerErrorException(
        'Employee was not found on this user',
      );
    }

    const response = await this.mapService.attachPhoto(
      employeeEntity,
      orderId,
      attachPhotoRequest,
      attachment,
    );
    return response;
  }

  @Post(':orderId/finish')
  async finishOrder(
    @Req() req: Request,
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
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

    const response = await this.mapService.finishOrder(employeeEntity, orderId);
    return response;
  }

  //send mail
  @Get(':orderId/mail')
  async getHistoryDetails(
    @Req() req: Request,
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
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

    const response = await this.mapService.getHistoryDetails(
      employeeEntity,
      orderId,
    );
    return response;
  }
}
