import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { DataTable, Column } from './DataTable';

interface TestData {
    id: number;
    name: string;
    age: number;
}

const testData: TestData[] = [
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 },
    { id: 3, name: 'Charlie', age: 35 },
];

const columns: Column<TestData>[] = [
    { id: 'name', header: 'Name', accessor: 'name', sortable: true },
    { id: 'age', header: 'Age', accessor: 'age', sortable: true },
];

describe('DataTable Component', () => {
    it('renders correctly with data', () => {
        render(<DataTable data={testData} columns={columns} />);

        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getByText('Charlie')).toBeInTheDocument();
        expect(screen.getByText('30')).toBeInTheDocument();
    });

    it('renders loading state', () => {
        render(<DataTable data={[]} columns={columns} loading={true} />);
        // TableSkeleton should be rendered, which usually contains skeleton rows
        // We can check if the table is NOT in the document or specific skeleton classes
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('renders empty state when no data', () => {
        render(<DataTable data={[]} columns={columns} emptyMessage="No results" />);
        expect(screen.getByText('No results')).toBeInTheDocument();
    });

    it('handles sorting', () => {
        render(
            <DataTable
                data={testData}
                columns={columns}
                sorting={{ enabled: true }}
            />
        );

        const nameHeader = screen.getByRole('button', { name: /Name/i });

        // Initial order: Alice, Bob, Charlie (by default or as provided)
        let rows = screen.getAllByRole('row').slice(1); // skip header
        expect(within(rows[0]).getByText('Alice')).toBeInTheDocument();

        // Sort Ascending (Alice, Bob, Charlie)
        fireEvent.click(nameHeader);
        rows = screen.getAllByRole('row').slice(1);
        expect(within(rows[0]).getByText('Alice')).toBeInTheDocument();

        // Sort Descending (Charlie, Bob, Alice)
        fireEvent.click(nameHeader);
        rows = screen.getAllByRole('row').slice(1);
        expect(within(rows[0]).getByText('Charlie')).toBeInTheDocument();
        expect(within(rows[2]).getByText('Alice')).toBeInTheDocument();
    });

    it('handles pagination', () => {
        const manyData = Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            name: `User ${i + 1}`,
            age: 20 + i
        }));

        render(
            <DataTable
                data={manyData}
                columns={columns}
                pagination={{ enabled: true, pageSize: 5 }}
            />
        );

        // Initial page (1-5)
        expect(screen.getByText('User 1')).toBeInTheDocument();
        expect(screen.queryByText('User 6')).not.toBeInTheDocument();

        // Next page
        const nextButton = screen.getByRole('button', { name: /Next/i });
        fireEvent.click(nextButton);

        expect(screen.queryByText('User 1')).not.toBeInTheDocument();
        expect(screen.getByText('User 6')).toBeInTheDocument();
    });

    it('handles selection', () => {
        const onSelectionChange = jest.fn();
        render(
            <DataTable
                data={testData}
                columns={columns}
                selectable={true}
                onSelectionChange={onSelectionChange}
            />
        );

        const checkboxes = screen.getAllByRole('checkbox');
        const headerCheckbox = checkboxes[0];
        const firstRowCheckbox = checkboxes[1];

        // Select first row
        fireEvent.click(firstRowCheckbox);
        expect(onSelectionChange).toHaveBeenCalledWith([testData[0]]);

        // Select all
        fireEvent.click(headerCheckbox);
        expect(onSelectionChange).toHaveBeenLastCalledWith(testData);

        // Deselect all
        fireEvent.click(headerCheckbox);
        expect(onSelectionChange).toHaveBeenLastCalledWith([]);
    });

    it('handles row click', () => {
        const onRowClick = jest.fn();
        render(<DataTable data={testData} columns={columns} onRowClick={onRowClick} />);

        const firstRow = screen.getByText('Alice').closest('tr')!;
        fireEvent.click(firstRow);

        expect(onRowClick).toHaveBeenCalledWith(testData[0], 0);
    });
});
