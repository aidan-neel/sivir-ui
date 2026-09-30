import Slider from '@sivir-ui/svelte/components/slider/slider.svelte';
import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import { queryRequired } from '../../test-utils';

describe('Slider -- rendering', () => {
    it('renders a range input inside a labeled field', () => {
        const { container } = render(Slider, { props: { value: 50 } });

        expect(container.querySelector('[data-ui="slider"]')?.tagName).toBe('LABEL');
        expect(container.querySelector('input[type="range"]')).toBeInTheDocument();
    });

    it('shows the label and value inside the field', () => {
        const { container } = render(Slider, {
            props: {
                value: 42,
                label: 'Volume'
            }
        });

        expect(container.querySelector('[data-ui="slider-label"]')).toHaveTextContent('Volume');
        expect(container.querySelector('[data-ui="slider-value"]')).toHaveTextContent('42');
        expect(container.querySelector('input[type="range"]')?.getAttribute('aria-label')).toBe(
            'Volume'
        );
    });

    it('formats the visible value and the spoken value', () => {
        const { container } = render(Slider, {
            props: {
                value: 72,
                format: (value: number) => `${value}%`
            }
        });

        expect(container.querySelector('[data-ui="slider-value"]')).toHaveTextContent('72%');
        expect(container.querySelector('input[type="range"]')?.getAttribute('aria-valuetext')).toBe(
            '72%'
        );
    });
});

describe('Slider -- bounds and step', () => {
    it('reflects min, max, step, and name on the underlying input', () => {
        const { container } = render(Slider, {
            props: {
                value: 5,
                min: 0,
                max: 10,
                step: 5,
                name: 'volume'
            }
        });
        const range = queryRequired<HTMLInputElement>(container, 'input[type="range"]');

        expect(range.min).toBe('0');
        expect(range.max).toBe('10');
        expect(range.step).toBe('5');
        expect(range.name).toBe('volume');
    });
});

describe('Slider -- callbacks', () => {
    it('fires onValueChange with the numeric new value on input', async () => {
        const onValueChange = vi.fn();
        const { container } = render(Slider, {
            props: {
                value: 0,
                onValueChange
            }
        });
        const range = queryRequired<HTMLInputElement>(container, 'input[type="range"]');

        range.value = '37';
        await fireEvent.input(range);

        expect(onValueChange).toHaveBeenCalledWith(37);
    });

    it('fires onValueCommit when the input commits a change', async () => {
        const onValueCommit = vi.fn();
        const { container } = render(Slider, {
            props: {
                value: 0,
                onValueCommit
            }
        });
        const range = queryRequired<HTMLInputElement>(container, 'input[type="range"]');

        range.value = '20';
        await fireEvent.input(range);
        await fireEvent.change(range);

        expect(onValueCommit).toHaveBeenCalledWith(20);
    });
});

describe('Slider -- disabled state', () => {
    it('disables the underlying range input and marks the field', () => {
        const { container } = render(Slider, {
            props: {
                value: 50,
                disabled: true
            }
        });

        expect(container.querySelector('input[type="range"]')).toBeDisabled();
        expect(container.querySelector('[data-ui="slider"]')).toHaveAttribute('data-disabled');
    });
});
