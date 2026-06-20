import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const css = readFileSync(fileURLToPath(new URL('../ui.css', import.meta.url)), 'utf8');

describe('ui.css Tier 1 primitives', () => {
	it('defines the 13-step neutral ramp', () => {
		for (const step of [0, 25, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 900]) {
			expect(css).toContain(`--silk-neutral-${step}:`);
		}
	});
	it('defines the blue ramp and the 4px space unit', () => {
		expect(css).toContain('--silk-blue-500:');
		expect(css).toContain('--silk-space-unit: 4px');
	});
	it('overrides the neutral ramp under .dark', () => {
		const darkBlock = css.slice(css.indexOf('.dark'));
		expect(darkBlock).toContain('--silk-neutral-0: #0d0d0d');
	});
});

describe('ui.css Tier 2 semantic', () => {
	it('maps semantic color tokens to neutral/blue primitives', () => {
		expect(css).toContain('--color-background: var(--silk-neutral-25)');
		expect(css).toContain('--color-card: var(--silk-neutral-0)');
		expect(css).toContain('--color-primary: var(--silk-blue-500)');
		expect(css).toContain('--color-ring: var(--silk-blue-ring)');
	});
	it('aliases retired names to their replacements', () => {
		expect(css).toContain('--color-destructive: var(--color-error)');
		expect(css).toContain('--color-modal: var(--color-panel)');
		expect(css).toContain('--color-info: var(--color-primary)');
	});
});

describe('ui.css Tier 3 + structure', () => {
	it('derives button tokens from semantic tokens (no fancy shadow tokens)', () => {
		expect(css).toContain('--button-primary-bg: var(--color-primary)');
		expect(css).toContain('--button-secondary-bg: var(--color-secondary)');
		expect(css).not.toContain('--button-primary-shadow');
		expect(css).not.toContain('--button-fancy-highlight');
	});
	it('sizes controls from the spacing scale', () => {
		expect(css).toMatch(/--size-control-md:.*var\(--silk-space-/);
		expect(css).toContain('--button-height: var(--size-control-md)');
	});
	it('keeps base layer, keyframes and reduced-motion', () => {
		expect(css).toContain('@layer base');
		expect(css).toContain('@keyframes skeleton-loading');
		expect(css).toContain('prefers-reduced-motion: reduce');
	});
});
