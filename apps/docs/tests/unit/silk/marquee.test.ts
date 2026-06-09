import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import Marquee from '@silk/ui/components/marquee/marquee.svelte';

const children = createRawSnippet(() => ({
	render: () => '<span class="marquee-item">Silk</span>'
}));

function root(container: HTMLElement) {
	return container.querySelector('[data-ui="marquee"]') as HTMLElement;
}

describe('Marquee -- rendering', () => {
	it('renders the marquee wrapper', () => {
		const { container } = render(Marquee, { props: { children } });
		expect(root(container)).toBeInTheDocument();
	});

	it('duplicates children into repeat tracks, hiding the copies from a11y', () => {
		const { container } = render(Marquee, { props: { children } });
		const tracks = container.querySelectorAll('.silk-marquee-track');
		expect(tracks).toHaveLength(2);
		expect(tracks[0].hasAttribute('aria-hidden')).toBe(false);
		expect(tracks[1].getAttribute('aria-hidden')).toBe('true');
	});

	it('honors a custom repeat count', () => {
		const { container } = render(Marquee, { props: { children, repeat: 4 } });
		expect(container.querySelectorAll('.silk-marquee-track')).toHaveLength(4);
	});
});

describe('Marquee -- direction and axis', () => {
	it('defaults to horizontal left', () => {
		const { container } = render(Marquee, { props: { children } });
		expect(root(container).getAttribute('data-axis')).toBe('horizontal');
		expect(root(container).getAttribute('data-direction')).toBe('left');
	});

	it('reverse flips the direction', () => {
		const { container } = render(Marquee, { props: { children, reverse: true } });
		expect(root(container).getAttribute('data-direction')).toBe('right');
	});

	it('vertical switches the axis', () => {
		const { container } = render(Marquee, { props: { children, vertical: true } });
		expect(root(container).getAttribute('data-axis')).toBe('vertical');
	});
});

describe('Marquee -- styling hooks', () => {
	it('exposes duration and gap as CSS custom properties', () => {
		const { container } = render(Marquee, { props: { children, duration: '22s', gap: '1rem' } });
		const el = root(container);
		expect(el.style.getPropertyValue('--silk-marquee-duration')).toBe('22s');
		expect(el.style.getPropertyValue('--silk-marquee-gap')).toBe('1rem');
	});

	it('adds the pause-on-hover class when enabled', () => {
		const { container } = render(Marquee, { props: { children, pauseOnHover: true } });
		expect(root(container)).toHaveClass('silk-marquee-hover');
	});
});
