import '@pawfect/extensions';
import {
  INestApplication,
  LoggerService,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import { WinstonLogger } from '@pawfect/libs/winston';
import { LoggingInterceptor } from '@pawfect/interceptors';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const logger: LoggerService = new WinstonLogger();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(compression());
  app.enableShutdownHooks();
  app.enableCors();
  const options = new DocumentBuilder()
    .setTitle('Pawfect Pet')
    .setDescription(`The Pawfect Pet API description`)
    .setVersion('1.0')
    .addServer('')
    .addServer('/pawfect_web_qa')
    .addServer('/pawfect_web')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  app.useLogger(logger);

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
  logger.log(`Application is running on: ${await app.getUrl()}`);
  // export app;
}

bootstrap();

process.on('uncaughtException', (error) => {
  logger.error(error.name, error.stack);
});
process.on('unhandledRejection', (error: Error) => {
  logger.error(error, error.stack);
});
