import { createMockService } from '../utils/test-setup';

export const createMockPrismaService = (): any => {
    const mockModel = createMockPrismaModel();
    const service: any = {
        user: mockModel,
        customer: mockModel,
        item: mockModel,
        stockBalance: mockModel,
        stockEntry: mockModel,
        stockEntryLine: mockModel,
        warehouse: mockModel,
        $queryRaw: jest.fn(),
        $executeRaw: jest.fn(),
        $connect: jest.fn(),
        $disconnect: jest.fn(),
    };
    service.$transaction = jest.fn((cb) => cb(service));
    return service;
};

const createMockPrismaModel = () => ({
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    upsert: jest.fn(),
    count: jest.fn(),
});

export const createMockConfigService = (values: Record<string, any> = {}) => ({
    get: jest.fn((key: string, defaultValue?: any) => values[key] ?? defaultValue),
});
