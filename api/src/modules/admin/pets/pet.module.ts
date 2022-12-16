import { Inject, Module } from '@nestjs/common';
import { AwsS3Module } from '@pawfect/libs/aws-s3';
import { AppMulterModule } from '@pawfect/libs/multer';
import { PetController } from './pet.controller';
import { PetService } from './pet.service';

@Module({
  imports: [AwsS3Module, AppMulterModule.forFeature()],
  controllers: [PetController],
  providers: [PetService],
})
export class PetModule {}
