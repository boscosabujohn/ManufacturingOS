import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { KPICard } from './KPICard';
import { Activity } from 'lucide-react';

describe('KPICard Component', () => {
    it('renders title and value correctly', () => {
        render(<KPICard title="Total Orders" value="1,234" />);
        expect(screen.getByText('Total Orders')).toBeInTheDocument();
        expect(screen.getByText('1,234')).toBeInTheDocument();
    });

    it('handles numeric values with toLocaleString', () => {
        render(<KPICard title="Revenue" value={50000} />);
        expect(screen.getByText('50,000')).toBeInTheDocument();
    });

    it('renders trend information correctly', () => {
        render(
            <KPICard
                title="Growth"
                value="15%"
                trend={{ value: 12, isPositive: true, label: 'vs last month' }}
            />
        );
        expect(screen.getByText('↑ 12%')).toBeInTheDocument();
        expect(screen.getByText('vs last month')).toBeInTheDocument();
        expect(screen.getByText('↑ 12%')).toHaveClass('text-green-600');
    });

    it('renders negative trend correctly', () => {
        render(
            <KPICard
                title="Churn"
                value="2%"
                trend={{ value: 5, isPositive: false }}
            />
        );
        expect(screen.getByText('↓ 5%')).toBeInTheDocument();
        expect(screen.getByText('↓ 5%')).toHaveClass('text-red-600');
    });

    it('shows loading state', () => {
        const { container } = render(<KPICard title="Loading" value="0" loading={true} />);
        expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
        expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('renders icon with correct color variant', () => {
        const { container } = render(<KPICard title="Icon" value="10" icon={Activity} color="green" />);
        const iconWrapper = container.querySelector('.bg-green-50');
        expect(iconWrapper).toBeInTheDocument();
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('handles click events and has correct accessibility attributes', () => {
        const handleClick = jest.fn();
        render(<KPICard title="Clickable" value="10" onClick={handleClick} />);

        const card = screen.getByRole('button');
        fireEvent.click(card);
        expect(handleClick).toHaveBeenCalledTimes(1);
        expect(card).toHaveClass('cursor-pointer');
    });

    it('renders children', () => {
        render(
            <KPICard title="With Children" value="10">
                <div data-testid="child-element">Extra Info</div>
            </KPICard>
        );
        expect(screen.getByTestId('child-element')).toBeInTheDocument();
    });
});
