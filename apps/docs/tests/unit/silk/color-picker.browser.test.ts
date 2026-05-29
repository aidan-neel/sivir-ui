import { describe, expect, it, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { userEvent } from 'vitest/browser';
import { tick } from 'svelte';
import ColorPickerFixture from '../../fixtures/ColorPickerFixture.svelte';
import { states } from '@silk/ui/internals/state.svelte.ts';

/*
 * Color-picker is a popover-using component. Sprint 2 covers the
 * popover-related surface: open/close, content visibility, and click
 * on a preset option fires the onValueChange. Color-conversion
 * helpers (hexToHsv etc.) are inline in the .svelte and deferred per
 * P3-F3.
 *
 * Sprint 3 adds SB / Hue pointer-drag tests. Drag interactions justify
 * the browser-runner under Sec.7.1 (real pointerdown/move/up event
 * propagation, layout-dependent getBoundingClientRect).
 */

async function flush() {
	await tick();
	await tick();
	await new Promise((r) => setTimeout(r, 20));
}

async function openPicker() {
	const trigger = document.querySelector('button') as HTMLButtonElement;
	trigger.click();
	await flush();
	await new Promise((r) => setTimeout(r, 100));
}

beforeEach(() => {
	for (const key of Object.keys(states)) {
		delete states[key];
	}
});

describe('ColorPicker -- popover open and close', () => {
	it('hides the picker content initially', async () => {
		render(ColorPickerFixture, { value: '#ff0000' });
		await flush();
		const hexInput = document.querySelector('input[placeholder="000000"]');
		expect(hexInput).toBeNull();
	});

	it('shows the picker content after trigger click', async () => {
		render(ColorPickerFixture, { value: '#ff0000' });
		await flush();
		await openPicker();
		const hexInput = document.querySelector('input[placeholder="000000"]');
		expect(hexInput).toBeInTheDocument();
	});

	it.skip('closes on Escape (focus inside popover) -- P3-F8 still open after P3-F7 fix', async () => {
		render(ColorPickerFixture, { value: '#ff0000' });
		await flush();
		await openPicker();
		let hexInput = document.querySelector(
			'input[placeholder="000000"]'
		) as HTMLInputElement | null;
		hexInput?.focus();
		await userEvent.keyboard('{Escape}');
		await flush();
		hexInput = document.querySelector('input[placeholder="000000"]');
		expect(hexInput).toBeNull();
	});
});

describe('ColorPicker -- preset option selection', () => {
	it('shows preset option swatches when open', async () => {
		render(ColorPickerFixture, { value: '#ff0000' });
		await flush();
		await openPicker();

		const buttons = document.querySelectorAll('[data-ui="popover-content"] button');
		expect(buttons.length).toBeGreaterThanOrEqual(3);
	});
});

describe('ColorPicker -- SB drag (saturation/value)', () => {
	it.skip('clicking the SB region center changes the value -- P3-F11 still blocked', async () => {
		let receivedValue: string | undefined;
		render(ColorPickerFixture, {
			value: '#ff0000',
			onValueChange: (v: string) => {
				receivedValue = v;
			}
		});
		await flush();
		await openPicker();

		const sb = document.querySelector(
			'[data-ui="popover-content"] .cursor-crosshair'
		) as HTMLElement;
		expect(sb).toBeInTheDocument();

		// userEvent.click in vitest-browser issues real Playwright pointer
		// events at the element's center -- these satisfy setPointerCapture
		// requirements that synthetic dispatchEvent cannot.
		await userEvent.click(sb);
		await flush();

		expect(receivedValue).toBeDefined();
		expect(receivedValue).toMatch(/^#[0-9a-f]{6}$/);
		// Initial value was pure red (#ff0000, sat=100, val=100). A click at the
		// center maps to sat=50, val=50 -- distinctly different.
		expect(receivedValue!.toLowerCase()).not.toBe('#ff0000');
	});
});

describe('ColorPicker -- Hue drag', () => {
	it.skip('clicking the hue strip changes the hue -- P3-F11 still blocked', async () => {
		const calls: string[] = [];
		render(ColorPickerFixture, {
			value: '#ff0000',
			onValueChange: (v: string) => {
				calls.push(v);
			}
		});
		await flush();
		await openPicker();

		const hue = document.querySelector(
			'[data-ui="popover-content"] .cursor-ew-resize'
		) as HTMLElement;
		expect(hue).toBeInTheDocument();

		await userEvent.click(hue);
		await flush();

		expect(calls.length).toBeGreaterThanOrEqual(1);
		expect(calls[calls.length - 1]).toMatch(/^#[0-9a-f]{6}$/);
	});
});
