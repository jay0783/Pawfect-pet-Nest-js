/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { DateTime } from "luxon";
import { Strategy } from "passport-jwt";

import { AdminEntity, AdminSessionEntity } from "@pawfect/db/entities";
import { AdminRepository } from "@pawfect/db/repositories";
import { AppJwtService } from "../../jwt/services";


@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, "admin-jwt") {
  constructor(
    readonly configService: ConfigService,
    private readonly adminRepository: AdminRepository,
    private readonly jwtService: AppJwtService
  ) {
    super(configService.get("jwt").passportOptions);
  }


  async validate(payload: { id?: string; exp?: number; }): Promise<any> {
    const adminEntity: AdminEntity | undefined = await this.adminRepository.findOne({ where: { id: payload.id } });

    if (!adminEntity) {
      throw new UnauthorizedException();
    }

    const expirationDate: Date = DateTime.fromMillis(payload.exp!).toJSDate();
    if (expirationDate > DateTime.utc().toJSDate()) {
      return adminEntity;
    }

    const session: AdminSessionEntity | undefined = await adminEntity.session;
    if (!session || session.expiredRefreshDate < DateTime.utc().toJSDate()) {
      throw new UnauthorizedException();
    }

    const accessToken = await this.jwtService.createAccessAdminToken(adminEntity);
    await this.adminRepository.saveSession(adminEntity, accessToken);

    return adminEntity;
  }
}
