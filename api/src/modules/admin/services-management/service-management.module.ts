import { Module } from '@nestjs/common';

import { ServiceManagementController } from "./service-management.controller";
import { ServiceManagementService } from "./service-management.service";


@Module({
  controllers: [ServiceManagementController],
  providers: [ServiceManagementService],
})
export class ServiceManagementModule { }
