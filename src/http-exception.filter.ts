import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SentryExceptionCaptured } from '@sentry/nestjs';
import * as Sentry from '@sentry/nestjs';

@Catch() 
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  @SentryExceptionCaptured() 
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let shouldReportToSentry = false;


    if (exception instanceof HttpException) {
      
      status = exception.getStatus();
      message = exception.message;
      shouldReportToSentry = status >= 500;
      
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal Server Error';
      shouldReportToSentry = true;
    }

    if (shouldReportToSentry) {
      Sentry.captureException(exception, {
        tags: {
          endpoint: request.url,
          method: request.method,
          userAgent: request.get('user-agent'),
        },
        extra: {
          body: request.body,
          params: request.params,
          query: request.query,
        },
        level: status >= 500 ? 'error' : 'warning',
      });
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      ...(process.env.NODE_ENV === 'development' && 
         !(exception instanceof HttpException) && {
        error: exception instanceof Error ? exception.message : String(exception),
      }),
    };

    response.status(status).json(errorResponse);
  }
}