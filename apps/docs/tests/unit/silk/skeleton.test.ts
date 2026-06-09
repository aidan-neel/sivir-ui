import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import Skeleton from '@silk/ui/components/skeleton/skeleton.svelte';

describe('Skeleton -- rendering', () => {
	it('renders a div with the loading animation class', () => {
		const { container } = render(Skeleton);
		const el = container.firstElementChild as HTMLElement;
		expect(el).toBeInTheDocument();
		expect(el.className).toContain('animate-');
	});

	it('applies width and height with the default px unit', () => {
		const { container } = render(Skeleton, { props: { w: 120, h: 16 } });
		const el = container.firstElementChild as HTMLElement;
		expect(el.style.width).toBe('120px');
		expect(el.style.height).toBe('16px');
	});

	it('applies a custom unit', () => {
		const { container } = render(Skeleton, { props: { w: 80, h: 2, unit: 'rem' } });
		const el = container.firstElementChild as HTMLElement;
		expect(el.style.width).toBe('80rem');
		expect(el.style.height).toBe('2rem');
	});

	it('merges a custom class', () => {
		const { container } = render(Skeleton, { props: { class: 'h-3 w-full' } });
		expect(container.firstElementChild).toHaveClass('h-3', 'w-full');
	});

	it('renders snippet children', () => {
		const children = createRawSnippet(() => ({
			render: () => '<span data-testid="inner">hidden content</span>'
		}));
		const { getByTestId } = render(Skeleton, { props: { children } });
		expect(getByTestId('inner')).toBeInTheDocument();
	});
});
