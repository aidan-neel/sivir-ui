import { describe, expect, it, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import { tick } from 'svelte';
import TooltipSwapFixture from '../../fixtures/TooltipSwapFixture.svelte';
import { resetSharedTooltipForTests } from '@sivir/ui/components/tooltip/shared-tooltip';

/*
 * When a tooltip is already open and the pointer moves to another trigger, the
 * label must swap *instantly* -- no slot-text roll. The shared bubble still
 * slides/reshapes via CSS, but the glyphs are rebuilt synchronously.
 *
 * We sample the visible glyphs (.char-face) 25ms after the swap: well inside the
 * old ~95ms roll window. Instant => the new label is already complete; a roll
 * would still be showing interleaved old/new glyphs at this point.
 */

async function flush(ms = 30) {
	await tick();
	await new Promise((r) => setTimeout(r, ms));
}

function visibleLabel() {
	const el = document.querySelector('[data-sivir-tooltip]') as HTMLElement | null;
	if (!el) return '';
	const faces = el.querySelectorAll('.char-face');
	if (faces.length) {
		return Array.from(faces)
			.map((f) => f.textContent ?? '')
			.join('')
			.replace(/\s+/g, '');
	}
	return (el.textContent ?? '').replace(/\s+/g, '');
}

beforeEach(() => resetSharedTooltipForTests());

describe('Tooltip -- swapping triggers', () => {
	it('rebuilds the label instantly (no roll) when one tooltip is already open', async () => {
		render(TooltipSwapFixture, {});
		await flush();

		await page.getByTestId('trigger-a').hover();
		await flush(60);
		expect(visibleLabel()).toContain('Alpha');

		// Swap to the second trigger while the first bubble is still up.
		await page.getByTestId('trigger-b').hover();
		await new Promise((r) => setTimeout(r, 25));

		// Instant swap => fully "Bravo" already. A roll would still be interleaving.
		expect(visibleLabel()).toBe('Bravo');
	});
});
