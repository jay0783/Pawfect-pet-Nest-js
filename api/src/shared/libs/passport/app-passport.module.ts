import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { AppJwtModule } from "../jwt/app-jwt.module";
import { AdminJwtStrategy, CustomerJwtStrategy, EmployeeJwtStrategy } from "./strategies";


@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: "jwt",
      session: false
    }),
    AppJwtModule
  ],
  providers: [CustomerJwtStrategy, AdminJwtStrategy, EmployeeJwtStrategy],
  exports: [PassportModule]
})
export class AppPassportModule { }
