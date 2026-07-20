import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import { tick } from 'svelte';
import DropdownMenuSubFixture from '../../fixtures/DropdownMenuSubFixture.svelte';
import ContextMenuSubFixture from '../../fixtures/ContextMenuSubFixture.svelte';

async function flush() {
	await tick();
	await tick();
	await new Promise((r) => setTimeout(r, 30));
}

async function hover(testId: string) {
	// mouseenter does not bubble — fire on the trigger button itself.
	const el = page.getByTestId(testId).element() as HTMLElement;
	const target = (el.closest('button') as HTMLElement | null) ?? el;
	target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false }));
	target.dispatchEvent(new FocusEvent('focus', { bubbles: false }));
	await flush();
}

async function openDropdown() {
	await page.getByTestId('dd-trigger').click();
	await flush();
}

async function openContext() {
	const trigger = document.querySelector('[data-testid="ctx-sub-trigger"]') as HTMLElement;
	trigger.dispatchEvent(
		new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 80, clientY: 80 })
	);
	await flush();
}

describe('DropdownMenu submenu cone', () => {
	it('opens Share → Social → Twitter as a cascade', async () => {
		render(DropdownMenuSubFixture, {});
		await flush();
		await openDropdown();

		await expect.element(page.getByTestId('dd-share')).toBeInTheDocument();
		await expect.element(page.getByTestId('dd-twitter')).not.toBeInTheDocument();

		await hover('dd-share');
		await expect.element(page.getByTestId('dd-social')).toBeInTheDocument();
		await expect.element(page.getByTestId('dd-email')).toBeInTheDocument();

		await hover('dd-social');
		await expect.element(page.getByTestId('dd-twitter')).toBeInTheDocument();
	});

	it('Escape peels one level at a time from the tip of the cone', async () => {
		render(DropdownMenuSubFixture, {});
		await flush();
		await openDropdown();
		await hover('dd-share');
		await hover('dd-social');
		await expect.element(page.getByTestId('dd-twitter')).toBeInTheDocument();

		// Re-hover after each peel so hoverable parents stay open while we assert
		// the cone shrinks from the tip inward.
		await userEvent.keyboard('{Escape}');
		await flush();
		await expect.element(page.getByTestId('dd-twitter')).not.toBeInTheDocument();
		await hover('dd-share');
		await expect.element(page.getByTestId('dd-social')).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');
		await flush();
		await expect.element(page.getByTestId('dd-social')).not.toBeInTheDocument();
		await expect.element(page.getByTestId('dd-share')).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');
		await flush();
		await expect.element(page.getByTestId('dd-share')).not.toBeInTheDocument();
	});

	it('activates a leaf deep in the cone', async () => {
		const onTwitter = vi.fn();
		render(DropdownMenuSubFixture, { onTwitter });
		await flush();
		await openDropdown();
		await hover('dd-share');
		await hover('dd-social');

		await page.getByTestId('dd-twitter').click();
		await flush();
		expect(onTwitter).toHaveBeenCalledTimes(1);
		await expect.element(page.getByTestId('dd-share')).not.toBeInTheDocument();
	});
});

describe('ContextMenu submenu cone', () => {
	it('opens More → Move → Trash as a cascade', async () => {
		render(ContextMenuSubFixture, {});
		await flush();
		await openContext();

		await expect.element(page.getByTestId('ctx-more')).toBeInTheDocument();
		await hover('ctx-more');
		await expect.element(page.getByTestId('ctx-move')).toBeInTheDocument();
		await hover('ctx-move');
		await expect.element(page.getByTestId('ctx-trash')).toBeInTheDocument();
	});

	it('Escape peels one context-submenu level at a time', async () => {
		render(ContextMenuSubFixture, {});
		await flush();
		await openContext();
		await hover('ctx-more');
		await hover('ctx-move');
		await expect.element(page.getByTestId('ctx-trash')).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');
		await flush();
		await expect.element(page.getByTestId('ctx-trash')).not.toBeInTheDocument();
		await expect.element(page.getByTestId('ctx-move')).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');
		await flush();
		await expect.element(page.getByTestId('ctx-move')).not.toBeInTheDocument();
		await expect.element(page.getByTestId('ctx-more')).toBeInTheDocument();
	});
});
