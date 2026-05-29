import { describe, expect, it } from 'vitest';
import {
	transitionPresets,
	getTransitionPreset,
	cloneTransitionMotion
} from '@silk/ui/themes/transitions';

const requiredMotionStringFields = [
	'hoverDuration',
	'menuDuration',
	'panelDuration',
	'sheetDuration',
	'overlayDuration',
	'tooltipDuration',
	'toastInDuration',
	'toastOutDuration'
] as const;

const requiredMotionNumberFields = [
	'panelX',
	'panelY',
	'panelBlur',
	'panelScaleStart',
	'sheetOffset',
	'overlayBlur'
] as const;

describe('transitionPresets', () => {
	it('contains at least one preset', () => {
		expect(transitionPresets.length).toBeGreaterThan(0);
	});

	it('sorts the default preset first when present', () => {
		const defaultIndex = transitionPresets.findIndex((p) => p.slug === 'default');
		if (defaultIndex !== -1) {
			expect(defaultIndex).toBe(0);
		}
	});

	it('sorts non-default presets alphabetically by name', () => {
		const nonDefault = transitionPresets.filter((p) => p.slug !== 'default');
		const sortedNames = [...nonDefault]
			.map((p) => p.name)
			.sort((a, b) => a.localeCompare(b));
		expect(nonDefault.map((p) => p.name)).toEqual(sortedNames);
	});

	it.each(['default'])('includes the required preset: %s', (slug) => {
		expect(transitionPresets.some((p) => p.slug === slug)).toBe(true);
	});

	describe('every preset has the required shape', () => {
		for (const preset of transitionPresets) {
			it(`${preset.slug}: structural fields`, () => {
				expect(typeof preset.slug).toBe('string');
				expect(preset.slug.length).toBeGreaterThan(0);
				expect(typeof preset.name).toBe('string');
				expect(preset.name.length).toBeGreaterThan(0);
				expect(typeof preset.description).toBe('string');
				expect(preset.motion).toBeDefined();
				expect(typeof preset.motion).toBe('object');
			});

			it(`${preset.slug}: motion has all required string duration fields`, () => {
				for (const field of requiredMotionStringFields) {
					expect(typeof preset.motion[field]).toBe('string');
					expect(preset.motion[field].length).toBeGreaterThan(0);
				}
			});

			it(`${preset.slug}: motion has all required number fields`, () => {
				for (const field of requiredMotionNumberFields) {
					expect(typeof preset.motion[field]).toBe('number');
					expect(Number.isFinite(preset.motion[field])).toBe(true);
				}
			});

			it(`${preset.slug}: panelScaleStart is between 0 and 1`, () => {
				expect(preset.motion.panelScaleStart).toBeGreaterThanOrEqual(0);
				expect(preset.motion.panelScaleStart).toBeLessThanOrEqual(1);
			});

			it(`${preset.slug}: optional panelOpacityStart, when present, is between 0 and 1`, () => {
				if (preset.motion.panelOpacityStart !== undefined) {
					expect(preset.motion.panelOpacityStart).toBeGreaterThanOrEqual(0);
					expect(preset.motion.panelOpacityStart).toBeLessThanOrEqual(1);
				}
			});

			it(`${preset.slug}: optional panelPerspective, when present, is non-negative`, () => {
				if (preset.motion.panelPerspective !== undefined) {
					expect(preset.motion.panelPerspective).toBeGreaterThanOrEqual(0);
				}
			});
		}
	});
});

describe('getTransitionPreset', () => {
	it('returns the requested preset when it exists', () => {
		const preset = getTransitionPreset('default');
		expect(preset.slug).toBe('default');
	});

	it('falls back to the first preset for unknown slug', () => {
		const fallback = getTransitionPreset('definitely-not-a-real-slug');
		expect(fallback).toBe(transitionPresets[0]);
	});
});

describe('cloneTransitionMotion', () => {
	it('returns a deep clone (mutating result does not affect original)', () => {
		const source = transitionPresets[0].motion;
		const clone = cloneTransitionMotion(source);
		expect(clone).toEqual(source);
		expect(clone).not.toBe(source);

		clone.panelY = 9999;
		expect(source.panelY).not.toBe(9999);
	});

	it('clones all primitive fields', () => {
		const source = transitionPresets[0].motion;
		const clone = cloneTransitionMotion(source);
		for (const field of requiredMotionStringFields) {
			expect(clone[field]).toBe(source[field]);
		}
		for (const field of requiredMotionNumberFields) {
			expect(clone[field]).toBe(source[field]);
		}
	});
});
