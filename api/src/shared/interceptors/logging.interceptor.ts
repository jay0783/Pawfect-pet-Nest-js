import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { WinstonLogger } from "@pawfect/libs/winston";
import { Request } from "express";
import os from "os";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";



@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: WinstonLogger
  ) { }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request: Request = context.switchToHttp().getRequest();

    const log: { [key: string]: any; } = {
      date: new Date,
      httpPath: request.path,
      requestBody: JSON.stringify(request.body),
      cpu: JSON.stringify(os.cpus()),
      heapTotal: os.totalmem(),
      heapFree: os.freemem(),
      responseBody: null,
    };

    return next.handle().pipe(
      map(data => {
        log.responseBody = JSON.stringify(data);

        this.logger.log(JSON.stringify(log));

        return data;
      })
    );
  }
}
