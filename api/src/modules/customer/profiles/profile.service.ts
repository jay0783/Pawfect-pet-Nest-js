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
} from '@pawfect/db/repositories';
import {
  EmergencyModel,
  SuccessModel,
  PaginationResponse,
} from '@pawfect/models';
import { AwsS3Lib, FileLib, FolderEnum } from '@pawfect/libs/aws-s3';
import { EmailSenderService } from '@pawfect/libs/nodemailer';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import {
  ChangePasswordRequest,
  EditProfileRequest,
  GetMyProfileResponse,
  GetMyShortProfileResponse,
  makeGetMyProfileResponse,
  ShareRequest,
  GetEmergenciesResponse,
  makeEmergencyViewModel,
  AddCardRequest,
  AddCardResponse,
  CardItemListResponse,
} from './models';
var Publishable_Key = process.env.PUBLISHABLE_KEY;
var Secret_Key = process.env.SECRET_KEY;

const stripe = require('stripe')(Secret_Key);
@Injectable()
export class ProfileService {
  constructor(
    private readonly cardRepository: CardRepository,
    private readonly emailSenderService: EmailSenderService,
    private readonly customerRepository: CustomerRepository,
    private readonly userRepository: UserRepository,
    private readonly awsS3Lib: AwsS3Lib,
    private readonly eventEmitter: EventEmitter2, // private readonly cardRepository: CardRepository,
  ) {}

  async getMyProfile(
    userEntity: UserEntity,
    customerEntity: CustomerEntity,
  ): Promise<GetMyProfileResponse> {
    const customerProfile = (await this.customerRepository.getCustomerProfile(
      customerEntity.id,
    )) as CustomerEntity;
    return makeGetMyProfileResponse(customerProfile);
  }

  async getMyShortProfile(
    customerEntity: CustomerEntity,
  ): Promise<GetMyShortProfileResponse> {
    const avatarEntity: PhotoEntity | undefined = await customerEntity.avatar;

    const shortProfileResponse: GetMyShortProfileResponse = {
      name: customerEntity.name || '',
      surname: customerEntity.surname || '',
      balance: customerEntity.balance,
      imageUrl: avatarEntity?.url,
    };

    return shortProfileResponse;
  }

  async editProfile(
    customerEntity: CustomerEntity,
    editProfileRequest: EditProfileRequest,
  ): Promise<SuccessModel> {
    let profileStatus = customerEntity.status;
    console.log('profileStatus: ', profileStatus);
    const userEntity = await customerEntity.user;
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
    if (profileStatus == 0) {
      //send mail on user registration
      await this.emailSenderService.sendClientRegistrationNotification(
        customerEntity.name,
        userEntity.email,
      );
      console.log('email sent');
    }
    return new SuccessModel();
  }

  async changePassword(
    userEntity: UserEntity,
    changePasswordRequest: ChangePasswordRequest,
  ): Promise<SuccessModel> {
    const isValidPassword: boolean = await bcrypt.compare(
      changePasswordRequest.oldPassword,
      userEntity.passwordHash,
    );
    if (!isValidPassword) {
      throw new BadRequestException('old password is invalid');
    }

    userEntity.passwordHash = await bcrypt.hash(
      changePasswordRequest.newPassword,
      await bcrypt.genSalt(),
    );
    await this.userRepository.save(userEntity);

    return new SuccessModel();
  }

  async setAvatar(
    customerEntity: CustomerEntity,
    avatar: FileLib,
  ): Promise<SuccessModel> {
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

  async getEmergencies(
    customerEntity: CustomerEntity,
  ): Promise<GetEmergenciesResponse> {
    const emergenciesEntities = await this.customerRepository.getEmergencies(
      customerEntity.id,
    );
    const emergenciesViewModelsPromises = emergenciesEntities.map((emergency) =>
      makeEmergencyViewModel(emergency),
    );
    const emergenciesViewModels = await Promise.all(
      emergenciesViewModelsPromises,
    );
    return { items: emergenciesViewModels };
  }

  async addEmergency(
    customerEntity: CustomerEntity,
    newEmergency: Omit<EmergencyModel, 'id'>,
  ): Promise<SuccessModel> {
    await this.customerRepository.addEmergency(customerEntity, newEmergency);
    return new SuccessModel();
  }

  async deleteEmergency(
    customerEntity: CustomerEntity,
    emergencyId: string,
  ): Promise<SuccessModel> {
    await this.customerRepository.deleteEmergency(customerEntity, emergencyId);
    return new SuccessModel();
  }

  async shareWithEmail(
    baseUrl: string,
    shareRequest: ShareRequest,
  ): Promise<SuccessModel> {
    const instagramAppLink = 'https://www.instagram/pawfectpetsitter';
    const facebookAppLink = 'https://www.facebook.com/pawfectpuppy';

    await this.emailSenderService.shareWithEmail(
      baseUrl,
      shareRequest.email,
      instagramAppLink,
      facebookAppLink,
    );
    return new SuccessModel();
  }

  async addCard(
    customerEntity: CustomerEntity,
    addCardRequest: AddCardRequest,
  ): Promise<AddCardResponse> {
    // createToken
    const token = await stripe.tokens.create({
      card: {
        number: addCardRequest.number,
        exp_month: addCardRequest.exp_month,
        exp_year: addCardRequest.exp_year,
        cvc: addCardRequest.cvc,
      },
    });

    const newCardEntity = new CustomerBankCardEntity();
    newCardEntity.fourDigits = token.card.last4;
    newCardEntity.token = token.id;
    newCardEntity.customer = Promise.resolve(customerEntity);

    await this.cardRepository.save(newCardEntity);

    const cardListResponse: AddCardResponse = {
      id: newCardEntity.id,
    };

    return cardListResponse;
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
        fourDigits: cardEntity.fourDigits,
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
}
