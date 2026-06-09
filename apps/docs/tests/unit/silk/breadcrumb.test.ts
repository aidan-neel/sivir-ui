import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import BreadcrumbFixture from '../../fixtures/BreadcrumbFixture.svelte';

describe('Breadcrumb -- rendering', () => {
	it('renders items as links with their hrefs', () => {
		render(BreadcrumbFixture);
		expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
		expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs');
	});

	it('renders the default chevron separator', () => {
		const { container } = render(BreadcrumbFixture);
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	it('renders a custom separator from children', () => {
		render(BreadcrumbFixture, { props: { customSeparator: true } });
		expect(screen.getByTestId('custom-separator')).toBeInTheDocument();
	});
});
