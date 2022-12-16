import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginRequest, LoginResponse } from './models';

@ApiTags('Admin')
@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
    const loginResponse: LoginResponse = await this.authService.signIn(
      loginRequest,
    );
    return loginResponse;
  }
}
