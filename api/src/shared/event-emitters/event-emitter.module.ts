import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AwsS3Module } from '../libs/aws-s3';
import { PhotoListener, DeviceDetailListener } from './listeners';

@Global()
@Module({
  imports: [EventEmitterModule.forRoot(), AwsS3Module],
  providers: [PhotoListener, DeviceDetailListener],
  exports: [EventEmitterModule],
})
export class AppEventEmitterModule {}
