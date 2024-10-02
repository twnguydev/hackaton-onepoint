import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status: number = exception instanceof HttpException ? exception.getStatus() : 500;
    
    const message: string | object = exception instanceof HttpException 
      ? exception.getResponse() 
      : { status: 500, message: (exception as Error).message || 'Internal server error' };

    response.status(status).json({
      status,
      message: typeof message === 'string' ? message : (message as any).message,
    });
  }
}