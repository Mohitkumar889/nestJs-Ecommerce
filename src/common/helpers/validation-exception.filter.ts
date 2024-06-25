import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response } from 'express';

interface ErrorResponse {
    code: number;
    message: string;
    data: any;
}

@Catch()
export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const validationErrors = exception.response?.message;

        if (Array.isArray(validationErrors) && validationErrors.length > 0) {
            const errorResponse: ErrorResponse = {
                code: status,
                message: validationErrors[0],
                data: {},
            };
            response.status(status).json(errorResponse);
        } else {
            const errorResponse: ErrorResponse = {
                code: status,
                message: exception.message || 'Internal server error',
                data: {},
            };
            response.status(status).json(errorResponse);
        }
    }
}
