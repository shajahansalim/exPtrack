import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Summary from '../Summary';

describe('Summary Component', () => {
    it('renders correctly with given total', () => {
        const testTotal = 1500;
        render(<Summary total={testTotal} />);

        // Check if "Total Spent" text is rendered
        expect(screen.getByText('Total Spent')).toBeInTheDocument();

        // Check if the amount is rendered with rupee symbol
        expect(screen.getByText(`₹ ${testTotal}`)).toBeInTheDocument();
    });

    it('renders correctly with 0 total', () => {
        render(<Summary total={0} />);
        expect(screen.getByText('₹ 0')).toBeInTheDocument();
    });
});
