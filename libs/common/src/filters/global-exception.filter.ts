import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IErrorResponse } from './error-response.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'An unexpected error occurred';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } else if (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      'meta' in exception &&
      (exception as { code: string }).code === 'P2002'
    ) {
      status = HttpStatus.CONFLICT;
      const meta = exception.meta as { target?: string[] };
      const target = meta.target?.join(', ');
      message = `A record with this ${target || 'value'} already exists.`;
    }

    const errorResponse: IErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: typeof message === 'string' ? { error: message } : message,
    };

    if (exception instanceof Error) {
      this.logger.error(
        `[${request.method}] ${request.url} - Status: ${status}`,
        exception.stack,
      );
    } else {
      this.logger.error(
        `[${request.method}] ${request.url} - Status: ${status} [Non-Error Thrown]`,
        JSON.stringify(exception),
      );
    }

    response.status(status).json(errorResponse);
  }
}
