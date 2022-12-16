import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '@pawfect/configs';
import { AppEventEmitterModule } from '@pawfect/event-emitters';
import { HttpExceptionFilter } from '@pawfect/filter';
import { LoggingInterceptor } from '@pawfect/interceptors';
import { AppApidocModule } from '@pawfect/libs/apidoc';
import { AppPublicModule } from '@pawfect/libs/public';
import { WinstonLoggerModule } from '@pawfect/libs/winston';
import { IndexModule } from './modules/index.modules';
import { DbModule } from './shared/db';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(),
    AppApidocModule.forRootAsync(),
    AppPublicModule.forRootAsync(),
    AppConfigModule,
    DbModule,
    AppEventEmitterModule,
    IndexModule,
    WinstonLoggerModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
