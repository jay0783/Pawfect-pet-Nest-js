import {
  Controller,
  Get,
  UseGuards,
  Param,
  ParseUUIDPipe, InternalServerErrorException, Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { PetService } from './pet.service';
import { EmployeeEntity, UserEntity } from '@pawfect/db/entities';
import { PetInfoResponse } from '@pawfect/models';


@Controller('employee/pets')
@UseGuards(AuthGuard('employee-jwt'))
export class PetController {
  constructor(
    private readonly petService: PetService,
  ) {
  }

  @Get(':petId')
  async getPetInfo(
    @Req() req: Request,
    @Param('petId', new ParseUUIDPipe()) petId: string,
  ): Promise<PetInfoResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const employeeEntity: EmployeeEntity | undefined = await userEntity.employee;

    if (!employeeEntity) {
      throw new InternalServerErrorException('Employee was not found on this user');
    }

    const petInfo: PetInfoResponse = await this.petService.getPetInfoForOrder(petId);

    return petInfo;
  }

}
