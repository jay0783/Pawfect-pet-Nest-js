import { Module } from "@nestjs/common";
import { AppRedisModule } from "@pawfect/libs/redis";

import { MapController } from "./map.controller";
import { MapService } from "./map.service";


@Module({
  imports: [AppRedisModule],
  controllers: [MapController],
  providers: [MapService],
  exports: []
})
export class MapModule { }
