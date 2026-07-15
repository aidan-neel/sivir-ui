import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import { tick } from 'svelte';
import ContextMenuFixture from '../../fixtures/ContextMenuFixture.svelte';
import { states } from '@sivir/ui/internals/state.svelte.ts';

async function flush() {
	await tick();
	await tick();
	await new Promise((r) => setTimeout(r, 20));
}

async function openContextMenu() {
	const trigger = document.querySelector('[data-testid="ctx-trigger"]') as HTMLElement;
	const event = new MouseEvent('contextmenu', {
		bubbles: true,
		cancelable: true,
		clientX: 100,
		clientY: 100
	});
	trigger.dispatchEvent(event);
	await flush();
}

beforeEach(() => {
	for (const key of Object.keys(states)) {
		delete states[key];
	}
});

describe('ContextMenu -- open via right-click', () => {
	it('does not show items initially', async () => {
		render(ContextMenuFixture, {});
		await flush();
		await expect.element(page.getByTestId('ctx-copy')).not.toBeInTheDocument();
	});

	it('opens on right-click of the trigger', async () => {
		render(ContextMenuFixture, {});
		await flush();
		await openContextMenu();

		await expect.element(page.getByTestId('ctx-copy')).toBeInTheDocument();
		await expect.element(page.getByTestId('ctx-paste')).toBeInTheDocument();
		await expect.element(page.getByTestId('ctx-delete')).toBeInTheDocument();
	});

	it('closes on Escape', async () => {
		render(ContextMenuFixture, {});
		await flush();
		await openContextMenu();

		await userEvent.keyboard('{Escape}');
		await flush();
		await expect.element(page.getByTestId('ctx-copy')).not.toBeInTheDocument();
	});
});

describe('ContextMenu -- item activation', () => {
	it('fires the item callback on click', async () => {
		const onPaste = vi.fn();
		render(ContextMenuFixture, { onPaste });
		await flush();
		await openContextMenu();

		await page.getByTestId('ctx-paste').click();
		await flush();
		expect(onPaste).toHaveBeenCalledTimes(1);
	});
});

describe('ContextMenu -- positioning', () => {
	it('positions content based on pointer location (style.left/top set)', async () => {
		render(ContextMenuFixture, {});
		await flush();
		await openContextMenu();

		const content = document.querySelector('[data-floating-content]') as HTMLElement;
		expect(content).toBeInTheDocument();
		expect(content.style.left).not.toBe('');
		expect(content.style.top).not.toBe('');
	});
});
