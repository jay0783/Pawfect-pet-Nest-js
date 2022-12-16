import { request } from "express";
import { UnauthorizedException } from "@nestjs/common";
import { UserEntity } from "@pawfect/db/entities";


declare module "express-serve-static-core" {
  export interface Request {
    getAuthEntity(): UserEntity;
  }
}

request.getAuthEntity = function (): UserEntity {
  const user: UserEntity = this.user as UserEntity;
  if (!user) {
    throw new UnauthorizedException();
  }

  return user;
};

export {};