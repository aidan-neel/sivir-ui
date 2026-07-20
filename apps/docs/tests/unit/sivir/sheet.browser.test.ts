import { describe, expect, it, afterEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import { tick } from 'svelte';
import { sheetIn, sheetOut } from '@sivir/ui/internals/transition';
import SheetFixture from '../../fixtures/SheetFixture.svelte';

/*
 * Sheet has a `visible` state that stays true through the closing
 * animation, only flipping to false after `animationend`. Tests must
 * wait for the animation to complete, or fire animationend manually.
 *
 * Browser-runner justified per strategy Sec.7.1: portal mount/unmount,
 * focus trap, click-outside, real keyboard event propagation,
 * transition lifecycle.
 */

async function flush() {
	await tick();
	await tick();
}

async function waitForAnimationEnd() {
	await flush();
	// Sheet's close path waits for animationend. Fire it manually on the
	// panel to bypass real-time animation duration.
	const panel = document.querySelector('[data-ui="sheet-content"]');
	if (panel) {
		panel.dispatchEvent(new AnimationEvent('animationend', { bubbles: true }));
	}
	await flush();
}

afterEach(() => {
	document.body.style.overflow = '';
});

describe('Sheet -- mount and unmount in real browser', () => {
	it('does not render content when open=false', async () => {
		render(SheetFixture, { open: false });
		await flush();
		await expect.element(page.getByText('Sheet Title')).not.toBeInTheDocument();
	});

	it('renders content when open=true', async () => {
		render(SheetFixture, { open: true });
		await flush();
		await expect.element(page.getByText('Sheet Title')).toBeInTheDocument();
		await expect.element(page.getByText('Sheet Description')).toBeInTheDocument();
	});

	it('opens after clicking the test trigger', async () => {
		render(SheetFixture, { open: false });
		await flush();
		await expect.element(page.getByText('Sheet Title')).not.toBeInTheDocument();

		await page.getByTestId('trigger').click();
		await flush();
		await expect.element(page.getByText('Sheet Title')).toBeInTheDocument();
	});
});

describe('Sheet -- close paths', () => {
	it('unmounts content when Close button is clicked', async () => {
		render(SheetFixture, { open: true });
		await flush();
		await expect.element(page.getByText('Sheet Title')).toBeInTheDocument();

		await page.getByText('Close').click();
		await waitForAnimationEnd();
		await expect.element(page.getByText('Sheet Title')).not.toBeInTheDocument();
	});

	it('unmounts content when Escape is pressed', async () => {
		render(SheetFixture, { open: true });
		await flush();
		await expect.element(page.getByText('Sheet Title')).toBeInTheDocument();

		const panel = document.querySelector('[data-ui="sheet-content"]') as HTMLElement;
		panel.focus();
		await userEvent.keyboard('{Escape}');
		await waitForAnimationEnd();
		await expect.element(page.getByText('Sheet Title')).not.toBeInTheDocument();
	});

	it('unmounts content on click outside (when allowClickOutside is true)', async () => {
		render(SheetFixture, { open: true, allowClickOutside: true });
		await flush();
		await new Promise((r) => setTimeout(r, 20));
		await expect.element(page.getByText('Sheet Title')).toBeInTheDocument();

		const backdrop = document.querySelector('[data-ui="sheet-overlay"]') as HTMLElement;
		expect(backdrop).toBeInTheDocument();
		backdrop.click();
		await waitForAnimationEnd();
		await expect.element(page.getByText('Sheet Title')).not.toBeInTheDocument();
	});

	it('does NOT unmount on click outside when allowClickOutside is false', async () => {
		render(SheetFixture, { open: true, allowClickOutside: false });
		await flush();
		await new Promise((r) => setTimeout(r, 20));
		await expect.element(page.getByText('Sheet Title')).toBeInTheDocument();

		const backdrop = document.querySelector('[data-ui="sheet-overlay"]') as HTMLElement;
		expect(backdrop).toBeInTheDocument();
		backdrop.click();
		await flush();
		await expect.element(page.getByText('Sheet Title')).toBeInTheDocument();
	});
});

describe('Sheet -- ARIA', () => {
	it('sets role="dialog"', async () => {
		render(SheetFixture, { open: true });
		await flush();
		const dialog = document.querySelector('[role="dialog"]');
		expect(dialog).toBeInTheDocument();
	});

	it('sets aria-modal="true"', async () => {
		render(SheetFixture, { open: true });
		await flush();
		const dialog = document.querySelector('[role="dialog"]');
		expect(dialog?.getAttribute('aria-modal')).toBe('true');
	});

	it('exposes the side as data-side', async () => {
		render(SheetFixture, { open: true, side: 'left' });
		await flush();
		const panel = document.querySelector('[data-ui="sheet-content"]');
		expect(panel?.getAttribute('data-side')).toBe('left');
	});

	it('slides from the anchored edge without opacity fade', async () => {
		render(SheetFixture, { open: true, side: 'right' });
		await flush();
		const panel = document.querySelector('[data-ui="sheet-content"]')!;
		expect(panel.getAttribute('data-motion')).toBe('sheet');

		const enter = sheetIn(panel, { side: 'right' });
		const exit = sheetOut(panel, { side: 'right' });
		expect(enter.css?.(0, 1)).toContain('translate3d(100%, 0, 0)');
		expect(enter.css?.(1, 0)).toContain('translate3d(0%, 0, 0)');
		expect(enter.css?.(0, 1)).not.toContain('opacity');
		expect(exit.duration ?? 0).toBeLessThan(enter.duration ?? 0);

		const leftEnter = sheetIn(panel, { side: 'left' });
		expect(leftEnter.css?.(0, 1)).toContain('translate3d(-100%, 0, 0)');
	});

	it('sets aria-labelledby to a resolvable id', async () => {
		render(SheetFixture, { open: true });
		await flush();
		const dialog = document.querySelector('[role="dialog"]');
		const labelledBy = dialog?.getAttribute('aria-labelledby');
		expect(labelledBy).toBeTruthy();
		expect(document.getElementById(labelledBy!)).toBeTruthy();
	});
});

describe('Sheet -- body scroll lock', () => {
	it('locks body scroll when open', async () => {
		render(SheetFixture, { open: true });
		await flush();
		expect(document.body.style.overflow).toBe('hidden');
	});

	it('restores body scroll on close', async () => {
		render(SheetFixture, { open: true });
		await flush();
		expect(document.body.style.overflow).toBe('hidden');

		await page.getByText('Close').click();
		await waitForAnimationEnd();
		expect(document.body.style.overflow).toBe('');
	});
});
