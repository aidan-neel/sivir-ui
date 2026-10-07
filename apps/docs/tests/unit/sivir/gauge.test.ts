import Gauge from '@sivir-ui/svelte/components/gauge/gauge.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('Gauge', () => {
    it('exposes a labeled meter with a clamped value', () => {
        const { getByRole } = render(Gauge, {
            props: {
                value: 120,
                max: 100,
                label: 'Monthly API usage'
            }
        });

        const gauge = getByRole('meter', {
            name: 'Monthly API usage'
        });

        expect(gauge).toHaveAttribute('aria-valuemin', '0');
        expect(gauge).toHaveAttribute('aria-valuemax', '100');
        expect(gauge).toHaveAttribute('aria-valuenow', '100');
        expect(gauge).toHaveTextContent('100');
    });

    it('renders the default parts with the requested tone and size', () => {
        const { container } = render(Gauge, {
            props: {
                value: 72,
                tone: 'warning',
                size: 'lg'
            }
        });

        const gauge = container.querySelector('[data-ui="gauge"]');

        expect(gauge).toHaveAttribute('data-size', 'lg');
        expect(container.querySelector('[data-ui="gauge-track"]')).toBeInTheDocument();
        expect(container.querySelector('[data-ui="gauge-indicator"]')).toHaveClass('text-warning');
        expect(container.querySelector('[data-ui="gauge-value"]')).toHaveTextContent('72');
    });

    it('shows a whole percent that only reaches the bounds at the bounds', () => {
        const { container } = render(Gauge, {
            props: {
                value: 99.6
            }
        });

        expect(container.querySelector('[data-ui="gauge-value"]')).toHaveTextContent('99');
    });

    it('leaves the value out at the small size', () => {
        const { container } = render(Gauge, {
            props: {
                value: 40,
                size: 'sm',
                label: 'Context used'
            }
        });

        expect(container.querySelector('[data-ui="gauge-indicator"]')).toBeInTheDocument();
        expect(container.querySelector('[data-ui="gauge-value"]')).not.toBeInTheDocument();
    });
});
