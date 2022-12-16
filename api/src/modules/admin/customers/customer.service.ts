import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DateTime } from 'luxon';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { AwsS3Lib, FileLib, FolderEnum } from '@pawfect/libs/aws-s3';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  CustomerRepository,
  CardRepository,
  MainOrderRepository,
  UserRepository,
  ZipCodeRepository,
  NotificationFlagRepository,
} from '@pawfect/db/repositories';
import {
  GetCustomerProfileResponse,
  GetMainOrdersResponse,
  makeGetCustomerProfileResponse,
  EditProfileRequest,
  CustomersResponse,
  makeCustomersResponseMany,
  CardItemListResponse,
  MainOrderViewModel,
  OrderViewModel,
  PetViewModel,
  ServiceViewModel,
  makeOrderViewModelMany,
  makePetViewModelMany,
  makeServiceViewModel,
  RegistrationRequest,
  AddCardRequest,
  AddCustomerResponse,
} from './models';
import {
  PaginationRequest,
  PaginationResponse,
  SuccessModel,
} from '@pawfect/models';
import {
  CustomerEntity,
  PhotoEntity,
  CustomerBankCardEntity,
  ZipCodeEntity,
  UserEntity,
  NotificationFlagEntity,
} from '@pawfect/db/entities';
import { HearAboutUsEnum, UserRoleEnum } from '@pawfect/db/entities/enums';
import { MoreThan } from 'typeorm';
const crypto = require('crypto');
const axios = require('axios');
@Injectable()
export class CustomerService {
  jwtService: any;
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly awsS3Lib: AwsS3Lib,
    private readonly eventEmitter: EventEmitter2,
    private readonly cardRepository: CardRepository,
    private readonly mainOrderRepository: MainOrderRepository,
    private readonly userRepository: UserRepository,
    private readonly zipCodeRepository: ZipCodeRepository,
    private readonly notificationFlagRepository: NotificationFlagRepository,
  ) {}

  async getCustomerProfile(
    customerId: string,
  ): Promise<GetCustomerProfileResponse> {
    const customerEntity = await this.customerRepository.findOne(customerId, {
      relations: ['user', 'zipCode', 'homeInfo', 'emergencies', 'avatar'],
    });
    if (!customerEntity) {
      throw new NotFoundException('Customer not found');
    }

    return makeGetCustomerProfileResponse(customerEntity);
  }
  async getCustomer(customerId: string): Promise<CustomerEntity> {
    const customerEntity = await this.customerRepository.findOne(customerId, {
      relations: ['user', 'zipCode', 'homeInfo', 'emergencies', 'avatar'],
    });
    if (!customerEntity) {
      throw new NotFoundException('Customer not found');
    }

    return customerEntity;
  }

  async editProfile(
    customerEntity: CustomerEntity,
    editProfileRequest: EditProfileRequest,
  ): Promise<SuccessModel> {
    const zipCodeExistEntity:
      | ZipCodeEntity
      | undefined = await this.zipCodeRepository.findOne({
      where: { zipCode: editProfileRequest.zipCode },
    });
    if (!zipCodeExistEntity) {
      throw new BadRequestException('Zip code is not allowed');
    }

    await this.customerRepository.upsertCustomer(
      editProfileRequest,
      customerEntity,
    );
    await this.customerRepository.saveHomeInfo(
      customerEntity,
      editProfileRequest,
    );
    await this.customerRepository.saveHearAboutUs(
      customerEntity,
      editProfileRequest.hearAboutUs,
    );
    await this.customerRepository.clearEmergencies(customerEntity);
    await this.customerRepository.addEmergencyBulk(
      customerEntity,
      editProfileRequest.emergencies,
    );
    return new SuccessModel();
  }

  async getAll(
    paginationOpt: IPaginationOptions,
    name: PaginationRequest,
  ): Promise<PaginationResponse<CustomersResponse>> {
    const customers = await this.customerRepository.getAll(paginationOpt, name);

    const customersViewModel: PaginationResponse<CustomersResponse> = await makeCustomersResponseMany(
      customers.items,
    );

    return {
      items: customersViewModel.items,
      meta: customers.meta,
    };
  }

  async getAllCards(
    customerId: string,
    paginationOpt: IPaginationOptions,
  ): Promise<PaginationResponse<CardItemListResponse>> {
    const customerEntity:
      | CustomerEntity
      | undefined = await this.customerRepository.findOne(customerId);
    if (!customerEntity) {
      throw new InternalServerErrorException('customer not found');
    }

    const paginateCardEntities: Pagination<CustomerBankCardEntity> = await this.cardRepository.getAllAsCustomer(
      customerId,
      paginationOpt,
    );

    const cardItems: Array<CardItemListResponse> = [];
    for (const cardEntity of paginateCardEntities.items) {
      const cardItem: CardItemListResponse = {
        id: cardEntity.id,
        number: cardEntity.fourDigits.slice(-4),
        token: cardEntity.token,
        isChosen: cardEntity.isChosen,
        cvc: cardEntity.cvc,
        expiration: cardEntity.expiry,
      };

      cardItems.push(cardItem);
    }

    return {
      data: customerEntity.billingAddress,
      items: cardItems,
      meta: paginateCardEntities.meta,
    };
  }

  async setAvatar(customerId: string, avatar: FileLib): Promise<SuccessModel> {
    const customerEntity:
      | CustomerEntity
      | undefined = await this.customerRepository.findOne(customerId);
    if (!customerEntity) {
      throw new InternalServerErrorException('User has not customer entity!');
    }
    const avatarFileEntity: PhotoEntity = await this.awsS3Lib.upload(
      avatar,
      FolderEnum.CUSTOMER_PHOTOS,
    );

    await this.customerRepository.setAvatar(
      customerEntity,
      avatarFileEntity,
      async (oldPhotoEntity: PhotoEntity | undefined) => {
        if (oldPhotoEntity) {
          await this.eventEmitter.emitAsync('photo.delete', oldPhotoEntity);
        }
      },
    );

    return new SuccessModel();
  }

  async getMainOrders(
    customerId: string,
    paginationRequest: PaginationRequest,
  ): Promise<GetMainOrdersResponse> {
    const customerEntity:
      | CustomerEntity
      | undefined = await this.customerRepository.findOne(customerId);
    if (!customerEntity) {
      throw new InternalServerErrorException('Customer not found!');
    }

    const paginationMainOrder = await this.mainOrderRepository.getMainOrdersAsCustomer(
      customerId,
      paginationRequest,
    );
    const getMainOrderItems: Array<MainOrderViewModel> = [];
    for (const mainOrderEntity of paginationMainOrder.items) {
      const serviceEntity = await mainOrderEntity.service;
      const orderEntities = await mainOrderEntity.orders;
      const mainOrderPetEntities = await mainOrderEntity.mainOrderPets;
      // const visitEntities = await mainOrderEntity.visits;
      // const customerEntity = await mainOrderEntity.customer;
      // const mainOrderExtraServiceEntities = await mainOrderEntity.mainOrderExtras;
      // const holidayDateEntities = await mainOrderEntity.dates;

      const serviceViewModel: ServiceViewModel = await makeServiceViewModel(
        serviceEntity,
      );
      const orderViewModels: Array<OrderViewModel> = await makeOrderViewModelMany(
        orderEntities,
      );
      const petViewModels: Array<PetViewModel> = await makePetViewModelMany(
        mainOrderPetEntities,
      );
      // const visitViewModels: Array<VisitViewModel> = makeVisitViewModelMany(
      //   visitEntities,
      // );

      // const holidayViewModels = new Array<{ price: number; date: number }>();
      // for (const holidayEntity of holidayDateEntities) {
      //   // console.log('-------', holidayEntity);

      //   const holidayViewModel = {
      //     price: holidayFee,
      //     date: holidayEntity.dateFrom.getTime(),
      //   };
      //   if (holidayEntity.isHoliday === true) {
      //     holidayViewModels.push(holidayViewModel);
      //   }
      // }

      // const extraServices = new Array<{ name: string; price: number }>();
      // for (const mainOrderExtraServiceEntity of mainOrderExtraServiceEntities) {
      //   const extraServiceEntity = await mainOrderExtraServiceEntity.extraService;

      //   const extraViewModel = {
      //     name: extraServiceEntity.title,
      //     price: mainOrderExtraServiceEntity.price,
      //   };
      //   extraServices.push(extraViewModel);
      // }

      //Orders Listing in ASC
      let orderViewModel = orderViewModels.sort(function (a, b) {
        return a.timeFrom - b.timeFrom;
      });

      // const [customerViewModel] = await Promise.all([
      //   makeCustomerViewModel(customerEntity),
      // ]);

      const mainOrderViewModel: MainOrderViewModel = {
        id: mainOrderEntity.id,
        // firstDate: mainOrderEntity.firstDate.getTime(),
        // lastDate: mainOrderEntity.lastDate.getTime(),
        service: serviceViewModel,
        // status: mainOrderEntity.status,
        pets: petViewModels,
        // visits: visitViewModels,
        orders: orderViewModel,
        // customer: customerViewModel,
        createdAt: mainOrderEntity.createdAt.getTime(),
        // total: {
        //   totalAmount: mainOrderEntity.totalAmount,
        //   holidays: holidayViewModels,
        //   extras: extraServices,
        // },
      };

      getMainOrderItems.push(mainOrderViewModel);
    }

    return {
      items: getMainOrderItems,
      meta: paginationMainOrder.meta,
    };
  }

  async signUp(regRequest: RegistrationRequest): Promise<AddCustomerResponse> {
    const userExistEntity = await this.userRepository.findOne({
      where: { email: regRequest.email },
    });
    if (userExistEntity) {
      throw new BadRequestException('User exists with this email');
    }

    const zipCodeExistEntity:
      | ZipCodeEntity
      | undefined = await this.zipCodeRepository.findOne({
      where: { zipCode: regRequest.zipCode },
    });
    if (!zipCodeExistEntity) {
      throw new BadRequestException('Zip code is not allowed');
    }

    const passwordHash = await bcrypt.hash(
      regRequest.password,
      await bcrypt.genSalt(),
    );

    const newUserEntity: UserEntity = new UserEntity();
    newUserEntity.email = regRequest.email;
    newUserEntity.passwordHash = passwordHash;
    newUserEntity.role = UserRoleEnum.CUSTOMER;
    // newUserEntity.deviceToken = regRequest.deviceToken;
    // newUserEntity.deviceType = regRequest.deviceType;
    await this.userRepository.save(newUserEntity);

    const customerEntity: CustomerEntity = await this.customerRepository.upsertCustomer(
      regRequest,
      undefined,
      { userEntity: newUserEntity, zipCodeEntity: zipCodeExistEntity },
    );

    //Notification Flag entry
    const notificationEntity: NotificationFlagEntity = await this.notificationFlagRepository.upsertNotificationFlag(
      regRequest,
      undefined,
      { customerEntity: customerEntity },
    );
    const hearAboutUs = HearAboutUsEnum.OTHER;
    await this.customerRepository.saveHearAboutUs(customerEntity, hearAboutUs);
    await this.customerRepository.saveHomeInfo(customerEntity, regRequest);
    await this.customerRepository.addEmergencyBulk(
      customerEntity,
      regRequest.emergencies,
    );

    const sessionEntity = await this.userRepository.updateSession(
      newUserEntity,
    );
    // const {
    //   accessTokenModel,
    //   refreshTokenModel,
    // } = await this.jwtService.createPairTokens(
    //   newUserEntity,
    //   sessionEntity.sessionId,
    // );

    // const loginResponse: LoginResponse = {
    //   accessToken: accessTokenModel.token,
    //   accessExpiredAt: accessTokenModel.expiredAt.toMillis(),
    //   refreshToken: refreshTokenModel.token,
    //   refreshExpiredAt: refreshTokenModel.expiredAt.toMillis(),
    // };
    const loginResponse: AddCustomerResponse = {
      id: customerEntity.id,
    };
    return loginResponse;
  }

  async deleteCustomer(customerId: string): Promise<SuccessModel> {
    const today = DateTime.utc();
    const customerEntity:
      | CustomerEntity
      | undefined = await this.customerRepository.findOne({
      where: { id: customerId },
    });
    if (!customerEntity) {
      throw new InternalServerErrorException('Customer not found!');
    }

    const mainOrders = await this.mainOrderRepository.find({
      where: { customer: customerId, lastDate: MoreThan(today) },
      relations: ['customer'],
    });

    if (mainOrders.length) {
      throw new InternalServerErrorException('Customer has active orders!');
    }

    customerEntity.isDeleted = true;
    await this.customerRepository.save(customerEntity);

    return new SuccessModel();
  }

  async addCardTocken(
    // customerEntity: CustomerEntity,
    customerId: string,
    addCardRequest: AddCardRequest,
  ): Promise<SuccessModel> {
    const customerEntity:
      | CustomerEntity
      | undefined = await this.customerRepository.findOne({
      where: { id: customerId },
    });
    if (!customerEntity) {
      throw new InternalServerErrorException('Customer not found!');
    }
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

    let res;
    try {
      res = await axios({
        method: verb,
        url: url,
        headers: headers,
        data: card,
      });
    } catch (err: any) {
      throw new InternalServerErrorException(err.response.data.detail);
    }
    //Save Token
    const newCardEntity = new CustomerBankCardEntity();
    newCardEntity.token = res.data.vaultResponse.data;
    newCardEntity.fourDigits = addCardRequest.number.slice(-4);
    newCardEntity.customer = Promise.resolve(customerEntity);
    await this.cardRepository.save(newCardEntity);
    console.log('newCardEntity', newCardEntity);
    return new SuccessModel();
  }

  async editCardToken(
    cardId: string,
    customerId: string,
    addCardRequest: AddCardRequest,
  ): Promise<SuccessModel> {
    const customerEntity:
      | CustomerEntity
      | undefined = await this.customerRepository.findOne({
      where: { id: customerId },
    });
    if (!customerEntity) {
      throw new InternalServerErrorException('Customer not found!');
    }

    const cardEntity:
      | CustomerBankCardEntity
      | undefined = await this.cardRepository.findOne({
      where: {
        id: cardId,
        customer: customerId,
      },
    });

    if (!cardEntity) {
      throw new NotFoundException('No card was found !');
    }

    var card = {
      CardData: {
        Number: addCardRequest.number,
        Expiration: addCardRequest.expiration,
        cvv: addCardRequest.cvc,
      },
    };

    var merchantId = process.env.MERCHANTID;
    var nonce = crypto.randomBytes(12).toString('base64');
    var timestamp = Math.floor(new Date().getTime() / 1000);
    var verb = 'PUT';
    var pay = JSON.stringify(card);

    var url = `https://api-cert.sagepayments.com/token/v1/tokens/${cardEntity.token}`;
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

    let res;
    try {
      res = await axios({
        method: verb,
        url: url,
        headers: headers,
        data: card,
      });
    } catch (err: any) {
      throw new InternalServerErrorException(err.response.data.detail);
    }
    //Save Token

    if (res.data.vaultResponse.status == 1) {
      cardEntity.fourDigits = addCardRequest.number.slice(-4);
      // cardEntity.cvc = addCardRequest.cvc;
      // cardEntity.expiry = addCardRequest.expiration;
      cardEntity.token = res.data.vaultResponse.data;
      await this.cardRepository.save(cardEntity);
    }

    return new SuccessModel();
  }

  async deleteCard(customerId: string, cardId: string): Promise<SuccessModel> {
    const cardEntity = await this.cardRepository.findOne({
      where: { id: cardId, customer: customerId },
    });
    if (!cardEntity) {
      throw new NotFoundException('Card was not found!');
    }
    await this.cardRepository.remove(cardEntity);
    return new SuccessModel();
  }

  async getSingleCard(
    customerId: string,
    cardId: string,
  ): Promise<CardItemListResponse> {
    const customerEntity:
      | CustomerEntity
      | undefined = await this.customerRepository.findOne(customerId);
    if (!customerEntity) {
      throw new InternalServerErrorException('customer not found');
    }

    const card:
      | CustomerBankCardEntity
      | undefined = await this.cardRepository.findOne({
      where: { id: cardId },
      relations: ['customer'],
    });

    const cardViewModel: CardItemListResponse = {
      id: card?.id!,
      number: `XXXX-XXXX-XXXX-${card?.fourDigits.slice(-4)!}`,
      token: card?.token!,
      isChosen: card?.isChosen!,
      cvc: card?.cvc,
      expiration: card?.expiry,
    };

    return cardViewModel;
  }
}
