import { DateTime } from 'luxon';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AdminEntity, UserEntity } from '@pawfect/db/entities';
import { UserRoleEnum } from '@pawfect/db/entities/enums';
import { AppJwtConfig } from '@pawfect/configs';
import { EncodedTokenModel } from './models';


@Injectable()
export class AppJwtService {
  private readonly jwtConfig: AppJwtConfig;

  constructor(
    private readonly jwtService: JwtService,
    readonly configService: ConfigService
  ) {
    this.jwtConfig = <AppJwtConfig>configService.get('jwt');
  }


  private async createAccessToken(user: UserEntity, sessionId: string): Promise<EncodedTokenModel> {
    const accessPayload = {
      id: user.id,
      role: user.role,
      sessionId: sessionId
    };

    const accessToken: string = this.jwtService.sign(accessPayload);
    const expiredAt = DateTime.utc().plus({ hour: 3 }); //TODO: rewrite to variant with jwt config

    return { token: accessToken, expiredAt: expiredAt };
  }


  private async createRefreshToken(user: UserEntity, sessionId: string): Promise<EncodedTokenModel> {
    const refreshPayload = {
      id: user.id,
      role: user.role,
      sessionId: sessionId
    };

    const refreshToken: string = this.jwtService.sign(refreshPayload, this.jwtConfig.refreshOptions);
    const expiredAt = DateTime.utc().plus({ day: 7 });//TODO: rewrite to variant with jwt config

    return { token: refreshToken, expiredAt: expiredAt };
  }


  async createAccessAdminToken(admin: AdminEntity): Promise<string> {
    const accessPayload = {
      id: admin.id
    };

    const accessToken: string = this.jwtService.sign(accessPayload);
    return accessToken;
  }


  async createPairTokens(user: UserEntity, sessionId: string): Promise<{ accessTokenModel: EncodedTokenModel; refreshTokenModel: EncodedTokenModel; }> {
    const [accessTokenModel, refreshTokenModel] = await Promise.all([
      this.createAccessToken(user, sessionId),
      this.createRefreshToken(user, sessionId)
    ]);

    return { accessTokenModel, refreshTokenModel };
  }


  decodeRefreshToken(token: string): { id: string; role: UserRoleEnum; sessionId: string; } | null {
    const decodedToken = this.jwtService.decode(token) as { id: string; role: UserRoleEnum; sessionId: string; } | null;
    return decodedToken;
  }


  decodeAccessToken(token: string): { id: string; role: UserRoleEnum; sessionId: string; } | null {
    const decodedToken = this.jwtService.decode(token) as { id: string; role: UserRoleEnum; sessionId: string; } | null;
    return decodedToken;
  }
}
