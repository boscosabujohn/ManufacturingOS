import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Correlation ID Middleware
 * Ensures every request has a unique X-Correlation-ID for tracing
 */
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const correlationIdHeader = 'x-correlation-id';

        // Use existing correlation ID from request header or generate a new one
        const correlationId = req.headers[correlationIdHeader] || uuidv4();

        // Set for request so it's available in controllers/services
        req.headers[correlationIdHeader] = correlationId;

        // Set for response so client can use it for support/debugging
        res.setHeader(correlationIdHeader, correlationId);

        next();
    }
}
