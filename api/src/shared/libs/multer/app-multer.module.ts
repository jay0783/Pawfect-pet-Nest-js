import { DynamicModule } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { fileFilter } from './file-filter';

export class AppMulterModule {
  static forFeature(): DynamicModule {
    return MulterModule.registerAsync({
      useFactory: () => ({
        storage: memoryStorage(),
        limits: {
          fileSize: 100000000, //10mb
        },
        fileFilter,
      }),
    });
  }
}
