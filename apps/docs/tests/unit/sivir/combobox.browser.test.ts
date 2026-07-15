import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import { tick } from 'svelte';
import ComboboxFixture from '../../fixtures/ComboboxFixture.svelte';
import { states } from '@sivir/ui/internals/state.svelte.ts';

async function flush() {
	await tick();
	await tick();
	await new Promise((r) => setTimeout(r, 20));
}

async function openCombobox() {
	await page.getByTestId('combobox-trigger').click();
	await flush();
}

beforeEach(() => {
	for (const key of Object.keys(states)) {
		delete states[key];
	}
});

describe('Combobox -- open and close', () => {
	it('hides items initially', async () => {
		render(ComboboxFixture, {});
		await flush();
		await expect.element(page.getByText('Apple')).not.toBeInTheDocument();
	});

	it('shows items + search input after opening', async () => {
		render(ComboboxFixture, {});
		await flush();
		await openCombobox();

		await expect.element(page.getByText('Apple')).toBeInTheDocument();
		await expect.element(page.getByText('Banana')).toBeInTheDocument();
		await expect.element(page.getByText('Cherry')).toBeInTheDocument();
		await expect.element(page.getByPlaceholder('Search fruits')).toBeInTheDocument();
	});

	it('closes on Escape', async () => {
		render(ComboboxFixture, {});
		await flush();
		await openCombobox();

		await userEvent.keyboard('{Escape}');
		await flush();
		await expect.element(page.getByText('Apple')).not.toBeInTheDocument();
	});
});

describe('Combobox -- item activation', () => {
	it('fires the item callback on click', async () => {
		const onBanana = vi.fn();
		render(ComboboxFixture, { onBanana });
		await flush();
		await openCombobox();

		await page.getByText('Banana').click();
		await flush();
		expect(onBanana).toHaveBeenCalledTimes(1);
	});
});

describe('Combobox -- search input', () => {
	it('focuses the search input when open', async () => {
		render(ComboboxFixture, {});
		await flush();
		await openCombobox();
		await new Promise((r) => setTimeout(r, 50));

		const search = document.querySelector('input[placeholder="Search fruits"]');
		expect(document.activeElement).toBe(search);
	});

	it('updates state.searchContent as user types', async () => {
		render(ComboboxFixture, {});
		await flush();
		await openCombobox();
		await new Promise((r) => setTimeout(r, 50));

		const search = document.querySelector('input[placeholder="Search fruits"]') as HTMLInputElement;
		search.focus();
		await userEvent.type(search, 'app');
		await flush();

		const comboState = Object.values(states).find(
			(s) => s && s.data && typeof s.data === 'object' && 'searchContent' in (s.data ?? {})
		);
		expect(comboState).toBeDefined();
		expect((comboState!.data as { searchContent: string }).searchContent).toBe('app');
	});
});
