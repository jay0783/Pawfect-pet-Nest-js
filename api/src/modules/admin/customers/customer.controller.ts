import {
  Controller,
  Get,
  Patch,
  Query,
  Req,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  InternalServerErrorException,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Put,
  Delete,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomerEntity, UserEntity } from '@pawfect/db/entities/index';
import { CustomerService } from './customer.service';
import { FileLib } from '@pawfect/libs/aws-s3';
import {
  PaginationRequest,
  PaginationResponse,
  SuccessModel,
} from '@pawfect/models';
import { FileInterceptor } from '@nestjs/platform-express';

import {
  GetCustomerProfileResponse,
  EditProfileRequest,
  CustomersResponse,
  CardItemListResponse,
  GetMainOrdersResponse,
  RegistrationRequest,
  AddCardRequest,
  AddCustomerResponse,
} from './models';
import { CustomerRepository } from '@pawfect/db/repositories';

@ApiBearerAuth()
@ApiTags('Customer')
@UseGuards(AuthGuard('admin-jwt'))
@Controller('admin/customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async getAll(
    @Query() paginationOpt: PaginationRequest,
    @Query() name: PaginationRequest,
  ): Promise<PaginationResponse<CustomersResponse>> {
    const customerPaginationResponse = await this.customerService.getAll(
      paginationOpt,
      name,
    );
    return customerPaginationResponse;
  }

  @Get(':customerId/reviews')
  async getMainOrders(
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
    @Query() paginationRequest: PaginationRequest,
  ): Promise<GetMainOrdersResponse> {
    const response = await this.customerService.getMainOrders(
      customerId,
      paginationRequest,
    );
    return response;
  }

  @Get(':customerId')
  async getCustomerProfile(
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
  ): Promise<GetCustomerProfileResponse> {
    return this.customerService.getCustomerProfile(customerId);
  }

  @Patch(':customerId')
  async editProfile(
    @Req() req: Request,
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
    @Body() editProfileRequest: EditProfileRequest,
  ): Promise<SuccessModel> {
    const customerEntity:
      | CustomerEntity
      | undefined = await this.customerService.getCustomer(customerId);
    if (!customerEntity) {
      throw new InternalServerErrorException('User has not customer entity!');
    }
    const response = await this.customerService.editProfile(
      customerEntity,
      editProfileRequest,
    );
    return response;
  }

  @Post(':customerId/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async setCustomerAvatar(
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
    @UploadedFile() avatar: FileLib,
  ): Promise<SuccessModel> {
    if (!avatar) {
      throw new BadRequestException('avatar is required');
    }

    const response = await this.customerService.setAvatar(customerId, avatar);
    return response;
  }

  @Post('add-customer')
  async signUp(
    @Body() registrationRequest: RegistrationRequest,
  ): Promise<AddCustomerResponse> {
    const accessTokenModel: AddCustomerResponse = await this.customerService.signUp(
      registrationRequest,
    );
    return accessTokenModel;
  }

  @Patch(':customerId/delete')
  async deleteCustomer(
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
  ): Promise<SuccessModel> {
    const deleteCustomer = await this.customerService.deleteCustomer(
      customerId,
    );
    return new SuccessModel();
  }

  @Put(':customerId/card')
  async addCard(
    @Body() addCardRequest: AddCardRequest,
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
  ): Promise<SuccessModel> {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);

    if (
      addCardRequest.expiration.slice(0, 2) <= '12' &&
      addCardRequest.expiration.slice(0, 2) >= '01'
    ) {
      if (addCardRequest.expiration.slice(-2) < year) {
        throw new BadRequestException('Invalid card expirations');
      }
      if (addCardRequest.expiration.slice(-2) == year) {
        if (addCardRequest.expiration.slice(0, 2) <= month) {
          throw new BadRequestException('Invalid card expirations');
        }
      }
    } else {
      throw new BadRequestException('Month cannot be greater than 12');
    }

    const newCard = await this.customerService.addCardTocken(
      customerId,
      addCardRequest,
    );
    return newCard;
  }

  @Delete(':customerId/card/:cardId')
  async deleteCard(
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
    @Param('cardId', new ParseUUIDPipe()) cardId: string,
  ): Promise<SuccessModel> {
    const response = await this.customerService.deleteCard(customerId, cardId);
    return response;
  }

  @Patch(':customerId/card/:cardId/')
  async editCard(
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
    @Param('cardId', new ParseUUIDPipe()) cardId: string,
    @Body() editCardRequest: AddCardRequest,
  ): Promise<SuccessModel> {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);

    if (
      editCardRequest.expiration.slice(0, 2) <= '12' &&
      editCardRequest.expiration.slice(0, 2) >= '01'
    ) {
      if (editCardRequest.expiration.slice(-2) < year) {
        throw new BadRequestException('Invalid card expirations');
      }
      if (editCardRequest.expiration.slice(-2) == year) {
        if (editCardRequest.expiration.slice(0, 2) <= month) {
          throw new BadRequestException('Invalid card expirations');
        }
      }
    } else {
      throw new BadRequestException('Month cannot be greater than 12');
    }

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

    const newCard = await this.customerService.editCardToken(
      cardId,
      customerId,
      editCardRequest,
    );
    return new SuccessModel();
  }

  @Get(':customerId/card/all')
  async getAllCards(
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
    @Query() paginationOpt: PaginationRequest,
  ): Promise<PaginationResponse<CardItemListResponse>> {
    const response = await this.customerService.getAllCards(
      customerId,
      paginationOpt,
    );
    return response;
  }

  @Get(':customerId/card/:cardId')
  async getSingleCard(
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
    @Param('cardId', new ParseUUIDPipe()) cardId: string,
  ): Promise<CardItemListResponse> {
    const response: CardItemListResponse = await this.customerService.getSingleCard(
      customerId,
      cardId,
    );
    return response;
  }
}
