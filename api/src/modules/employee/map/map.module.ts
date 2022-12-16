import { Module } from '@nestjs/common';

import { AwsS3Module } from '@pawfect/libs/aws-s3';
import { NodeMailerModule } from '@pawfect/libs/nodemailer';
import { AppRedisModule } from '@pawfect/libs/redis';
import { MapController } from './map.controller';
import { MapService } from './map.service';

@Module({
  imports: [AwsS3Module, AppRedisModule, NodeMailerModule],
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}
