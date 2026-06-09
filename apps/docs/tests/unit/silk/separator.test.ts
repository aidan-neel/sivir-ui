import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Separator from '@silk/ui/components/separator/separator.svelte';

describe('Separator -- decorative (default)', () => {
	it('renders with role="none" and no aria-orientation', () => {
		const { container } = render(Separator);
		const el = container.querySelector('[data-ui="separator"]')!;
		expect(el).toBeInTheDocument();
		expect(el.getAttribute('role')).toBe('none');
		expect(el.hasAttribute('aria-orientation')).toBe(false);
	});

	it('defaults to horizontal orientation', () => {
		const { container } = render(Separator);
		expect(container.querySelector('[data-ui="separator"]')!.getAttribute('data-orientation')).toBe(
			'horizontal'
		);
	});
});

describe('Separator -- semantic', () => {
	it('renders role="separator" with aria-orientation when decorative=false', () => {
		render(Separator, { props: { decorative: false } });
		const el = screen.getByRole('separator');
		expect(el.getAttribute('aria-orientation')).toBe('horizontal');
	});

	it('reflects vertical orientation', () => {
		render(Separator, { props: { decorative: false, orientation: 'vertical' } });
		const el = screen.getByRole('separator');
		expect(el.getAttribute('aria-orientation')).toBe('vertical');
		expect(el.getAttribute('data-orientation')).toBe('vertical');
	});
});

describe('Separator -- styling', () => {
	it('merges a custom class', () => {
		const { container } = render(Separator, { props: { class: 'my-separator' } });
		expect(container.querySelector('[data-ui="separator"]')).toHaveClass('my-separator');
	});
});
