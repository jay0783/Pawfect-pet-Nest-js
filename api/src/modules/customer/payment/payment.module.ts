import { Module } from '@nestjs/common';

import { AwsS3Module } from '@pawfect/libs/aws-s3';
import { AppMulterModule } from '@pawfect/libs/multer';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  imports: [AwsS3Module, AppMulterModule.forFeature()],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [],
})
export class PaymentModule {}
