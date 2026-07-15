import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import { tick } from 'svelte';
import CommandFixture from '../../fixtures/CommandFixture.svelte';
import { states } from '@sivir/ui/internals/state.svelte.ts';

async function flush() {
	await tick();
	await tick();
	await new Promise((r) => setTimeout(r, 20));
}

async function openCommand() {
	await page.getByTestId('command-trigger').click();
	await flush();
}

beforeEach(() => {
	for (const key of Object.keys(states)) {
		delete states[key];
	}
});

afterEach(() => {
	document.body.style.overflow = '';
});

describe('Command -- open and close', () => {
	it('hides items initially', async () => {
		render(CommandFixture, {});
		await flush();
		await expect.element(page.getByTestId('cmd-profile')).not.toBeInTheDocument();
	});

	it('shows items + search input after opening', async () => {
		render(CommandFixture, {});
		await flush();
		await openCommand();
		await expect.element(page.getByTestId('cmd-profile')).toBeInTheDocument();
		await expect.element(page.getByTestId('cmd-settings')).toBeInTheDocument();
		await expect.element(page.getByTestId('cmd-logout')).toBeInTheDocument();
		await expect.element(page.getByPlaceholder('Search commands')).toBeInTheDocument();
	});

	it('uses Modal overlay and dialog motion', async () => {
		render(CommandFixture, {});
		await flush();
		await openCommand();

		const overlay = document.querySelector('[data-ui="modal-overlay"]');
		const dialog = document.querySelector('[data-ui="command-content"]');
		expect(overlay).toBeInTheDocument();
		expect(dialog).toBeInTheDocument();

		const className = dialog?.getAttribute('class') ?? '';
		expect(dialog?.getAttribute('data-motion')).toBe('dialog');
		expect(className).toContain('origin-center');
	});

	it('closes on Escape', async () => {
		render(CommandFixture, {});
		await flush();
		await openCommand();

		await userEvent.keyboard('{Escape}');
		await flush();
		await expect.element(page.getByTestId('cmd-profile')).not.toBeInTheDocument();
	});
});

describe('Command -- item activation', () => {
	it('fires the item callback on click', async () => {
		const onSettings = vi.fn();
		render(CommandFixture, { onSettings });
		await flush();
		await openCommand();

		await page.getByTestId('cmd-settings').click();
		await flush();
		expect(onSettings).toHaveBeenCalledTimes(1);
	});
});

describe('Command -- search input', () => {
	it('focuses the search input when open', async () => {
		render(CommandFixture, {});
		await flush();
		await openCommand();
		await new Promise((r) => setTimeout(r, 50));

		const search = document.querySelector('input[placeholder="Search commands"]');
		expect(document.activeElement).toBe(search);
	});
});
