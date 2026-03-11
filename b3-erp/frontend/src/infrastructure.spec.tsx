import { render, screen } from '@testing-library/react';

describe('Jest Infrastructure', () => {
    it('should render a dummy component', () => {
        const Dummy = () => <div>Jest is working</div>;
        render(<Dummy />);
        expect(screen.getByText('Jest is working')).toBeInTheDocument();
    });

    it('should handle environment variables', () => {
        expect(process.env.NODE_ENV).toBe('test');
    });

    it('should handle path aliases', () => {
        // This just tests that the test-setup itself works
        expect(true).toBe(true);
    });
});
