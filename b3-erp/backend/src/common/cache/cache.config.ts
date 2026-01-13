import { CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

/**
 * Cache configuration factory
 * Supports Redis for production and in-memory for development
 */
export const cacheConfigFactory = (
  configService: ConfigService,
): CacheModuleOptions => {
  const isProduction = configService.get('NODE_ENV') === 'production';
  const redisUrl = configService.get<string>('REDIS_URL');

  if (isProduction && redisUrl) {
    return {
      store: 'redis',
      url: redisUrl,
      ttl: 300, // 5 minutes default TTL
      max: 1000, // Maximum number of items in cache
    };
  }

  // In-memory cache for development
  return {
    store: 'memory',
    ttl: 300,
    max: 100,
  };
};

/**
 * Cache key prefixes for different domains
 */
export const CacheKeys = {
  // User-related
  USER: 'user',
  USER_PERMISSIONS: 'user:permissions',
  USER_SESSION: 'user:session',

  // Master data
  ITEMS: 'items',
  CUSTOMERS: 'customers',
  VENDORS: 'vendors',
  WAREHOUSES: 'warehouses',

  // Configuration
  CONFIG: 'config',
  SETTINGS: 'settings',

  // Workflow
  WORKFLOW_DEFINITIONS: 'workflow:definitions',
  WORKFLOW_INSTANCES: 'workflow:instances',

  // Reports
  REPORTS: 'reports',
  DASHBOARD: 'dashboard',

  // CMS
  CONTENT: 'cms:content',
  CONTENT_PUBLISHED: 'cms:content:published',
} as const;

/**
 * Cache TTL values in seconds
 */
export const CacheTTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 900, // 15 minutes
  HOUR: 3600, // 1 hour
  DAY: 86400, // 24 hours
} as const;

/**
 * Generate cache key with prefix
 */
export function generateCacheKey(prefix: string, ...parts: (string | number)[]): string {
  return [prefix, ...parts].join(':');
}
