import * as winston from "winston";
import { Injectable, LoggerService, Scope } from "@nestjs/common";

import { enumerateErrorFormatter } from "./formatters";


@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLogger implements LoggerService {
  private readonly winstonLogger: winston.Logger;

  constructor() {
    this.winstonLogger = this.initLogger();
  }

  private initLogger(): winston.Logger {
    const logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        enumerateErrorFormatter(),
        winston.format.json(),
        winston.format.colorize(),
        winston.format.padLevels(),
      ),
      transports: [
        new winston.transports.File({ dirname: 'logs', filename: 'error.log', level: 'error' }),
        new winston.transports.File({ dirname: 'logs', filename: 'info.log', level: 'info' }),
        new winston.transports.File({ dirname: 'logs', filename: 'combined.log' }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      logger.add(
        new winston.transports.Console({
          format: winston.format.simple(),
        })
      );
    }

    return logger;
  }


  log(message: any, context?: string): void {
    this.winstonLogger.log('info', message, context);
  }


  error(message: any, trace?: string, context?: string): void {
    this.winstonLogger.error(trace || message, context);
  }


  warn(message: any, context?: string): void {
    this.winstonLogger.warn(message, context);
  }


  debug(message: any, context?: string): void {
    this.winstonLogger.debug(message, context);
  }


  verbose(message: any, context?: string): void {
    this.winstonLogger.verbose(message, context);
  }
}
