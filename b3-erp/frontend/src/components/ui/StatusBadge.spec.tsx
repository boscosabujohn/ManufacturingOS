import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge Component', () => {
    it('renders with correct label for a given status', () => {
        render(<StatusBadge status="implemented" />);
        expect(screen.getByText('Live')).toBeInTheDocument();
    });

    it('renders with custom label if provided', () => {
        render(<StatusBadge status="active" label="Currently Active" />);
        expect(screen.getByText('Currently Active')).toBeInTheDocument();
    });

    it('applies correct classes for different statuses', () => {
        const { rerender } = render(<StatusBadge status="implemented" />);
        expect(screen.getByText('Live')).toHaveClass('bg-green-100');

        rerender(<StatusBadge status="rejected" />);
        expect(screen.getByText('Rejected')).toHaveClass('bg-red-100');
    });

    it('renders without icon when showIcon is false', () => {
        const { container } = render(<StatusBadge status="implemented" showIcon={false} />);
        // StatusBadge renders icon as an svg inside the span
        expect(container.querySelector('svg')).not.toBeInTheDocument();
    });

    it('renders with icon by default', () => {
        const { container } = render(<StatusBadge status="implemented" />);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('applies size classes correctly', () => {
        const { rerender } = render(<StatusBadge status="implemented" size="sm" />);
        expect(screen.getByText('Live')).toHaveClass('text-xs');

        rerender(<StatusBadge status="implemented" size="md" />);
        expect(screen.getByText('Live')).toHaveClass('text-sm');
    });
});
