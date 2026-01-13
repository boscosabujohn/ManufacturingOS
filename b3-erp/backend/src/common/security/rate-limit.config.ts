import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModuleOptions } from '@nestjs/throttler';

/**
 * Rate Limiting Configuration
 * Protects against brute force and DDoS attacks
 */
export const rateLimitConfig: ThrottlerModuleOptions = {
  throttlers: [
    {
      name: 'short',
      ttl: 1000, // 1 second
      limit: 10, // 10 requests per second
    },
    {
      name: 'medium',
      ttl: 10000, // 10 seconds
      limit: 50, // 50 requests per 10 seconds
    },
    {
      name: 'long',
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute
    },
  ],
};

/**
 * Custom Throttler Guard
 * Extends default guard with custom logic
 */
@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  /**
   * Get client IP address for rate limiting
   */
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Try to get real IP from proxy headers
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
      const ips = forwardedFor.split(',');
      return ips[0].trim();
    }

    const realIp = req.headers['x-real-ip'];
    if (realIp) {
      return realIp;
    }

    // Fall back to connection remote address
    return req.ip || req.connection?.remoteAddress || 'unknown';
  }

  /**
   * Skip rate limiting for certain routes
   */
  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const path = request.path;

    // Skip rate limiting for health checks
    const skipPaths = ['/health', '/api/health', '/api/v1/health'];
    return skipPaths.some((p) => path.startsWith(p));
  }
}

/**
 * Rate limit configuration for specific endpoints
 */
export const endpointRateLimits = {
  // Auth endpoints - stricter limits
  auth: {
    login: { ttl: 60000, limit: 5 }, // 5 login attempts per minute
    register: { ttl: 3600000, limit: 10 }, // 10 registrations per hour
    forgotPassword: { ttl: 3600000, limit: 3 }, // 3 password resets per hour
  },
  // API endpoints - standard limits
  api: {
    read: { ttl: 1000, limit: 30 }, // 30 reads per second
    write: { ttl: 1000, limit: 10 }, // 10 writes per second
    bulk: { ttl: 60000, limit: 5 }, // 5 bulk operations per minute
  },
  // File uploads - very strict
  upload: {
    single: { ttl: 60000, limit: 10 }, // 10 uploads per minute
    bulk: { ttl: 3600000, limit: 20 }, // 20 bulk uploads per hour
  },
};
