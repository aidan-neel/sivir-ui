import { describe, expect, it, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import { tick } from 'svelte';
import TooltipFixture from '../../fixtures/TooltipFixture.svelte';
import { states } from '@silk/ui/internals/state.svelte.ts';

/*
 * Tooltip is now a popover wrapper post-F-29 collapse.
 * Tests assert only the wrapper-distinctive surface:
 *   - role="tooltip" on the rendered content
 *   - hover-to-open with the wrapper's configured delay
 *   - hover-end-to-close with the wrapper's closeDelay
 *   - delay/closeDelay overrides propagate
 *
 * Popover's general behaviors (positioning, escape, click-outside)
 * are covered in popover.browser.test.ts -- not re-tested here.
 */

async function flush() {
	await tick();
	await tick();
	await new Promise((r) => setTimeout(r, 20));
}

beforeEach(() => {
	for (const key of Object.keys(states)) {
		delete states[key];
	}
});

describe('Tooltip -- closed initially, no content rendered', () => {
	it('content is not in the DOM before hover', async () => {
		render(TooltipFixture, { delay: 10, closeDelay: 10 });
		await flush();
		await expect.element(page.getByTestId('tooltip-body')).not.toBeInTheDocument();
	});
});

describe('Tooltip -- hover opens after the configured delay', () => {
	it('content appears after pointer enters the trigger', async () => {
		render(TooltipFixture, { delay: 10, closeDelay: 10 });
		await flush();

		await page.getByTestId('tooltip-trigger').hover();
		// Wait past the open delay + a frame to settle.
		await new Promise((r) => setTimeout(r, 80));
		await flush();

		await expect.element(page.getByTestId('tooltip-body')).toBeInTheDocument();
	});

	it('role="tooltip" is set on the rendered content', async () => {
		render(TooltipFixture, { delay: 10, closeDelay: 10 });
		await flush();
		await page.getByTestId('tooltip-trigger').hover();
		await new Promise((r) => setTimeout(r, 80));
		await flush();

		const tooltipEl = document.querySelector('[role="tooltip"]');
		expect(tooltipEl).toBeInTheDocument();
		expect(tooltipEl?.textContent).toMatch(/Tooltip content/);
	});

	it('uses default delay of 600ms when not overridden (does NOT open at <100ms)', async () => {
		render(TooltipFixture, {});
		await flush();
		await page.getByTestId('tooltip-trigger').hover();
		await new Promise((r) => setTimeout(r, 80));
		await flush();

		// At 80ms, the default 600ms delay has not elapsed.
		await expect.element(page.getByTestId('tooltip-body')).not.toBeInTheDocument();
	});
});

describe('Tooltip -- leave closes after closeDelay', () => {
	it('content goes away after pointer leaves the trigger', async () => {
		render(TooltipFixture, { delay: 10, closeDelay: 10 });
		await flush();

		await page.getByTestId('tooltip-trigger').hover();
		await new Promise((r) => setTimeout(r, 80));
		await flush();
		await expect.element(page.getByTestId('tooltip-body')).toBeInTheDocument();

		// Move pointer away from trigger via synthetic leave events (vitest's
		// BrowserPage has no positional hover; element-level dispatch covers it).
		const trigger = document.querySelector('[data-testid="tooltip-trigger"]')
			?.parentElement;
		trigger?.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
		trigger?.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
		await new Promise((r) => setTimeout(r, 80));
		await flush();

		await expect.element(page.getByTestId('tooltip-body')).not.toBeInTheDocument();
	});
});

describe('Tooltip -- content is not interactive (aria-modal not applied for role="none" wrapper)', () => {
	it('no aria-modal attribute on the role="tooltip" content', async () => {
		render(TooltipFixture, { delay: 10, closeDelay: 10 });
		await flush();
		await page.getByTestId('tooltip-trigger').hover();
		await new Promise((r) => setTimeout(r, 80));
		await flush();

		const tooltipEl = document.querySelector('[role="tooltip"]');
		expect(tooltipEl).toBeInTheDocument();
		// role="tooltip" must NOT carry aria-modal -- only dialog/alertdialog do.
		expect(tooltipEl?.hasAttribute('aria-modal')).toBe(false);
	});
});
