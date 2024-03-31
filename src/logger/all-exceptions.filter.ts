import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CustomLogger } from './logger.service';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly customLogger: CustomLogger,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  catch(exception: unknown, argumentsHost: ArgumentsHost): void {
    const context = argumentsHost.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: this.httpAdapterHost.httpAdapter.getRequestUrl(
        context.getRequest(),
      ),
    };

    this.customLogger.error(JSON.stringify(responseBody));
    this.httpAdapterHost.httpAdapter.reply(
      context.getResponse(),
      responseBody,
      httpStatus,
    );
  }
}
