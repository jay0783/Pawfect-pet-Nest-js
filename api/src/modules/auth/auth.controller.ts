import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import * as url from 'url';

import { SuccessModel } from '@pawfect/models';
import { AuthService } from './auth.service';
import { CustomerEntity, UserEntity } from '@pawfect/db/entities';

import {
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
  CheckEmailRequest,
  PasswordChangeRequest,
  ForgotPasswordRequest,
  IsExistResponse,
  CheckZipCodeRequest,
  RefreshTokenRequest,
} from './models';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(
    @Body() registrationRequest: RegistrationRequest,
  ): Promise<LoginResponse> {
    const accessTokenModel: LoginResponse = await this.authService.signUp(
      registrationRequest,
    );
    return accessTokenModel;
  }

  @Post('sign-in')
  async signIn(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
    const loginResponse: LoginResponse = await this.authService.signIn(
      loginRequest,
    );
    return loginResponse;
  }

  @Post('refresh')
  async refreshToken(
    @Body() refreshTokenRequest: RefreshTokenRequest,
  ): Promise<LoginResponse> {
    const loginResponse: LoginResponse = await this.authService.refreshToken(
      refreshTokenRequest.accessToken,
    );
    return loginResponse;
  }

  @Get('forgot-password')
  async forgetPassword(
    @Req() req: Request,
    @Query() forgotPasswordRequest: ForgotPasswordRequest,
  ): Promise<SuccessModel> {
    await this.authService.forgotPassword(
      forgotPasswordRequest.email,
      (code) => {
        const newUrl = new url.URL(
          `http://${req.headers.host}/public/transporters/forgot-password.transporter.html?code=${code}`,
        );
        return newUrl.toString();
      },
    );

    return new SuccessModel();
  }

  @Post('forgot-password/change')
  async passwordChange(
    @Body() passwordChangeRequest: PasswordChangeRequest,
  ): Promise<SuccessModel> {
    await this.authService.passwordChange(passwordChangeRequest);
    return new SuccessModel();
  }

  @Get('email/check')
  async checkEmail(
    @Query() checkEmailRequest: CheckEmailRequest,
  ): Promise<IsExistResponse> {
    const response: IsExistResponse = await this.authService.checkEmail(
      checkEmailRequest,
    );
    return response;
  }

  @Get('zip-code/check')
  async checkZipCode(
    @Query() checkZipCodeRequest: CheckZipCodeRequest,
  ): Promise<IsExistResponse> {
    const response = await this.authService.checkZipCode(
      checkZipCodeRequest.zipCode,
    );
    return response;
  }
}
