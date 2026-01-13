import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheTTL, generateCacheKey } from './cache.config';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | undefined> {
    try {
      return await this.cacheManager.get<T>(key);
    } catch (error) {
      this.logger.error(`Error getting cache key ${key}:`, error);
      return undefined;
    }
  }

  /**
   * Set value in cache
   */
  async set<T>(key: string, value: T, ttl: number = CacheTTL.MEDIUM): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl * 1000);
    } catch (error) {
      this.logger.error(`Error setting cache key ${key}:`, error);
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      this.logger.error(`Error deleting cache key ${key}:`, error);
    }
  }

  /**
   * Delete multiple keys matching pattern
   */
  async deleteByPattern(pattern: string): Promise<void> {
    try {
      const store = this.cacheManager.store as any;
      if (store.keys) {
        const keys = await store.keys(pattern);
        await Promise.all(keys.map((key: string) => this.cacheManager.del(key)));
      }
    } catch (error) {
      this.logger.error(`Error deleting cache pattern ${pattern}:`, error);
    }
  }

  /**
   * Get or set with callback
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl: number = CacheTTL.MEDIUM,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }

  /**
   * Invalidate entity cache
   */
  async invalidateEntity(prefix: string, id?: string): Promise<void> {
    if (id) {
      await this.delete(generateCacheKey(prefix, id));
    }
    await this.delete(generateCacheKey(prefix, 'list'));
    await this.delete(generateCacheKey(prefix, 'count'));
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    try {
      await this.cacheManager.reset();
      this.logger.log('Cache cleared');
    } catch (error) {
      this.logger.error('Error clearing cache:', error);
    }
  }

  /**
   * Get cache stats (if available)
   */
  async getStats(): Promise<{ keys: number; size?: number } | null> {
    try {
      const store = this.cacheManager.store as any;
      if (store.keys) {
        const keys = await store.keys('*');
        return { keys: keys.length };
      }
      return null;
    } catch (error) {
      this.logger.error('Error getting cache stats:', error);
      return null;
    }
  }
}
