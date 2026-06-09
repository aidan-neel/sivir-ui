import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import Badge from '@silk/ui/components/badge/badge.svelte';

function textSnippet(text: string) {
	return createRawSnippet(() => ({
		render: () => `<span>${text}</span>`
	}));
}

describe('Badge -- rendering', () => {
	it('renders a status element with data-ui="badge"', () => {
		render(Badge, { props: { children: textSnippet('New') } });
		const badge = screen.getByRole('status');
		expect(badge).toBeInTheDocument();
		expect(badge.getAttribute('data-ui')).toBe('badge');
	});

	it('renders snippet children', () => {
		render(Badge, { props: { children: textSnippet('New') } });
		expect(screen.getByRole('status')).toHaveTextContent('New');
	});

	it('exposes the variant on data-variant', () => {
		render(Badge, { props: { variant: 'destructive', children: textSnippet('Danger') } });
		expect(screen.getByRole('status').getAttribute('data-variant')).toBe('destructive');
	});

	it('merges a custom class', () => {
		render(Badge, { props: { class: 'custom-badge', children: textSnippet('New') } });
		expect(screen.getByRole('status')).toHaveClass('custom-badge');
	});
});

describe('Badge -- link mode', () => {
	it('renders an anchor when href is provided', () => {
		render(Badge, { props: { href: '/changelog', children: textSnippet('v1.0') } });
		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('href', '/changelog');
		expect(link.getAttribute('data-ui')).toBe('badge');
		expect(screen.queryByRole('status')).not.toBeInTheDocument();
	});
});

describe('Badge -- variants', () => {
	it.each([
		'primary',
		'flat',
		'outlined',
		'secondary',
		'ghost',
		'alternate',
		'destructive'
	] as const)('accepts variant="%s" without throwing', (variant) => {
		render(Badge, { props: { variant, children: textSnippet('x') } });
		expect(screen.getByRole('status')).toBeInTheDocument();
	});
});
