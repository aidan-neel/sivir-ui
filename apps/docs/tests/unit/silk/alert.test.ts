import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import AlertFixture from '../../fixtures/AlertFixture.svelte';

describe('Alert -- rendering', () => {
	it('renders a role="alert" region', () => {
		render(AlertFixture);
		expect(screen.getByRole('alert')).toBeInTheDocument();
	});

	it('renders the title and description', () => {
		render(AlertFixture);
		const alert = screen.getByRole('alert');
		expect(alert).toHaveTextContent('Heads up');
		expect(alert).toHaveTextContent('Something happened that you should know about.');
	});

	it('hides the accent and icon chip from assistive tech', () => {
		render(AlertFixture);
		const hidden = screen.getByRole('alert').querySelectorAll('[aria-hidden="true"]');
		expect(hidden.length).toBeGreaterThanOrEqual(2);
	});
});

describe('Alert -- variants', () => {
	it.each(['info', 'success', 'warning', 'error'] as const)(
		'accepts variant="%s" without throwing',
		(variant) => {
			render(AlertFixture, { props: { variant } });
			expect(screen.getByRole('alert')).toBeInTheDocument();
		}
	);
});
