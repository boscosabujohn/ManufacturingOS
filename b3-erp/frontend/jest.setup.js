import '@testing-library/jest-dom';
import 'jest-canvas-mock';

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
}));

// Mock ScrollTo
global.scrollTo = jest.fn();

// Mock Radix UI components that might cause issues in Jest
jest.mock('@radix-ui/react-toast', () => ({
    Provider: ({ children }) => children,
    Viewport: () => null,
    Root: () => null,
    Title: () => null,
    Description: () => null,
    Action: () => null,
    Close: () => null,
}));
