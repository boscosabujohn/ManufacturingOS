import { renderHook, act } from '@testing-library/react';
import { useOfflineStorage } from './useOfflineStorage';

// Mock IndexedDB
const mockStore = {
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(),
    clear: jest.fn(),
    add: jest.fn(),
};

const mockTransaction = {
    objectStore: jest.fn().mockReturnValue(mockStore),
    oncomplete: null,
    onerror: null,
};

const mockDb = {
    transaction: jest.fn().mockReturnValue(mockTransaction),
    close: jest.fn(),
    objectStoreNames: {
        contains: jest.fn().mockReturnValue(true),
    },
};

const mockRequest = {
    onsuccess: null,
    onerror: null,
    result: null,
    error: null,
};

const mockOpenRequest = {
    onsuccess: null,
    onerror: null,
    onupgradeneeded: null,
    result: mockDb,
};

// Setup global indexedDB mock
// @ts-ignore
global.indexedDB = {
    open: jest.fn().mockReturnValue(mockOpenRequest),
};

describe('useOfflineStorage Hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('initializes correctly', async () => {
        const { result } = renderHook(() => useOfflineStorage());

        // Trigger onsuccess manually
        await act(async () => {
            if (mockOpenRequest.onsuccess) {
                (mockOpenRequest as any).onsuccess();
            }
        });

        expect(result.current.isReady).toBe(true);
        expect(global.indexedDB.open).toHaveBeenCalled();
    });

    it('gets item from store', async () => {
        const { result } = renderHook(() => useOfflineStorage('cachedData'));

        await act(async () => {
            if (mockOpenRequest.onsuccess) (mockOpenRequest as any).onsuccess();
        });

        const mockData = { key: 'test', data: { foo: 'bar' }, timestamp: Date.now() };
        mockStore.get.mockReturnValue(mockRequest);

        const promise = result.current.getItem('test');

        // Simulate async success
        await act(async () => {
            mockRequest.result = mockData as any;
            if (mockRequest.onsuccess) (mockRequest as any).onsuccess();
        });

        const data = await promise;
        expect(data).toEqual({ foo: 'bar' });
        expect(mockDb.transaction).toHaveBeenCalledWith('cachedData', 'readonly');
    });

    it('sets item in store', async () => {
        const { result } = renderHook(() => useOfflineStorage('cachedData'));

        await act(async () => {
            if (mockOpenRequest.onsuccess) (mockOpenRequest as any).onsuccess();
        });

        mockStore.put.mockReturnValue(mockRequest);

        const promise = result.current.setItem('test', { foo: 'bar' });

        await act(async () => {
            if (mockRequest.onsuccess) (mockRequest as any).onsuccess();
        });

        await promise;
        expect(mockStore.put).toHaveBeenCalledWith(expect.objectContaining({
            key: 'test',
            data: { foo: 'bar' },
        }));
    });

    it('queues an action', async () => {
        const { result } = renderHook(() => useOfflineStorage());

        await act(async () => {
            if (mockOpenRequest.onsuccess) (mockOpenRequest as any).onsuccess();
        });

        mockStore.add.mockReturnValue(mockRequest);

        const action = { url: '/api/test', method: 'POST', body: {}, headers: {} };
        const promise = result.current.queueAction(action);

        await act(async () => {
            if (mockRequest.onsuccess) (mockRequest as any).onsuccess();
        });

        await promise;
        expect(mockDb.transaction).toHaveBeenCalledWith('pendingActions', 'readwrite');
        expect(mockStore.add).toHaveBeenCalled();
    });

    it('tracks online status', () => {
        const { result } = renderHook(() => useOfflineStorage());

        expect(result.current.isOnline).toBe(true);

        act(() => {
            window.dispatchEvent(new Event('offline'));
        });
        expect(result.current.isOnline).toBe(false);

        act(() => {
            window.dispatchEvent(new Event('online'));
        });
        expect(result.current.isOnline).toBe(true);
    });
});
