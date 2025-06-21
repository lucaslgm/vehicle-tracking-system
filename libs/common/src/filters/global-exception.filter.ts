// O filtro principal que captura todas as exceções.

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IErrorResponse } from './error-response.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // const status =
    //   exception instanceof HttpException
    //     ? exception.getStatus()
    //     : HttpStatus.INTERNAL_SERVER_ERROR;

    // const message =
    //   exception instanceof HttpException
    //     ? exception.getResponse()
    //     : 'An unexpected error occurred';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'An unexpected error occurred';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } else if (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      (exception as { code: string }).code === 'P2002'
    ) {
      status = HttpStatus.CONFLICT;
      const target = ((exception as any).meta?.target as string[])?.join(', ');
      message = `A record with this ${target || 'value'} already exists.`;
    }

    const errorResponse: IErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: typeof message === 'string' ? { error: message } : message,
    };

    // Log do erro no console (em um cenário real, você usaria um logger mais robusto)
    console.error(
      `[GlobalExceptionFilter] Status: ${status} | Path: ${request.url}`,
      exception,
    );

    response.status(status).json(errorResponse);
  }
}
