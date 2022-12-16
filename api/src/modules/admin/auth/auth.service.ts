import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AppJwtService } from '@pawfect/libs/jwt';
import { AdminEntity } from '@pawfect/db/entities';
import { AdminRepository } from '@pawfect/db/repositories';
import { LoginRequest, LoginResponse } from './models';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly jwtService: AppJwtService,
  ) {}

  async signIn(loginRequest: LoginRequest): Promise<LoginResponse> {
    const adminEntity:
      | AdminEntity
      | undefined = await this.adminRepository.findOne({
      where: { email: loginRequest.login },
    });
    if (!adminEntity) {
      throw new BadRequestException('admin account was not found');
    }

    const passValid = await bcrypt.compare(
      loginRequest.password,
      adminEntity.passwordHash,
    );
    if (!passValid) {
      throw new BadRequestException('password is not valid');
    }

    const accessToken: string = await this.jwtService.createAccessAdminToken(
      adminEntity,
    );

    await this.adminRepository.saveSession(adminEntity, accessToken);

    return { accessToken };
  }
}
