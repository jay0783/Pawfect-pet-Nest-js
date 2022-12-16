import { Module } from "@nestjs/common";

import { PetServiceController } from "./pet-service.controller";
import { PetServiceService } from "./pet-service.service";


@Module({
  imports: [
  ],
  controllers: [PetServiceController],
  providers: [PetServiceService]
})
export class PetServiceModule { }
