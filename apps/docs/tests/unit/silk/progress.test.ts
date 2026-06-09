import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Progress from '@silk/ui/components/progress/progress.svelte';

describe('Progress -- semantics', () => {
	it('renders a progressbar with min/max/now', () => {
		render(Progress, { props: { value: 40 } });
		const bar = screen.getByRole('progressbar');
		expect(bar.getAttribute('aria-valuemin')).toBe('0');
		expect(bar.getAttribute('aria-valuemax')).toBe('100');
		expect(bar.getAttribute('aria-valuenow')).toBe('40');
	});

	it('respects a custom max', () => {
		render(Progress, { props: { value: 5, max: 20 } });
		const bar = screen.getByRole('progressbar');
		expect(bar.getAttribute('aria-valuemax')).toBe('20');
		expect(bar.getAttribute('aria-valuenow')).toBe('5');
	});
});

describe('Progress -- clamping', () => {
	it('clamps values above max', () => {
		render(Progress, { props: { value: 250 } });
		expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('100');
	});

	it('clamps negative values to 0', () => {
		render(Progress, { props: { value: -10 } });
		expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('0');
	});

	it('sets the fill width from the clamped percentage', () => {
		const { container } = render(Progress, { props: { value: 30 } });
		const fill = container.querySelector('[role="progressbar"] > div') as HTMLElement;
		expect(fill.style.width).toBe('30%');
	});
});

describe('Progress -- indeterminate', () => {
	it('omits aria-valuenow when indeterminate', () => {
		render(Progress, { props: { indeterminate: true } });
		expect(screen.getByRole('progressbar').hasAttribute('aria-valuenow')).toBe(false);
	});

	it('renders the sliding indicator', () => {
		const { container } = render(Progress, { props: { indeterminate: true } });
		expect(container.querySelector('.progress-indeterminate')).toBeInTheDocument();
	});
});
