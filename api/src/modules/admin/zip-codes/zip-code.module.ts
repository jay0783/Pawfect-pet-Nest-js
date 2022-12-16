import { Module } from '@nestjs/common';

import { ZipCodeController } from './zip-code.controller';
import { ZipCodeService } from './zip-code.service';


@Module({
  controllers: [ZipCodeController],
  providers: [ZipCodeService],
})
export class ZipCodeModule {
}
