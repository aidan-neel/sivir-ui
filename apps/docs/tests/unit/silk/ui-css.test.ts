import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const css = readFileSync(resolve(process.cwd(), '../../packages/silk/src/ui.css'), 'utf8');

describe('ui.css Tier 1 primitives', () => {
	it('defines the 13-step neutral ramp', () => {
		for (const step of [0, 25, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 900]) {
			expect(css).toContain(`--silk-neutral-${step}:`);
		}
	});
	it('defines the blue ramp and the density-driven space unit', () => {
		expect(css).toContain('--silk-blue-500:');
		expect(css).toContain('--silk-space-unit: 3.6px');
	});
	it('overrides the neutral ramp under .dark', () => {
		const darkBlock = css.slice(css.indexOf('.dark'));
		expect(darkBlock).toContain('--silk-neutral-0: hsl(0 0% 5%)');
	});
});

describe('ui.css Tier 2 semantic', () => {
	it('maps semantic color tokens to neutral/blue primitives', () => {
		expect(css).toContain('--color-background: var(--silk-neutral-10)');
		expect(css).toContain('--color-card: var(--silk-neutral-0)');
		expect(css).toContain('--color-primary: #1f9be6');
		expect(css).toContain(
			'--color-ring: color-mix(in srgb, var(--color-primary) 30%, transparent)'
		);
	});
	it('keeps canonical semantics and drops the retired aliases (consumers migrated)', () => {
		// Real semantic tokens stay.
		expect(css).toContain('--color-error:');
		expect(css).toContain('--color-panel:');
		expect(css).toContain('--color-info:');
		// Pure pass-through aliases were removed; consumers now read the canonical names.
		expect(css).not.toContain('--color-destructive:');
		expect(css).not.toContain('--color-modal:');
		expect(css).not.toContain('--color-panel-foreground:');
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
