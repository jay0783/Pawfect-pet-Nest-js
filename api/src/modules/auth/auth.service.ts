import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';

import { UserRoleEnum } from '@pawfect/db/entities/enums';
import {
  CustomerEntity,
  UserEntity,
  UserPasswordRecoveryEntity,
  UserSessionEntity,
  ZipCodeEntity,
  NotificationFlagEntity,
} from '@pawfect/db/entities';
import {
  CustomerRepository,
  UserRepository,
  ZipCodeRepository,
  NotificationFlagRepository,
  EmployeeRepository,
} from '@pawfect/db/repositories';
import { EmailSenderService } from '@pawfect/libs/nodemailer';
import { AppJwtService } from '@pawfect/libs/jwt';
import {
  CheckEmailRequest,
  IsExistResponse,
  LoginRequest,
  LoginResponse,
  PasswordChangeRequest,
  RegistrationRequest,
} from './models';
var Publishable_Key = process.env.PUBLISHABLE_KEY;
var Secret_Key = process.env.SECRET_KEY;

import { EventEmitter2 } from '@nestjs/event-emitter';
const stripe = require('stripe')(Secret_Key);
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly jwtService: AppJwtService,
    private readonly zipCodeRepository: ZipCodeRepository,
    private readonly emailSender: EmailSenderService,
    private readonly eventEmitter: EventEmitter2,
    private readonly notificationFlagRepository: NotificationFlagRepository,
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async signUp(regRequest: RegistrationRequest): Promise<LoginResponse> {
    const userExistEntity = await this.userRepository.findOne({
      where: { email: regRequest.email },
    });
    if (userExistEntity) {
      throw new BadRequestException('User is exists with this email');
    }

    const zipCodeExistEntity:
      | ZipCodeEntity
      | undefined = await this.zipCodeRepository.findOne({
      where: { zipCode: regRequest.zipCode },
    });
    if (!zipCodeExistEntity) {
      throw new BadRequestException('Zip code is not allows');
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

    // //Notification Flag entry
    // const notificationEntity: NotificationFlagEntity = await this.notificationFlagRepository.upsertNotificationFlag(
    //   regRequest,
    //   undefined,
    //   { userEntity: newUserEntity },
    // );

    // var createCustomer = function () {
    //   var param = {
    //     email: regRequest.email,
    //   };
    //   return stripe.customers.create(param);
    // };
    // var card = await createCustomer();
    // newUserEntity.card = card.id;

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
    // const status = await this.customerRepository.findOne({
    //   where: { email: regRequest.email },
    // });
    // console.log(status);

    // await this.customerRepository.saveHearAboutUs(
    //   customerEntity,
    //   regRequest.hearAboutUs,
    // );
    // await this.customerRepository.saveHomeInfo(customerEntity, regRequest);
    // await this.customerRepository.addEmergencyBulk(
    //   customerEntity,
    //   regRequest.emergencies,
    // );

    const sessionEntity = await this.userRepository.updateSession(
      newUserEntity,
    );
    const {
      accessTokenModel,
      refreshTokenModel,
    } = await this.jwtService.createPairTokens(
      newUserEntity,
      sessionEntity.sessionId,
    );

    const loginResponse: LoginResponse = {
      accessToken: accessTokenModel.token,
      accessExpiredAt: accessTokenModel.expiredAt.toMillis(),
      refreshToken: refreshTokenModel.token,
      refreshExpiredAt: refreshTokenModel.expiredAt.toMillis(),
    };

    return loginResponse;
  }

  async signIn(loginRequest: LoginRequest): Promise<LoginResponse> {
    const foundUserEntity:
      | UserEntity
      | undefined = await this.userRepository.findOne({
      where: { email: loginRequest.email },
    });

    if (!foundUserEntity) {
      throw new BadRequestException(
        'User was not found or password is invalid',
      );
    }

    //Status find
    const customerEntity:
      | CustomerEntity
      | undefined = await this.customerRepository.findOne({
      where: {
        user: foundUserEntity.id,
        isDeleted: false,
      },
    });
    console.log('customer_entity==>', customerEntity);

    const stausCustomer = customerEntity?.status;

    // if (!customerEntity || isDeleted) {
    //   throw new BadRequestException('Customer not found');
    // }

    //Notification Flag
    if (customerEntity) {
      const notiflag = await this.notificationFlagRepository.findOne({
        where: {
          customer: customerEntity.id,
        },
      });

      if (!notiflag) {
        const notificationEntity: NotificationFlagEntity = await this.notificationFlagRepository.upsertNotificationFlag(
          loginRequest,
          undefined,
          { customerEntity: customerEntity },
        );
      }
    }

    // Employee
    const employeeEntity = await this.employeeRepository.findOne({
      where: { user: foundUserEntity.id },
    });

    if (employeeEntity) {
      const notiflag = await this.notificationFlagRepository.findOne({
        where: {
          employee: employeeEntity.id,
        },
      });

      if (!notiflag) {
        const notificationEntity: NotificationFlagEntity = await this.notificationFlagRepository.upsertNotificationFlag(
          loginRequest,
          undefined,
          { employeeEntity: employeeEntity },
        );
      }
    }

    const passValid = await bcrypt.compare(
      loginRequest.password,
      foundUserEntity.passwordHash,
    );
    if (!passValid) {
      throw new BadRequestException('Password is not valid');
    }

    const sessionEntity = await this.userRepository.updateSession(
      foundUserEntity,
    );
    const {
      accessTokenModel,
      refreshTokenModel,
    } = await this.jwtService.createPairTokens(
      foundUserEntity,
      sessionEntity.sessionId,
    );

    //Event call heare
    await this.eventEmitter.emitAsync('SetDeviceDetails', loginRequest);
    // console.log('====', customerEntity);

    //set Token
    // stausCustomer.deviceToken = loginRequest.deviceToken;
    // stausCustomer.deviceType = loginRequest.deviceType;

    // await this.customerRepository.save(stausCustomer);
    var status;
    if (foundUserEntity.role === 'employee') {
      status = 3;
    } else {
      status = stausCustomer;
    }
    const loginResponse: LoginResponse = {
      accessToken: accessTokenModel.token,
      accessExpiredAt: accessTokenModel.expiredAt.toMillis(),
      refreshToken: refreshTokenModel.token,
      refreshExpiredAt: refreshTokenModel.expiredAt.toMillis(),
      role: foundUserEntity.role,
      status: status,
    };

    return loginResponse;
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    try {
      const decodedToken = this.jwtService.decodeRefreshToken(refreshToken);
      const userEntity: UserEntity = await this.userRepository.findOneOrFail({
        where: { id: decodedToken!.id, role: decodedToken!.role },
        join: {
          alias: 'user',
          leftJoin: { customer: 'user.customer', employee: 'user.employee' },
        },
      });

      const userSessionEntity:
        | UserSessionEntity
        | undefined = await userEntity.session;
      if (
        !decodedToken ||
        userSessionEntity?.sessionId !== decodedToken.sessionId
      ) {
        throw new UnauthorizedException();
      }

      const sessionEntity = await this.userRepository.updateSession(userEntity);
      const {
        accessTokenModel: newAccessTokenModel,
        refreshTokenModel: newRefreshTokenModel,
      } = await this.jwtService.createPairTokens(
        userEntity,
        sessionEntity.sessionId,
      );

      const loginResponse: LoginResponse = {
        accessToken: newAccessTokenModel.token,
        accessExpiredAt: newAccessTokenModel.expiredAt.toMillis(),
        refreshToken: newRefreshTokenModel.token,
        refreshExpiredAt: newRefreshTokenModel.expiredAt.toMillis(),
        role: userEntity.role,
      };

      return loginResponse;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  async forgotPassword(
    email: string,
    urlGenerator: (code: string) => string,
  ): Promise<void> {
    const userEntity:
      | UserEntity
      | undefined = await this.userRepository.findOne({ where: { email } });
    if (!userEntity) {
      throw new NotFoundException('user was not found');
    }

    const userForgotPassEntity = await this.userRepository.getActiveRecoveryByUserId(
      userEntity.id,
    );
    if (userForgotPassEntity) {
      throw new BadRequestException(
        'password change request is exist. send code, please',
      );
    }

    const code: string = uuid.v4();
    await this.userRepository.createForgot(userEntity, code);

    const changePassUrl = urlGenerator(code);
    this.emailSender
      .sendForgottenLetter(userEntity.email, changePassUrl)
      .catch((err) => console.error(err)); // TODO: 25.02.21 add error log
  }

  async passwordChange(
    passwordChangeRequest: PasswordChangeRequest,
  ): Promise<void> {
    const passwordChange:
      | UserPasswordRecoveryEntity
      | undefined = await this.userRepository.getActiveRecoveryByCode(
      passwordChangeRequest.code,
    );
    if (!passwordChange) {
      throw new BadRequestException('Password change request is not active');
    }

    await this.userRepository.deactivateRecovery(passwordChange);

    const userEntity: UserEntity = await passwordChange.user;
    userEntity.passwordHash = await bcrypt.hash(
      passwordChangeRequest.newPassword,
      await bcrypt.genSalt(),
    );
    await this.userRepository.save(userEntity);
  }

  async checkEmail(
    checkEmailRequest: CheckEmailRequest,
  ): Promise<IsExistResponse> {
    const existUser: UserEntity | undefined = await this.userRepository.findOne(
      {
        where: { email: checkEmailRequest.email },
      },
    );

    return { isExist: !!existUser };
  }

  async checkZipCode(zipCode: string): Promise<IsExistResponse> {
    const zipCodeEntity:
      | ZipCodeEntity
      | undefined = await this.zipCodeRepository.findOne({
      where: { zipCode },
    });
    return { isExist: !!zipCodeEntity };
  }
}
