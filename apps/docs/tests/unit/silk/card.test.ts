import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import CardFixture from '../../fixtures/CardFixture.svelte';

describe('Card -- structure', () => {
	it('renders the root with data-ui="card"', () => {
		const { container } = render(CardFixture);
		expect(container.querySelector('[data-ui="card"]')).toBeInTheDocument();
	});

	it('renders title and description', () => {
		render(CardFixture);
		expect(screen.getByText('Card title')).toBeInTheDocument();
		expect(screen.getByText('Card description copy.')).toBeInTheDocument();
	});

	it('renders content and footer children', () => {
		render(CardFixture);
		expect(screen.getByText('Body content')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
	});

	it('keeps all sections inside the card root', () => {
		const { container } = render(CardFixture);
		const card = container.querySelector('[data-ui="card"]')!;
		expect(card).toContainElement(screen.getByText('Card title'));
		expect(card).toContainElement(screen.getByText('Body content'));
		expect(card).toContainElement(screen.getByRole('button', { name: 'Action' }));
	});
});
