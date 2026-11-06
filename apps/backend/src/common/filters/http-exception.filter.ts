import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = error instanceof HttpException ? error.getStatus() : 500;
    const body =
      error instanceof HttpException
        ? error.getResponse()
        : { message: 'Внутренняя ошибка сервера' };
    const value = typeof body === 'string' ? { message: body } : (body as Record<string, unknown>);
    response.status(status).json({
      statusCode: status,
      code: value.code ?? (status === 500 ? 'INTERNAL_ERROR' : undefined),
      message: Array.isArray(value.message) ? value.message.join(', ') : value.message,
    });
  }
}
