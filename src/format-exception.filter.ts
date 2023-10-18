import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const status = exception.getStatus();
        // 用于接收主动发错的错误信息
        const { message, code } = exception.getResponse() as any;

        res.status(status).json({
            code: code || status,
            message: 'Bad Request',
            data: message || exception.getResponse()
        });
    }
}
