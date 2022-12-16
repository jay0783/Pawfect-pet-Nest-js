import {
  Controller, Get,
  InternalServerErrorException, Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { RatingService } from './rating.service';
import { EmployeeEntity, UserEntity } from '@pawfect/db/entities';
import { PaginationRequest } from '@pawfect/models';
import { GetMyRatingsResponse, GetMyTotalRatingResponse } from './models';


@UseGuards(AuthGuard('employee-jwt'))
@Controller('employee/ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {
  }


  @Get("my/total")
  async getMyTotalRating(@Req() req: Request): Promise<GetMyTotalRatingResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const employeeEntity: EmployeeEntity | undefined = await userEntity.employee;

    if (!employeeEntity) {
      throw new InternalServerErrorException('Employee was not found on this user');
    }
    const response = await this.ratingService.getMyTotalRating(employeeEntity);
    return response;
  }


  @Get('my')
  async getMyRatings(@Req() req: Request, @Query() paginationOpt: PaginationRequest): Promise<GetMyRatingsResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const employeeEntity: EmployeeEntity | undefined = await userEntity.employee;

    if (!employeeEntity) {
      throw new InternalServerErrorException('Employee was not found on this user');
    }

    return await this.ratingService.getMyRatings(employeeEntity, paginationOpt);
  }
}
