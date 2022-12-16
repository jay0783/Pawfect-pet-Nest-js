import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Put,
  Body,
  Query,
  ParseUUIDPipe,
  UseGuards,
  InternalServerErrorException,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Req,
  Delete,
} from '@nestjs/common';
import { FileLib } from '@pawfect/libs/aws-s3';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

import {
  PaginationRequest,
  PaginationResponse,
  SuccessModel,
} from '@pawfect/models';
import { PetService } from './pet.service';
import {
  PetProfileResponse,
  PetItemListResponse,
  UpdateDogRequest,
  UpdateCatRequest,
  UpdateSmallAnimalRequest,
  AddPetResponse,
  AddSmallPetRequest,
  AddCatRequest,
  AddDogRequest,
} from './models';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetVaccinationResponse } from 'src/modules/customer/pets/models/get-vaccination.response';

@ApiBearerAuth()
@ApiTags('Pet')
@Controller('admin/pets')
@UseGuards(AuthGuard('admin-jwt'))
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Get(':petId')
  async getPetProfile(
    @Param('petId', new ParseUUIDPipe()) petId: string,
  ): Promise<PetProfileResponse> {
    return this.petService.getPetProfile(petId);
  }

  @Get(':petId/vaccinations')
  async getVaccinations(
    @Param('petId', new ParseUUIDPipe()) petId: string,
  ): Promise<GetVaccinationResponse> {
    const response = await this.petService.getVaccination(petId);
    return response;
  }

  @Post(':petId/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async setPetAvatar(
    @UploadedFile() avatar: FileLib,
    @Param('petId', new ParseUUIDPipe()) petId: string,
  ): Promise<SuccessModel> {
    if (!avatar) {
      throw new BadRequestException('avatar is required');
    }
    const response = await this.petService.setPetAvatar(petId, avatar);
    return response;
  }

  @Get('customer/:customerId')
  async getAllPets(
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
    @Query() paginationOpt: PaginationRequest,
  ): Promise<PaginationResponse<PetItemListResponse>> {
    const response = await this.petService.getAllPets(
      customerId,
      paginationOpt,
    );
    return response;
  }

  @Patch(':customerId/dog/:petId')
  async editDog(
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
    @Param('petId', new ParseUUIDPipe()) petId: string,
    @Body() updatePetRequest: UpdateDogRequest,
  ): Promise<SuccessModel> {
    const response = await this.petService.editDog(
      customerId,
      petId,
      updatePetRequest,
    );
    return response;
  }

  @Patch(':customerId/cat/:petId')
  async editCat(
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
    @Param('petId', new ParseUUIDPipe()) petId: string,
    @Body() updatePetRequest: UpdateCatRequest,
  ): Promise<SuccessModel> {
    const response = await this.petService.editCat(
      customerId,
      petId,
      updatePetRequest,
    );
    return response;
  }

  @Patch(':customerId/small-animal/:petId')
  async editSmallAnimal(
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
    @Param('petId', new ParseUUIDPipe()) petId: string,
    @Body() updatePetRequest: UpdateSmallAnimalRequest,
  ): Promise<SuccessModel> {
    const response = await this.petService.editSmallAnimal(
      customerId,
      petId,
      updatePetRequest,
    );
    return response;
  }

  @Put(':customerId/dog')
  async addDog(
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
    @Body() addDogRequest: AddDogRequest,
  ): Promise<AddPetResponse> {
    // const userEntity: UserEntity = req.getAuthEntity();
    // const customerEntity:
    //   | CustomerEntity
    //   | undefined = await userEntity.customer;
    // if (!customerEntity) {
    //   throw new InternalServerErrorException(
    //     'User has not customer entity!',
    //     userEntity.id,
    //   );
    // }

    const newDogPet: AddPetResponse = await this.petService.addDog(
      customerId,
      addDogRequest,
    );
    return newDogPet;
  }

  @Put(':customerId/cat')
  async addCat(
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
    @Body() addCatRequest: AddCatRequest,
  ): Promise<AddPetResponse> {
    // const userEntity: UserEntity = req.getAuthEntity();
    // const customerEntity:
    //   | CustomerEntity
    //   | undefined = await userEntity.customer;
    // if (!customerEntity) {
    //   throw new InternalServerErrorException(
    //     'User has not customer entity!',
    //     userEntity.id,
    //   );
    // }

    const newCatPet: AddPetResponse = await this.petService.addCat(
      customerId,
      addCatRequest,
    );
    return newCatPet;
  }

  @Put(':customerId/small-animal')
  async addSmallAnimal(
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
    @Body() addPetRequest: AddSmallPetRequest,
  ): Promise<AddPetResponse> {
    // const userEntity: UserEntity = req.getAuthEntity();
    // const customerEntity:
    //   | CustomerEntity
    //   | undefined = await userEntity.customer;
    // if (!customerEntity) {
    //   throw new InternalServerErrorException(
    //     'User has not customer entity!',
    //     userEntity.id,
    //   );
    // }

    const newSmallAnimalPet: AddPetResponse = await this.petService.addSmallAnimal(
      customerId,
      addPetRequest,
    );
    return newSmallAnimalPet;
  }

  @Delete(':customerId/delete/:petId')
  async deletePet(
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
    @Param('petId', new ParseUUIDPipe()) petId: string,
  ): Promise<SuccessModel> {
    const response = await this.petService.deletePet(customerId, petId);
    return response;
  }
}
