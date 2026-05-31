import { describe, expect, it } from 'vitest';
import { densityLevels, scaleSpacing, defaultSpacing } from '@silk/ui/themes/presets';

describe('densityLevels', () => {
	it('exposes five ordered levels from tight to roomy', () => {
		expect(densityLevels).toHaveLength(5);
		const scales = densityLevels.map((l) => l.scale);
		const sorted = [...scales].sort((a, b) => a - b);
		expect(scales).toEqual(sorted);
	});

	it('has a comfortable level at scale 1.0', () => {
		const comfortable = densityLevels.find((l) => l.slug === 'comfortable');
		expect(comfortable?.scale).toBe(1);
	});

	it('has unique slugs and labels', () => {
		expect(new Set(densityLevels.map((l) => l.slug)).size).toBe(densityLevels.length);
		expect(new Set(densityLevels.map((l) => l.label)).size).toBe(densityLevels.length);
	});
});

describe('scaleSpacing', () => {
	it('reproduces the defaults at scale 1.0', () => {
		expect(scaleSpacing(defaultSpacing, 1)).toEqual(defaultSpacing);
	});

	it('covers every default spacing key', () => {
		const scaled = scaleSpacing(defaultSpacing, 0.8);
		expect(Object.keys(scaled).sort()).toEqual(Object.keys(defaultSpacing).sort());
	});

	it('rounds to whole pixels and never goes below zero', () => {
		const scaled = scaleSpacing(defaultSpacing, 0.8);
		for (const value of Object.values(scaled)) {
			expect(Number.isInteger(value)).toBe(true);
			expect(value).toBeGreaterThanOrEqual(0);
		}
	});

	it('scales tokens up and down relative to the base', () => {
		const compact = scaleSpacing(defaultSpacing, 0.8);
		const spacious = scaleSpacing(defaultSpacing, 1.3);
		expect(compact.cardPadding).toBe(Math.round(defaultSpacing.cardPadding * 0.8));
		expect(spacious.cardPadding).toBe(Math.round(defaultSpacing.cardPadding * 1.3));
		expect(compact.cardPadding).toBeLessThan(defaultSpacing.cardPadding);
		expect(spacious.cardPadding).toBeGreaterThan(defaultSpacing.cardPadding);
	});
});
