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

import {
  CustomerEntity,
  UserEntity,
  CustomerBankCardEntity,
} from '@pawfect/db/entities';
import { FileLib } from '@pawfect/libs/aws-s3';
import {
  SuccessModel,
  PaginationRequest,
  PaginationResponse,
} from '@pawfect/models';
import {
  AddCardResponse,
  AddCardRequest,
  CardItemListResponse,
  AddCardAmountRequest,
  AddAchRequest,
  AddAchAmountRequest,
  GetOrderDetailsResponse,
  GetMainOrdersResponse,
} from './models';
import { PaymentService } from './payment.service';

@UseGuards(AuthGuard('customer-jwt'))
@Controller('customer/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Put('card')
  async addCardTocken(
    @Req() req: Request,
    @Body() addCardRequest: AddCardRequest,
  ): Promise<AddCardResponse> {
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

    const newCard: AddCardResponse = await this.paymentService.addCardTocken(
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

    const response = await this.paymentService.getAll(
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

    const response = await this.paymentService.deleteCard(
      customerEntity,
      cardId,
    );
    return response;
  }

  @Put('card/amount/:cardId')
  async addAmount(
    @Req() req: Request,
    @Param('cardId', new ParseUUIDPipe()) cardId: string,
    @Body() addCardAmountRequest: AddCardAmountRequest,
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

    const newCard = await this.paymentService.addAmount(
      customerEntity,
      cardId,
      addCardAmountRequest,
    );
    return newCard;
  }

  // @Put('ach')
  // async addAchTocken(
  //   @Req() req: Request,
  //   @Body() addAchRequest: AddAchRequest,
  // ): Promise<AddCardResponse> {
  //   const userEntity: UserEntity = req.getAuthEntity();
  //   const customerEntity:
  //     | CustomerEntity
  //     | undefined = await userEntity.customer;
  //   if (!customerEntity) {
  //     throw new InternalServerErrorException(
  //       'User has not customer entity!',
  //       userEntity.id,
  //     );
  //   }

  //   const newCard: AddCardResponse = await this.paymentService.addAchTocken(
  //     customerEntity,
  //     addAchRequest,
  //   );
  //   return newCard;
  // }

  @Put('ach/amount')
  async addAchAmount(
    @Req() req: Request,
    @Body() addAchAmountRequest: AddAchAmountRequest,
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

    const newCard = await this.paymentService.addAchAmount(
      customerEntity,
      addAchAmountRequest,
    );
    return newCard;
  }

  @Get('history')
  async getTransaction(
    @Req() req: Request,
    @Query() paginationRequest: PaginationRequest,
  ): Promise<GetMainOrdersResponse> {
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

    const response = await this.paymentService.getTransaction(
      customerEntity,
      paginationRequest,
    );
    return response;
  }
}
