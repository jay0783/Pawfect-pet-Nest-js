import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GetPetExtraServiceResponse, GetPetServiceResponse } from './models';
import { PetServiceService } from './pet-service.service';

@Controller('customer/services')
@UseGuards(AuthGuard('customer-jwt'))
export class PetServiceController {
  constructor(private readonly petServiceService: PetServiceService) {}

  @Get()
  async getPetServices(): Promise<GetPetServiceResponse> {
    const response: GetPetServiceResponse = await this.petServiceService.getPetServices();
    return response;
  }

  @Get('extras')
  async getPetExtraServices(): Promise<GetPetExtraServiceResponse> {
    const response: GetPetExtraServiceResponse = await this.petServiceService.getPetExtraServices();
    return response;
  }

  @Get('extras/meet')
  async getExtraServices(): Promise<GetPetExtraServiceResponse> {
    const response: GetPetExtraServiceResponse = await this.petServiceService.getExtraServices();
    return response;
  }
}
