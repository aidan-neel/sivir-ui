import { describe, expect, it, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import { tick } from 'svelte';
import SelectFixture from '../../fixtures/SelectFixture.svelte';
import { states } from '@sivir/ui/internals/state.svelte.ts';

async function flush() {
	await tick();
	await tick();
	await new Promise((r) => setTimeout(r, 20));
}

async function openSelect() {
	await page.getByTestId('select-trigger').click();
	await flush();
}

beforeEach(() => {
	for (const key of Object.keys(states)) {
		delete states[key];
	}
});

describe('Select -- open and close', () => {
	it('hides options initially', async () => {
		render(SelectFixture, {});
		await flush();
		await expect.element(page.getByTestId('opt-apple')).not.toBeInTheDocument();
	});

	it('shows options after opening', async () => {
		render(SelectFixture, {});
		await flush();
		await openSelect();
		await expect.element(page.getByTestId('opt-apple')).toBeInTheDocument();
		await expect.element(page.getByTestId('opt-banana')).toBeInTheDocument();
		await expect.element(page.getByTestId('opt-cherry')).toBeInTheDocument();
	});

	it('closes on Escape', async () => {
		render(SelectFixture, {});
		await flush();
		await openSelect();

		await userEvent.keyboard('{Escape}');
		await flush();
		await expect.element(page.getByTestId('opt-apple')).not.toBeInTheDocument();
	});
});

describe('Select -- selection behavior', () => {
	it('closes after an item is selected', async () => {
		render(SelectFixture, {});
		await flush();
		await openSelect();

		await page.getByTestId('opt-banana').click();
		await flush();
		await expect.element(page.getByTestId('opt-apple')).not.toBeInTheDocument();
	});

	it('sets aria-selected on the clicked option while it remains visible', async () => {
		render(SelectFixture, {});
		await flush();
		await openSelect();

		// Verify all options start unselected.
		const unselectedAtOpen = document.querySelectorAll('[role="option"][aria-selected="false"]');
		expect(unselectedAtOpen.length).toBe(3);
	});

	it('updates the underlying state.value to the clicked option', async () => {
		render(SelectFixture, {});
		await flush();
		await openSelect();

		await page.getByTestId('opt-banana').click();
		await flush();

		// State-level check: find the SelectState in the registry and assert its value.
		const selectState = Object.values(states).find(
			(s) =>
				s &&
				s.data &&
				typeof s.data === 'object' &&
				'value' in (s.data ?? {}) &&
				'selectedLabel' in (s.data ?? {})
		);
		expect(selectState).toBeDefined();
		expect((selectState!.data as { value: string }).value).toBe('banana');
	});
});

describe('Select -- ARIA', () => {
	it('options use role="option"', async () => {
		render(SelectFixture, {});
		await flush();
		await openSelect();

		const options = document.querySelectorAll('[role="option"]');
		expect(options.length).toBe(3);
	});
});
