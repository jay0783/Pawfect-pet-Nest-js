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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import * as url from 'url';

import { CustomerEntity, UserEntity } from '@pawfect/db/entities';
import { FileLib } from '@pawfect/libs/aws-s3';
import {
  SuccessModel,
  PaginationRequest,
  PaginationResponse,
} from '@pawfect/models';
import {
  AddEmergencyRequest,
  ChangePasswordRequest,
  EditProfileRequest,
  GetEmergenciesResponse,
  GetMyProfileResponse,
  GetMyShortProfileResponse,
  ShareRequest,
  AddCardResponse,
  AddCardRequest,
  CardItemListResponse,
} from './models';
import { ProfileService } from './profile.service';

@UseGuards(AuthGuard('customer-jwt'))
@Controller('customer/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('my')
  async getMyProfile(@Req() req: Request): Promise<GetMyProfileResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException('User has not customer entity!');
    }
    const response = await this.profileService.getMyProfile(
      userEntity,
      customerEntity,
    );
    return response;
  }

  @Get('my/short')
  async getMyShortProfile(
    @Req() req: Request,
  ): Promise<GetMyShortProfileResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException('User has not customer entity!');
    }
    const response = await this.profileService.getMyShortProfile(
      customerEntity,
    );
    return response;
  }

  @Patch('my')
  async editProfile(
    @Req() req: Request,
    @Body() editProfileRequest: EditProfileRequest,
  ): Promise<SuccessModel> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException('User has not customer entity!');
    }

    const response = await this.profileService.editProfile(
      customerEntity,
      editProfileRequest,
    );
    return response;
  }

  @Get('emergencies')
  async getEmergencies(@Req() req: Request): Promise<GetEmergenciesResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException('User has not customer entity!');
    }

    const response = await this.profileService.getEmergencies(customerEntity);
    return response;
  }

  @Put('emergencies')
  async addEmergency(
    @Req() req: Request,
    @Body() addEmergencyRequest: AddEmergencyRequest,
  ): Promise<SuccessModel> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException('User has not customer entity!');
    }

    const response = await this.profileService.addEmergency(
      customerEntity,
      addEmergencyRequest,
    );
    return response;
  }

  @Delete('emergencies/:emergencyId')
  async deleteEmergency(
    @Req() req: Request,
    @Param('emergencyId', new ParseUUIDPipe()) emergencyId: string,
  ): Promise<SuccessModel> {
    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException('User has not customer entity!');
    }

    const response = await this.profileService.deleteEmergency(
      customerEntity,
      emergencyId,
    );
    return response;
  }

  @Post('password-change')
  async changePassword(
    @Req() req: Request,
    @Body() changePasswordRequest: ChangePasswordRequest,
  ): Promise<SuccessModel> {
    const userEntity: UserEntity = req.getAuthEntity();
    const response = await this.profileService.changePassword(
      userEntity,
      changePasswordRequest,
    );
    return response;
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async setCustomerAvatar(
    @Req() req: Request,
    @UploadedFile() avatar: FileLib,
  ): Promise<SuccessModel> {
    if (!avatar) {
      throw new BadRequestException('avatar is required');
    }

    const userEntity: UserEntity = req.getAuthEntity();
    const customerEntity:
      | CustomerEntity
      | undefined = await userEntity.customer;
    if (!customerEntity) {
      throw new InternalServerErrorException('User has not customer entity!');
    }

    const response = await this.profileService.setAvatar(
      customerEntity,
      avatar,
    );
    return response;
  }

  @Get('share')
  async shareWithEmail(
    @Req() req: Request,
    @Query() shareRequest: ShareRequest,
  ): Promise<SuccessModel> {
    const baseUrl = new url.URL(`http://${req.headers.host}/`).toString();
    const response = await this.profileService.shareWithEmail(
      baseUrl,
      shareRequest,
    );
    return response;
  }

  @Put('card')
  async addCard(
    @Req() req: Request,
    @Body() addCardRequest: AddCardRequest,
  ): Promise<AddCardResponse> {
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

    const newCard: AddCardResponse = await this.profileService.addCard(
      customerEntity,
      addCardRequest,
    );
    return newCard;
  }

  @Get('card/all')
  async getAll(
    @Req() req: Request,
    @Query() paginationOpt: PaginationRequest,
  ): Promise<PaginationResponse<CardItemListResponse>> {
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

    const response = await this.profileService.getAll(
      customerEntity,
      paginationOpt,
    );
    return response;
  }

  @Delete('card/:cardId')
  async deleteCard(
    @Req() req: Request,
    @Param('cardId', new ParseUUIDPipe()) cardId: string,
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

    const response = await this.profileService.deleteCard(
      customerEntity,
      cardId,
    );
    return response;
  }
}
