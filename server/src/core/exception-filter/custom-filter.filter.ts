import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class CustomFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal Server Error';

    const responseBody = {
      path: httpAdapter.getRequestUrl(request),
      method: httpAdapter.getRequestMethod(request),
      statusCode: httpStatus,
      message: message,
    };

    const errorInfo = {
      ...responseBody,
      body: request?.body,
      query: request?.query,
    };

    this.logger.warn(JSON.stringify(errorInfo));

    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
