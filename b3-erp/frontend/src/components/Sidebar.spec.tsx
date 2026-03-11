import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useProjectContextOptional } from '@/context/ProjectContext';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
}));

// Mock AuthContext
jest.mock('@/context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

// Mock ProjectContext
jest.mock('@/context/ProjectContext', () => ({
    useProjectContextOptional: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
}));

describe('Sidebar Component', () => {
    const mockOnToggle = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (usePathname as jest.Mock).mockReturnValue('/dashboard');
        (useAuth as jest.Mock).mockReturnValue({
            user: { username: 'admin', isSystemAdmin: true },
            hasPermission: () => true,
            isLoading: false,
        });
        (useProjectContextOptional as jest.Mock).mockReturnValue({
            projectContext: null,
        });
    });

    it('renders correctly when open', () => {
        render(<Sidebar isOpen={true} onToggle={mockOnToggle} />);

        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('SEARCH MODULES...')).toBeInTheDocument();
    });

    it('renders collapsed state correctly', () => {
        render(<Sidebar isOpen={false} onToggle={mockOnToggle} />);

        // In collapsed state, text might be hidden or aria-hidden
        // Based on code: {isOpen && <span>{item.name}</span>}
        expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });

    it('toggles menu items with sub-items', () => {
        render(<Sidebar isOpen={true} onToggle={mockOnToggle} />);

        // It's open by default, so sub-items should already be there
        expect(screen.getByText('Projects Dashboard')).toBeInTheDocument();

        const projectFocus = screen.getByText('Projects Focus');
        // Click to close
        fireEvent.click(projectFocus);
        expect(screen.queryByText('Projects Dashboard')).not.toBeInTheDocument();

        // Click to open again
        fireEvent.click(projectFocus);
        expect(screen.getByText('Projects Dashboard')).toBeInTheDocument();
    });


    it('filters menu items via search', () => {
        render(<Sidebar isOpen={true} onToggle={mockOnToggle} />);

        const searchInput = screen.getByPlaceholderText('SEARCH MODULES...');
        fireEvent.change(searchInput, { target: { value: 'CRM' } });

        expect(screen.getByText('CRM')).toBeInTheDocument();
        expect(screen.queryByText('Finance')).not.toBeInTheDocument();
    });

    it('calls onToggle when chevron is clicked', () => {
        render(<Sidebar isOpen={true} onToggle={mockOnToggle} />);

        // The toggle button has a ChevronRight inside
        const toggleButton = screen.getAllByRole('button')[0]; // First button is usually the toggle
        fireEvent.click(toggleButton);

        expect(mockOnToggle).toHaveBeenCalled();
    });
});
