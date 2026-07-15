import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const css = readFileSync(resolve(process.cwd(), '../../packages/sivir/src/ui.css'), 'utf8');

describe('ui.css Tier 1 primitives', () => {
	it('defines only the neutral steps consumed by components', () => {
		for (const step of [0, 10, 50, 100, 150, 300, 500, 900]) {
			expect(css).toContain(`--sivir-neutral-${step}:`);
		}
		for (const step of [25, 200, 400, 600, 700, 800]) {
			expect(css).not.toContain(`--sivir-neutral-${step}:`);
		}
	});
	it('defines the blue ramp and the density-driven space unit', () => {
		expect(css).toContain('--sivir-blue-500:');
		expect(css).toContain('--sivir-space-unit: 3.6px');
	});
	it('overrides the neutral ramp under .dark', () => {
		const darkBlock = css.slice(css.indexOf('.dark'));
		expect(darkBlock).toContain('--sivir-neutral-0: hsl(0 0% 5%)');
	});
});

describe('ui.css Tier 2 semantic', () => {
	it('maps semantic color tokens to neutral/blue primitives', () => {
		expect(css).toContain('--color-background: var(--sivir-neutral-10)');
		expect(css).toContain('--color-card: var(--sivir-neutral-0)');
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
	it('keeps component defaults out of the public theme contract', () => {
		expect(css).not.toMatch(
			/^\s*--(?:button|badge|field|panel|card|menu|command|tooltip|switch|checkbox|toast|tabs|progress|modal|sheet|textarea|breadcrumb|toggle|shortcut|slider)-/m
		);
	});
	it('sizes controls from the spacing scale', () => {
		expect(css).toMatch(/--size-control-md:.*var\(--sivir-space-/);
	});
	it('keeps reduced-motion while excluding global rules and component keyframes', () => {
		expect(css).not.toContain('@layer base');
		expect(css).not.toMatch(/(^|})\s*\*\s*\{/);
		expect(css).not.toContain('@keyframes');
		expect(css).toContain('prefers-reduced-motion: reduce');
	});
	it('stays within the release size budget', () => {
		expect(css.split('\n').length).toBeLessThanOrEqual(175);
		expect(Buffer.byteLength(css)).toBeLessThanOrEqual(8 * 1024);
	});
});
