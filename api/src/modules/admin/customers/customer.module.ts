import { Module } from '@nestjs/common';
import { AwsS3Module } from '@pawfect/libs/aws-s3';
import { AppMulterModule } from '@pawfect/libs/multer';
import { NodeMailerModule } from '@pawfect/libs/nodemailer';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [AwsS3Module, AppMulterModule.forFeature(), NodeMailerModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
