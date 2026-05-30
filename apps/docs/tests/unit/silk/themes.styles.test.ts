import { describe, expect, it } from 'vitest';
import { stylePresets, getStyle, styleToCss } from '@silk/ui/themes/styles';

// Phase 5: the Style mechanism is a coherent token-bundle layer applied on top
// of a theme. These tests pin the registry, lookup, and CSS serialization.
describe('style presets registry', () => {
	it('auto-discovers the shipped styles (flat/soft/sharp)', () => {
		const slugs = stylePresets.map((s) => s.slug).sort();
		expect(slugs).toContain('flat');
		expect(slugs).toContain('soft');
		expect(slugs).toContain('sharp');
	});

	it('every shipped style declares a reference component set and token bundle', () => {
		for (const style of stylePresets) {
			expect(style.components.length, `${style.slug} components`).toBeGreaterThan(0);
			expect(Object.keys(style.tokens).length, `${style.slug} tokens`).toBeGreaterThan(0);
		}
	});
});

describe('getStyle', () => {
	it('resolves a known slug', () => {
		expect(getStyle('soft')?.slug).toBe('soft');
	});

	it('returns null for none / null / unknown', () => {
		expect(getStyle('none')).toBeNull();
		expect(getStyle(null)).toBeNull();
		expect(getStyle(undefined)).toBeNull();
		expect(getStyle('does-not-exist')).toBeNull();
	});
});

describe('styleToCss', () => {
	it('returns empty string for no style', () => {
		expect(styleToCss(null)).toBe('');
	});

	it('serializes a style into a :root, .dark override block with its tokens', () => {
		const css = styleToCss(getStyle('soft'));
		expect(css).toContain(':root');
		expect(css).toContain('.dark');
		// Soft overrides the radius scale; the bundle must surface in the CSS.
		expect(css).toContain('--radius-lg: 16px');
	});

	it('flat removes elevation', () => {
		const css = styleToCss(getStyle('flat'));
		expect(css).toContain('--card-shadow: none');
		expect(css).toContain('--panel-shadow: none');
	});

	it('sharp tightens the radius scale', () => {
		const css = styleToCss(getStyle('sharp'));
		expect(css).toContain('--radius-lg: 2px');
	});
});
