import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import CollapsibleFixture from '../../fixtures/CollapsibleFixture.svelte';
import { states } from '@sivir/ui/internals/state.svelte.ts';

beforeEach(() => {
	for (const key of Object.keys(states)) {
		delete states[key];
	}
});

describe('Collapsible -- rendering', () => {
	it('renders the trigger always', () => {
		render(CollapsibleFixture, { props: { open: false } });
		expect(screen.getByTestId('collapsible-trigger')).toBeInTheDocument();
	});

	it('hides content when open=false', () => {
		render(CollapsibleFixture, { props: { open: false } });
		expect(screen.queryByTestId('collapsible-content')).not.toBeInTheDocument();
	});

	it('shows content when open=true initially', () => {
		render(CollapsibleFixture, { props: { open: true } });
		expect(screen.getByTestId('collapsible-content')).toBeInTheDocument();
	});
});

describe('Collapsible -- toggle interaction', () => {
	it('opens on trigger click', async () => {
		render(CollapsibleFixture, { props: { open: false } });
		expect(screen.queryByTestId('collapsible-content')).not.toBeInTheDocument();

		const user = userEvent.setup();
		await user.click(screen.getByTestId('collapsible-trigger'));

		await waitFor(() => {
			expect(screen.getByTestId('collapsible-content')).toBeInTheDocument();
		});
	});

	it('clicking trigger updates the underlying state', async () => {
		render(CollapsibleFixture, { props: { open: false } });

		const user = userEvent.setup();
		await user.click(screen.getByTestId('collapsible-trigger'));

		// State-level verification: the collapsible's UIState.data.open is true.
		const collapsibleState = Object.values(states).find(
			(s) => s && s.data && typeof s.data === 'object' && 'open' in (s.data ?? {})
		);
		expect(collapsibleState).toBeDefined();
		expect((collapsibleState!.data as { open: boolean }).open).toBe(true);
	});
});

describe('Collapsible -- disabled state', () => {
	it('disables the trigger when disabled=true', () => {
		render(CollapsibleFixture, { props: { open: false, disabled: true } });
		const button = screen.getByTestId('collapsible-trigger').closest('button')!;
		expect(button).toBeDisabled();
	});
});
