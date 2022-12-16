import { Module } from "@nestjs/common";
import { AppConfigModule } from "@pawfect/configs";
import { AppRedisService } from "./services";


@Module({
  imports: [AppConfigModule],
  providers: [AppRedisService],
  exports: [AppRedisService]
})
export class AppRedisModule { }
