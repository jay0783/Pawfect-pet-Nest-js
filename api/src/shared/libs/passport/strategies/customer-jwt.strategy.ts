import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";

import { UserEntity } from "@pawfect/db/entities";
import { UserRepository } from "@pawfect/db/repositories";


@Injectable()
export class CustomerJwtStrategy extends PassportStrategy(Strategy, "customer-jwt") {
  constructor(
    configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super(configService.get("jwt").passportOptions);
  }

  async validate(payload: any): Promise<any> {
    const userEntity: UserEntity | undefined = await this.userRepository.findOne({ where: { id: payload.id } });

    if (!userEntity) {
      throw new UnauthorizedException();
    }

    // remove session checks
    // const userSessionEntity = await userEntity.session;
    // if (!payload || userSessionEntity?.sessionId !== payload.sessionId) {
    //   throw new UnauthorizedException();
    // }

    return userEntity;
  }
}
