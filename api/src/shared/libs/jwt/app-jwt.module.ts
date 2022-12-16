/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { AppJwtService } from "./services";


@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => configService.get("jwt").moduleOptions,
      inject: [ConfigService]
    }),
  ],
  providers: [AppJwtService],
  exports: [JwtModule, AppJwtService]
})
export class AppJwtModule { }
