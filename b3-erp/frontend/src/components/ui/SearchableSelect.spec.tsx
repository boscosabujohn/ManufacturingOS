import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchableSelect } from './SearchableSelect';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('SearchableSelect Component', () => {
    const options = [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
        { label: 'Apple', value: 'apple' },
    ];
    const mockOnChange = jest.fn();
    const mockPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    });

    it('renders placeholder correctly', () => {
        render(<SearchableSelect options={options} value="" onChange={mockOnChange} placeholder="Select item" />);
        expect(screen.getByText('Select item')).toBeInTheDocument();
    });

    it('renders selected option label', () => {
        render(<SearchableSelect options={options} value="2" onChange={mockOnChange} />);
        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('opens dropdown when clicked', async () => {
        render(<SearchableSelect options={options} value="" onChange={mockOnChange} />);
        fireEvent.click(screen.getByText('Select an option...'));

        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('filters options based on search input', async () => {
        render(<SearchableSelect options={options} value="" onChange={mockOnChange} />);
        fireEvent.click(screen.getByText('Select an option...'));

        const searchInput = screen.getByPlaceholderText('Search...');
        fireEvent.change(searchInput, { target: { value: 'Apple' } });

        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });

    it('calls onChange and closes when option is selected', async () => {
        render(<SearchableSelect options={options} value="" onChange={mockOnChange} />);
        fireEvent.click(screen.getByText('Select an option...'));

        fireEvent.click(screen.getByText('Option 1'));

        expect(mockOnChange).toHaveBeenCalledWith('1');
        expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
    });

    it('handles "Add New" button click', () => {
        render(
            <SearchableSelect
                options={options}
                value=""
                onChange={mockOnChange}
                addNewLabel="Add Fruit"
                addNewHref="/fruits/new"
            />
        );
        fireEvent.click(screen.getByText('Select an option...'));

        const addNew = screen.getByText('Add Fruit');
        fireEvent.click(addNew);

        expect(mockPush).toHaveBeenCalledWith('/fruits/new');
    });

    it('shows "No results found" when filter has no matches', () => {
        render(<SearchableSelect options={options} value="" onChange={mockOnChange} />);
        fireEvent.click(screen.getByText('Select an option...'));

        const searchInput = screen.getByPlaceholderText('Search...');
        fireEvent.change(searchInput, { target: { value: 'notfound' } });

        expect(screen.getByText('No results found')).toBeInTheDocument();
    });
});
