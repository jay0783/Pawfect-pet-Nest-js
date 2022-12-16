import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import {
  CustomerEntity,
  PhotoEntity,
  UserEntity,
  CustomerBankCardEntity,
} from '@pawfect/db/entities';
import {
  CustomerRepository,
  UserRepository,
  CardRepository,
  OrderRepository,
} from '@pawfect/db/repositories';
import {
  EmergencyModel,
  SuccessModel,
  PaginationResponse,
  PaginationRequest,
} from '@pawfect/models';
import { AwsS3Lib, FileLib, FolderEnum } from '@pawfect/libs/aws-s3';
import { EmailSenderService } from '@pawfect/libs/nodemailer';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import {
  AddCardRequest,
  AddCardResponse,
  CardItemListResponse,
  AddCardAmountRequest,
  AddAchRequest,
  AddAchAmountRequest,
  GetOrderDetailsResponse,
  GetMainOrdersResponse,
} from './models';
import { makePetViewModelMany, PetViewModel } from '../orders/models';
const crypto = require('crypto');
const axios = require('axios');

@Injectable()
export class PaymentService {
  constructor(
    private readonly cardRepository: CardRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  async addCardTocken(
    customerEntity: CustomerEntity,
    addCardRequest: AddCardRequest,
  ): Promise<AddCardResponse> {
    //post api
    var card = {
      CardData: {
        Number: addCardRequest.number,
        Expiration: addCardRequest.expiration,
        cvv: addCardRequest.cvc,
      },
    };
    var merchantId = process.env.MERCHANTID;
    // console.log('process.env.CLIENTID', process.env.CLIENTID);

    var nonce = crypto.randomBytes(12).toString('base64');
    var timestamp = Math.floor(new Date().getTime() / 1000);
    var verb = 'POST';
    var pay = JSON.stringify(card);

    var url = 'https://api-cert.sagepayments.com/bankcard/v1/tokens';
    let hash_str = verb + url + pay + merchantId + nonce + timestamp;
    const hmac1 = crypto
      .createHmac('sha512', process.env.CLIENTKEY)
      .update(hash_str)
      .digest();
    var auth = Buffer.from(hmac1).toString('base64');
    const headers = {
      clientId: process.env.CLIENTID,
      merchantId: process.env.MERCHANTID,
      merchantKey: process.env.MERCHANTKEY,
      nonce: nonce,
      timestamp: timestamp,
      Authorization: auth,
      'Content-Type': 'application/json',
    };

    let res = await axios({
      method: 'POST',
      url: 'https://api-cert.sagepayments.com/bankcard/v1/tokens',
      headers: headers,
      data: card,
    });

    // console.log('[]', res);

    //Save Tocken
    const cardEntity:
      | CustomerBankCardEntity
      | undefined = await this.cardRepository.findOne({
      where: {
        customer: customerEntity.id,
        fourDigits: addCardRequest.number.slice(-4),
      },
    });

    if (cardEntity) {
      throw new NotFoundException('Card was already added!');
    }

    if (res.data.vaultResponse.status === 0) {
      throw new NotFoundException('Card dose not exist!');
    }

    const newCardEntity = new CustomerBankCardEntity();
    newCardEntity.token = res.data.vaultResponse.data;
    newCardEntity.fourDigits = addCardRequest.number.slice(-4);
    newCardEntity.customer = Promise.resolve(customerEntity);
    await this.cardRepository.save(newCardEntity);

    return {
      id: newCardEntity.id,
      vaultResponse: {
        status: res.data.vaultResponse.status,
        data: res.data.vaultResponse.data,
      },
    };
  }

  async getAll(
    customer: CustomerEntity,
    paginationOpt: IPaginationOptions,
  ): Promise<PaginationResponse<CardItemListResponse>> {
    const paginateCardEntities: Pagination<CustomerBankCardEntity> = await this.cardRepository.getAllAsCustomer(
      customer.id,
      paginationOpt,
    );

    const cardItems: Array<CardItemListResponse> = [];
    for (const cardEntity of paginateCardEntities.items) {
      const cardItem: CardItemListResponse = {
        id: cardEntity.id,
        fourDigits: cardEntity.fourDigits.slice(-4),
        token: cardEntity.token,
        isChosen: cardEntity.isChosen,
      };

      cardItems.push(cardItem);
    }

    return { items: cardItems, meta: paginateCardEntities.meta };
  }

  async deleteCard(
    customerEntity: CustomerEntity,
    cardId: string,
  ): Promise<SuccessModel> {
    const cardEntity = await this.cardRepository.findOne({
      where: { id: cardId, customer: customerEntity.id },
    });
    if (!cardEntity) {
      throw new NotFoundException('Card was not found!');
    }
    await this.cardRepository.remove(cardEntity);
    return new SuccessModel();
  }

  async addAmount(
    customerEntity: CustomerEntity,
    cardId: string,
    addCardAmountRequest: AddCardAmountRequest,
  ): Promise<SuccessModel> {
    //reference available then not allow
    const cardEntity:
      | CustomerBankCardEntity
      | undefined = await this.cardRepository.findOne({
      where: { id: cardId, token: addCardAmountRequest.token },
    });

    if (!cardEntity) {
      throw new NotFoundException('Card was not found!');
    }

    //post api
    var card = {
      Ecommerce: {
        Amounts: {
          Total: addCardAmountRequest.total,
        },
      },
      Vault: {
        Token: addCardAmountRequest.token,
        Operation: 'Read',
      },
    };
    var merchantId = process.env.MERCHANTID;
    var nonce = crypto.randomBytes(12).toString('base64');
    var timestamp = Math.floor(new Date().getTime() / 1000);
    var verb = 'POST';
    var pay = JSON.stringify(card);
    var url = 'https://api-cert.sagepayments.com/bankcard/v1/charges?type=Sale';
    let hash_str = verb + url + pay + merchantId + nonce + timestamp;
    const hmac1 = crypto
      .createHmac('sha512', process.env.CLIENTKEY)
      .update(hash_str)
      .digest();
    var auth = Buffer.from(hmac1).toString('base64');
    const headers = {
      clientId: process.env.CLIENTID,
      merchantId: process.env.MERCHANTID,
      merchantKey: process.env.MERCHANTKEY,
      nonce: nonce,
      timestamp: timestamp,
      Authorization: auth,
      'Content-Type': 'application/json',
    };
    let res = await axios({
      method: 'POST',
      url: 'https://api-cert.sagepayments.com/bankcard/v1/charges?type=Sale',
      headers: headers,
      data: card,
    });
    console.log('resres', res);

    //Save Balance
    if (res.data.status === 'Approved') {
      //add reference
      // cardEntity.reference = res.data.reference;
      // await this.cardRepository.save(cardEntity);

      //add balance
      customerEntity.balance =
        customerEntity.balance + addCardAmountRequest.total;

      await this.customerRepository.save(customerEntity);
    } else if (res.data.status === 'Declined') {
      throw new NotFoundException('Your card has been DECLINED!');
    } else {
      throw new NotFoundException('Please check your card detail!');
    }

    return new SuccessModel();
  }

  // async addAchTocken(
  //   customerEntity: CustomerEntity,
  //   addAchRequest: AddAchRequest,
  // ): Promise<AddCardResponse> {
  //   //post api
  //   var card = {
  //     account: {
  //       type: addAchRequest.type,
  //       routingNumber: addAchRequest.routingNumber,
  //       accountNumber: addAchRequest.accountNumber,
  //     },
  //   };
  //   var merchantId = process.env.MERCHANTID;
  //   var nonce = crypto.randomBytes(12).toString('base64');
  //   var timestamp = Math.floor(new Date().getTime() / 1000);
  //   var verb = 'POST';
  //   var pay = JSON.stringify(card);
  //   console.log('[][][]', pay);

  //   var url = 'https://api-cert.sagepayments.com/ach/v1/tokens';
  //   let hash_str = verb + url + pay + merchantId + nonce + timestamp;
  //   const hmac1 = crypto
  //     .createHmac('sha512', process.env.CLIENTKEY)
  //     .update(hash_str)
  //     .digest();
  //   var auth = Buffer.from(hmac1).toString('base64');
  //   const headers = {
  //     clientId: process.env.CLIENTID,
  //     merchantId: process.env.MERCHANTID,
  //     merchantKey: process.env.MERCHANTKEY,
  //     nonce: nonce,
  //     timestamp: timestamp,
  //     Authorization: auth,
  //     'Content-Type': 'application/json',
  //   };
  //   let res = await axios({
  //     method: 'POST',
  //     url: 'https://api-cert.sagepayments.com/ach/v1/tokens',
  //     headers: headers,
  //     data: card,
  //   });

  //   //Save Tocken
  // const newCardEntity = new CustomerBankCardEntity();
  // newCardEntity.token = res.data.vaultResponse.data;
  // newCardEntity.fourDigits = addAchRequest.accountNumber.slice(
  //   addAchRequest.accountNumber.length - 4,
  // );
  // newCardEntity.customer = Promise.resolve(customerEntity);
  // await this.cardRepository.save(newCardEntity);
  //   return {
  //     vaultResponse: {
  //       status: res.data.vaultResponse.status,
  //       data: res.data.vaultResponse.data,
  //     },
  //   };
  // }

  async addAchAmount(
    customerEntity: CustomerEntity,
    addAchAmountRequest: AddAchAmountRequest,
  ): Promise<SuccessModel> {
    //reference available then not allow
    // const cardEntity:
    //   | CustomerBankCardEntity
    //   | undefined = await this.cardRepository.findOne({
    //   where: { id: cardId },
    // });

    // if (!cardEntity) {
    //   throw new NotFoundException('Card was not found!');
    // }

    //post api
    var card = {
      secCode: 'PPD',
      amounts: {
        total: addAchAmountRequest.total,
      },
      account: {
        type: addAchAmountRequest.type,
        routingNumber: addAchAmountRequest.routingNumber,
        accountNumber: addAchAmountRequest.accountNumber,
      },
      billing: {
        name: {
          first: addAchAmountRequest.first,
          middle: addAchAmountRequest.middle,
          last: addAchAmountRequest.last,
        },
        address: addAchAmountRequest.address,
        city: addAchAmountRequest.city,
        state: addAchAmountRequest.state,
        postalCode: addAchAmountRequest.postalCode,
        country: addAchAmountRequest.country,
      },
      vault: {
        Operation: 'Create',
      },
    };
    var merchantId = process.env.MERCHANTID;
    var nonce = crypto.randomBytes(12).toString('base64');
    var timestamp = Math.floor(new Date().getTime() / 1000);
    var verb = 'POST';
    var pay = JSON.stringify(card);
    var url = 'https://api-cert.sagepayments.com/ach/v1/charges';
    let hash_str = verb + url + pay + merchantId + nonce + timestamp;
    const hmac1 = crypto
      .createHmac('sha512', process.env.CLIENTKEY)
      .update(hash_str)
      .digest();
    var auth = Buffer.from(hmac1).toString('base64');
    const headers = {
      clientId: process.env.CLIENTID,
      merchantId: process.env.MERCHANTID,
      merchantKey: process.env.MERCHANTKEY,
      nonce: nonce,
      timestamp: timestamp,
      Authorization: auth,
      'Content-Type': 'application/json',
    };
    let res = await axios({
      method: 'POST',
      url: 'https://api-cert.sagepayments.com/ach/v1/charges',
      headers: headers,
      data: card,
    });

    const newCardEntity = new CustomerBankCardEntity();
    newCardEntity.token = res.data.vaultResponse.data;
    newCardEntity.fourDigits = addAchAmountRequest.accountNumber.slice(
      addAchAmountRequest.accountNumber.length - 4,
    );
    // newCardEntity.reference = res.data.reference;
    newCardEntity.customer = Promise.resolve(customerEntity);
    await this.cardRepository.save(newCardEntity);

    //Save Balance
    if (res.data.status === 'Approved') {
      //add balance
      customerEntity.balance =
        customerEntity.balance + addAchAmountRequest.total;
      await this.customerRepository.save(customerEntity);
    } else {
      throw new NotFoundException('Please check your card detail!');
    }
    return new SuccessModel();
  }

  async getTransaction(
    customerEntity: CustomerEntity,
    paginationRequest: PaginationRequest,
  ): Promise<GetMainOrdersResponse> {
    const paginationMainOrder = await this.orderRepository.getTransactionHistoryOrders(
      customerEntity.id,
      paginationRequest,
    );
    console.log('[][------]', paginationMainOrder);

    const historyItems: Array<GetOrderDetailsResponse> = [];
    for (const orderEntity of paginationMainOrder.items) {
      const mainOrderPetEntities = await (await orderEntity.mainOrder).pets;

      const petViewModels: Array<PetViewModel> = await makePetViewModelMany(
        mainOrderPetEntities,
      );

      const cardItem: GetOrderDetailsResponse = {
        id: orderEntity.id,
        pets: petViewModels,
        totalAmount: orderEntity.priceWithExtras,
        createdAt: orderEntity.createdAt.getTime(),
        // reference: orderEntity.reference,
      };

      historyItems.push(cardItem);
    }
    return {
      items: historyItems,
      meta: paginationMainOrder.meta,
    };
  }
}
function mainOrderPetEntities(
  mainOrderPetEntities: any,
): PetViewModel[] | PromiseLike<PetViewModel[]> {
  throw new Error('Function not implemented.');
}
