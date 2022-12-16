/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ArgumentsHost, Catch, ExceptionFilter, HttpException
} from "@nestjs/common";
import { Request, Response } from "express";


@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    console.log(request.url);
    console.log(exception);

    const exceptionResponse: any = exception.getResponse();

    const errorResponse = {
      message: null
    };

    if (exceptionResponse && exceptionResponse.message && exceptionResponse.message.length) {
      [errorResponse.message] = exceptionResponse.message;
    }

    if (typeof exceptionResponse?.message === "string") {
      errorResponse.message = exceptionResponse.message;
    }

    response.status(status).json(errorResponse);
  }
}
