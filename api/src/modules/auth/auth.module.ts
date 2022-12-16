import { Module } from '@nestjs/common';

import { AppPassportModule } from '@pawfect/libs/passport';
import { NodeMailerModule } from '@pawfect/libs/nodemailer';
import { AwsS3Module } from '@pawfect/libs/aws-s3';
import { AppMulterModule } from '@pawfect/libs/multer';
import { AppJwtModule } from '@pawfect/libs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    AppPassportModule,
    AppJwtModule,
    NodeMailerModule,
    AwsS3Module,
    AppMulterModule.forFeature(),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
