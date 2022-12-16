import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { jwtConfigRegister, emailRegister, awsS3Register, redisRegister } from "./configs";


@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        jwtConfigRegister,
        emailRegister,
        awsS3Register,
        redisRegister
      ]
    })
  ],
  exports: [ConfigModule]
})
export class AppConfigModule { }
