import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Global HTTP Exception Filter
 * Standardizes error responses across the entire application
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger('GlobalExceptionFilter');

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // Extract correlation ID from headers or generate a new one
        const correlationId = request.headers['x-correlation-id'] || uuidv4();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: any = 'Internal server error';
        let errorResponse: any = {};

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const responseBody = exception.getResponse();

            if (typeof responseBody === 'object' && responseBody !== null) {
                errorResponse = responseBody;
                message = (responseBody as any).message || message;
            } else {
                message = responseBody;
            }
        } else if (exception instanceof Error) {
            message = exception.message;
            this.logger.error(
                `[${correlationId}] Unhandled exception: ${exception.message}`,
                exception.stack,
            );
        } else {
            this.logger.error(`[${correlationId}] Unknown exception: ${JSON.stringify(exception)}`);
        }

        const responseContent = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message,
            correlationId,
            ...(process.env.NODE_ENV !== 'production' ? { stack: (exception as Error)?.stack } : {}),
            // Include any additional fields from the original exception response
            ...errorResponse,
        };

        // Ensure we don't accidentally override essential fields
        responseContent.statusCode = status;
        responseContent.correlationId = correlationId;

        response.status(status).json(responseContent);
    }
}
