import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { Request } from 'express';

import { CustomerEntity, UserEntity } from '@pawfect/db/entities';
import { FileLib } from '@pawfect/libs/aws-s3';
import {
  PaginationRequest,
  PaginationResponse,
  SuccessModel,
  PetInfoResponse,
  PetInfoVaccination,
} from '@pawfect/models';
import {
  AddSmallPetRequest,
  PetItemListResponse,
  UpdateDogRequest,
  AddCatRequest,
  AddDogRequest,
  UpdateCatRequest,
  UpdateSmallAnimalRequest,
  GetForOrderRequest,
  GetForOrderResponse,
  AddPetResponse,
} from './models';
import { PetService } from './pet.service';
import { GetVaccinationResponse } from './models/get-vaccination.response';

@Controller('customer/pets')
@UseGuards(AuthGuard('customer-jwt'))
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Get('all')
  async getAll(
    @Req() req: Request,
    @Query() paginationOpt: PaginationRequest,
  ): Promise<PaginationResponse<PetItemListResponse>> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException(
        'User has not customer entity!',
        userEntity.id,
      );
    }

    const response = await this.petService.getAll(
      customerEntity,
      paginationOpt,
    );
    return response;
  }

  @Put('dog')
  async addDog(
    @Req() req: Request,
    @Body() addDogRequest: AddDogRequest,
  ): Promise<AddPetResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException(
        'User has not customer entity!',
        userEntity.id,
      );
    }

    const newDogPet: AddPetResponse = await this.petService.addDog(
      customerEntity,
      addDogRequest,
    );
    return newDogPet;
  }

  @Put('cat')
  async addCat(
    @Req() req: Request,
    @Body() addCatRequest: AddCatRequest,
  ): Promise<AddPetResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException(
        'User has not customer entity!',
        userEntity.id,
      );
    }

    const newCatPet: AddPetResponse = await this.petService.addCat(
      customerEntity,
      addCatRequest,
    );
    return newCatPet;
  }

  @Put('small-animal')
  async addSmallAnimal(
    @Req() req: Request,
    @Body() addPetRequest: AddSmallPetRequest,
  ): Promise<AddPetResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException(
        'User has not customer entity!',
        userEntity.id,
      );
    }

    const newSmallAnimalPet: AddPetResponse = await this.petService.addSmallAnimal(
      customerEntity,
      addPetRequest,
    );
    return newSmallAnimalPet;
  }

  @Get('profile/:petId')
  async getPetInfo(
    @Param('petId', new ParseUUIDPipe()) petId: string,
  ): Promise<PetInfoResponse> {
    const petEditInfo: PetInfoResponse = await this.petService.getPetInfo(
      petId,
    );
    return petEditInfo;
  }

  @Patch('dog/:petId')
  async editDog(
    @Req() req: Request,
    @Param('petId', new ParseUUIDPipe()) petId: string,
    @Body() updatePetRequest: UpdateDogRequest,
  ): Promise<SuccessModel> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException(
        'User has not customer entity!',
        userEntity.id,
      );
    }

    const response = await this.petService.editDog(
      customerEntity,
      petId,
      updatePetRequest,
    );
    return response;
  }

  @Patch('cat/:petId')
  async editCat(
    @Req() req: Request,
    @Param('petId', new ParseUUIDPipe()) petId: string,
    @Body() updatePetRequest: UpdateCatRequest,
  ): Promise<SuccessModel> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException(
        'User has not customer entity!',
        userEntity.id,
      );
    }

    const response = await this.petService.editCat(
      customerEntity,
      petId,
      updatePetRequest,
    );
    return response;
  }

  @Patch('small-animal/:petId')
  async editSmallAnimal(
    @Req() req: Request,
    @Param('petId', new ParseUUIDPipe()) petId: string,
    @Body() updatePetRequest: UpdateSmallAnimalRequest,
  ): Promise<SuccessModel> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException(
        'User has not customer entity!',
        userEntity.id,
      );
    }

    const response = await this.petService.editSmallAnimal(
      customerEntity,
      petId,
      updatePetRequest,
    );
    return response;
  }

  @Post(':petId/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async setPetAvatar(
    @Req() req: Request,
    @UploadedFile() avatar: FileLib,
    @Param('petId', new ParseUUIDPipe()) petId: string,
  ): Promise<SuccessModel> {
    if (!avatar) {
      throw new BadRequestException('avatar is required');
    }
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException(
        'User has not customer entity!',
        userEntity.id,
      );
    }

    const response = await this.petService.setPetAvatar(
      customerEntity,
      petId,
      avatar,
    );
    return response;
  }

  @Get(':petId/vaccinations')
  async getVaccinations(
    @Req() req: Request,
    @Param('petId', new ParseUUIDPipe()) petId: string,
  ): Promise<GetVaccinationResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException(
        'User has not customer entity!',
        userEntity.id,
      );
    }

    const response = await this.petService.getVaccination(
      customerEntity,
      petId,
    );
    return response;
  }

  @Post(':petId/vaccinations')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'vaccinations', maxCount: 10 }]),
  )
  async addVaccinations(
    @Req() req: Request,
    @UploadedFiles() files: { vaccinations?: Array<FileLib> },
    @Param('petId', new ParseUUIDPipe()) petId: string,
  ): Promise<SuccessModel> {
    const vaccinations: Array<FileLib> =
      files.vaccinations || new Array<FileLib>();
    if (!vaccinations.length) {
      throw new BadRequestException('vaccinations is required');
    }

    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException(
        'User has not customer entity!',
        userEntity.id,
      );
    }

    const response: SuccessModel = await this.petService.addVaccinations(
      customerEntity,
      petId,
      vaccinations,
    );
    return response;
  }

  @Delete(':petId/vaccinations/:vaccinationId')
  async deleteVaccination(
    @Req() req: Request,
    @Param('petId', new ParseUUIDPipe()) petId: string,
    @Param('vaccinationId', new ParseUUIDPipe()) vaccinationId: string,
  ): Promise<SuccessModel> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException(
        'User has not customer entity!',
        userEntity.id,
      );
    }

    const response: SuccessModel = await this.petService.deleteVaccination(
      customerEntity,
      petId,
      vaccinationId,
    );

    return response;
  }

  @Post('for-order')
  async getPetsForOrder(
    @Req() req: Request,
    @Body() getForOrderRequest: GetForOrderRequest,
  ): Promise<GetForOrderResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException(
        'User has not customer entity!',
        userEntity.id,
      );
    }

    const response = await this.petService.getPetsForOrder(
      customerEntity,
      getForOrderRequest,
    );
    return response;
  }

  @Delete(':petId')
  async deletePet(
    @Req() req: Request,
    @Param('petId', new ParseUUIDPipe()) petId: string,
  ): Promise<SuccessModel> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException(
        'User has not customer entity!',
        userEntity.id,
      );
    }

    const response = await this.petService.deletePet(customerEntity, petId);
    return response;
  }
}
