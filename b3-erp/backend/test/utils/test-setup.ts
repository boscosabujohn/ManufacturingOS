import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ObjectLiteral } from 'typeorm';

/**
 * Creates a mock repository with common TypeORM methods
 */
export function createMockRepository<T extends ObjectLiteral>(): jest.Mocked<Repository<T>> {
  return {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
      getMany: jest.fn(),
      getManyAndCount: jest.fn(),
      addSelect: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
    })),
    count: jest.fn(),
    exist: jest.fn(),
    query: jest.fn(),
    manager: {} as any,
    metadata: {} as any,
    target: {} as any,
  } as unknown as jest.Mocked<Repository<T>>;
}

/**
 * Creates a mock service with spy methods
 */
export function createMockService<T>(methods: (keyof T)[]): jest.Mocked<T> {
  const mock: any = {};
  methods.forEach((method) => {
    mock[method] = jest.fn();
  });
  return mock;
}

/**
 * Generates a random UUID for testing
 */
export function generateTestId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Creates a date in the past by days
 */
export function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

/**
 * Creates a date in the future by days
 */
export function daysFromNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

/**
 * Wait for a specified number of milliseconds
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a testing module with common providers
 */
export async function createTestingModule(
  providers: any[],
  imports: any[] = [],
): Promise<TestingModule> {
  return Test.createTestingModule({
    imports,
    providers,
  }).compile();
}
