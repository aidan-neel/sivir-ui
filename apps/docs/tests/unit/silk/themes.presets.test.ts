import { describe, expect, it } from 'vitest';
import {
	slugifyThemeName,
	resolveSpacing,
	resolveTypography,
	generatePaletteFromBase,
	contrastRatio,
	themeToCss,
	themeToTypeScriptPreset,
	defaultSpacing,
	defaultTypography,
	type ThemeBasePalette
} from '@silk/ui/themes/presets';
import { preset as defaultPreset } from '@silk/ui/themes/presets/default';
import { button } from '@silk/ui/components/button/variants';
import { input } from '@silk/ui/components/input/variants';

describe('slugifyThemeName', () => {
	it('lowercases simple names', () => {
		expect(slugifyThemeName('My Theme')).toBe('my-theme');
	});

	it('strips leading and trailing hyphens', () => {
		expect(slugifyThemeName('   spaced   ')).toBe('spaced');
		expect(slugifyThemeName('!!special!!')).toBe('special');
	});

	it('collapses non-alphanumeric runs to single hyphens', () => {
		expect(slugifyThemeName('foo   bar___baz')).toBe('foo-bar-baz');
		expect(slugifyThemeName('a!@#b')).toBe('a-b');
	});

	it('returns empty string for non-alphanumeric input', () => {
		expect(slugifyThemeName('!!!')).toBe('');
		expect(slugifyThemeName('   ')).toBe('');
		expect(slugifyThemeName('')).toBe('');
	});

	it('preserves digits and lowercases letters', () => {
		expect(slugifyThemeName('Theme 2024 v1.5')).toBe('theme-2024-v1-5');
	});

	it('strips unicode (the regex is ASCII-only)', () => {
		expect(slugifyThemeName('café')).toBe('caf');
		expect(slugifyThemeName('日本語')).toBe('');
	});
});

describe('resolveSpacing', () => {
	it('returns defaults when input is undefined', () => {
		expect(resolveSpacing()).toEqual(defaultSpacing);
	});

	it('returns defaults when input is empty object', () => {
		expect(resolveSpacing({})).toEqual(defaultSpacing);
	});

	it('overrides individual fields, keeps defaults for the rest', () => {
		const result = resolveSpacing({ buttonHeight: 50 });
		expect(result.buttonHeight).toBe(50);
		expect(result.buttonPaddingX).toBe(defaultSpacing.buttonPaddingX);
		expect(result.fieldHeight).toBe(defaultSpacing.fieldHeight);
	});

	it('does not mutate the defaults', () => {
		const original = { ...defaultSpacing };
		resolveSpacing({ buttonHeight: 99 });
		expect(defaultSpacing).toEqual(original);
	});
});

describe('resolveTypography', () => {
	it('returns defaults when input is undefined', () => {
		expect(resolveTypography()).toEqual(defaultTypography);
	});

	it('overrides individual fields', () => {
		const result = resolveTypography({ weightHeader: 700 });
		expect(result.weightHeader).toBe(700);
		expect(result.weightBody).toBe(defaultTypography.weightBody);
	});

	it('does not mutate the defaults', () => {
		const original = { ...defaultTypography };
		resolveTypography({ sizeHeader: 24 });
		expect(defaultTypography).toEqual(original);
	});
});

describe('feel + animation', () => {
	it('emits timing tokens from the selected feel', () => {
		const css = themeToCss({ ...defaultPreset, feel: 'instant' });
		expect(css).toContain('--motion-duration-panel: 110ms');
	});

	it('falls back to the default feel for an unknown slug', () => {
		const css = themeToCss({ ...defaultPreset, feel: 'nope' });
		expect(css).toContain('--motion-duration-panel:');
	});

	it('emits keyframe-name tokens from the selected animation', () => {
		const css = themeToCss({ ...defaultPreset, animation: 'fade' });
		expect(css).toContain('--silk-anim-panel-in: silk-fade-in');
	});

	it('emits cascade child-stagger CSS only for the cascade animation', () => {
		expect(themeToCss({ ...defaultPreset, animation: 'cascade' })).toContain(
			'silk-cascade-item-in'
		);
		expect(themeToCss({ ...defaultPreset, animation: 'default' })).not.toContain(
			'silk-cascade-item-in'
		);
	});
});

describe('generatePaletteFromBase', () => {
	const minimalBase: ThemeBasePalette = {
		background: '#ffffff',
		card: '#ffffff',
		text: '#101828',
		primary: '#155eef'
	};

	it('returns a full ThemePalette with required keys', () => {
		const palette = generatePaletteFromBase(minimalBase, 'light');
		expect(palette).toHaveProperty('background');
		expect(palette).toHaveProperty('border');
		expect(palette).toHaveProperty('borderStrong');
		expect(palette).toHaveProperty('input');
		expect(palette).toHaveProperty('primary');
		expect(palette).toHaveProperty('foreground');
		expect(palette).toHaveProperty('success');
		expect(palette).toHaveProperty('warning');
		expect(palette).toHaveProperty('error');
		expect(palette).toHaveProperty('destructive');
		expect(palette).toHaveProperty('overlay');
		expect(palette).toHaveProperty('ring');
	});

	it('preserves the primary color', () => {
		const palette = generatePaletteFromBase(minimalBase, 'light');
		expect(palette.primary).toBe('#155eef');
	});

	it('light and dark produce different results for a mid-tone base', () => {
		const grayBase: ThemeBasePalette = {
			background: '#808080',
			card: '#888888',
			text: '#101828',
			primary: '#155eef'
		};
		const light = generatePaletteFromBase(grayBase, 'light');
		const dark = generatePaletteFromBase(grayBase, 'dark');
		expect(light.background).not.toBe(dark.background);
		expect(light.overlay).not.toBe(dark.overlay);
	});

	it('handles invalid hex by falling back to defaults', () => {
		const broken: ThemeBasePalette = {
			background: 'not-a-color',
			card: 'still-not-a-color',
			text: '#101828',
			primary: '#155eef'
		};
		const palette = generatePaletteFromBase(broken, 'light');
		expect(palette.background).toMatch(/^#[0-9a-f]{6}$/i);
		expect(palette.primary).toBe('#155eef');
	});

	it('uses optional secondary when provided', () => {
		const withSecondary: ThemeBasePalette = {
			...minimalBase,
			secondary: '#abcdef'
		};
		const palette = generatePaletteFromBase(withSecondary, 'light');
		expect(palette.secondary).toBe('#abcdef');
	});

	it('uses optional border when provided', () => {
		const withBorder: ThemeBasePalette = {
			...minimalBase,
			border: '#deadbe'
		};
		const palette = generatePaletteFromBase(withBorder, 'light');
		expect(palette.border).toBe('#deadbe');
	});
});

describe('themeToCss', () => {
	it('returns a string containing an @theme block', () => {
		const css = themeToCss(defaultPreset);
		expect(typeof css).toBe('string');
		expect(css).toMatch(/@theme \{/);
	});

	it('includes a .dark override block', () => {
		const css = themeToCss(defaultPreset);
		expect(css).toMatch(/\.dark/);
	});

	it('propagates font tokens from the draft into the output', () => {
		const css = themeToCss({
			...defaultPreset,
			fontSans: 'Inter, sans-serif'
		});
		expect(css).toContain('--font-sans: Inter, sans-serif');
	});

	it('propagates motion duration tokens from the feel', () => {
		const css = themeToCss({ ...defaultPreset, feel: 'relaxed' });
		expect(css).toContain('--motion-duration-panel: 380ms');
	});

	it('emits radius tokens', () => {
		const css = themeToCss(defaultPreset);
		expect(css).toContain('--radius-sm:');
		expect(css).toContain('--radius-md:');
		expect(css).toContain('--radius-lg:');
		expect(css).toContain('--radius-xl:');
	});

	it('emits color tokens for the light palette', () => {
		const css = themeToCss(defaultPreset);
		expect(css).toContain('--color-background:');
		expect(css).toContain('--color-primary:');
		expect(css).toContain('--color-foreground:');
	});

	it('honors fancyButtons=false by emitting shadow overrides', () => {
		const css = themeToCss({
			...defaultPreset,
			fancyButtons: false
		});
		expect(css).toContain('--button-primary-shadow: none');
	});

	it('honors hapticPress flag', () => {
		const cssOn = themeToCss({ ...defaultPreset, hapticPress: true });
		const cssOff = themeToCss({ ...defaultPreset, hapticPress: false });
		expect(cssOn).toContain('--haptic-press-y: -1px');
		expect(cssOff).toContain('--haptic-press-y: 0px');
	});

	it('emits typography tokens reflecting the resolved typography', () => {
		const css = themeToCss({
			...defaultPreset,
			typography: { ...defaultPreset.typography!, weightHeader: 800 }
		});
		expect(css).toContain('--font-weight-header: 800');
	});

	it('emits spacing tokens reflecting the resolved spacing', () => {
		const css = themeToCss({
			...defaultPreset,
			spacing: { buttonHeight: 50 }
		});
		expect(css).toContain('--size-control-md: 50px');
	});

	// Phase 1: tokens promoted into the editable schema must now be emitted so
	// the Studio can drive them. Defaults preserve current rendering.
	it('emits the Phase 1 spacing tokens with their defaults', () => {
		const css = themeToCss(defaultPreset);
		expect(css).toContain('--field-padding-y: 0px');
		expect(css).toContain('--button-gap: 6px');
		expect(css).toContain('--switch-track-padding: 2px');
		expect(css).toContain('--textarea-min-height: 112px');
		expect(css).toContain('--textarea-padding-y: 11px');
	});

	it('reflects overrides for the Phase 1 spacing tokens', () => {
		const css = themeToCss({
			...defaultPreset,
			spacing: { fieldPaddingY: 9, buttonGap: 12, switchTrackPadding: 4 }
		});
		expect(css).toContain('--field-padding-y: 9px');
		expect(css).toContain('--button-gap: 12px');
		expect(css).toContain('--switch-track-padding: 4px');
	});

	it('emits the group-scoped motion-curve easing tokens', () => {
		const css = themeToCss(defaultPreset);
		expect(css).toContain('--motion-panel-easing:');
		expect(css).toContain('--motion-easing-hover:');
	});

	it('reflects the easing from the selected feel', () => {
		const css = themeToCss({ ...defaultPreset, feel: 'balanced' });
		expect(css).toContain('--motion-easing-hover: cubic-bezier(0.4, 0, 0.2, 1)');
	});
});

describe('resolveSpacing -- Phase 1 fields', () => {
	it('includes the promoted editable spacing defaults', () => {
		const s = resolveSpacing();
		expect(s.fieldPaddingY).toBe(0);
		expect(s.buttonGap).toBe(6);
		expect(s.switchTrackPadding).toBe(2);
		expect(s.textareaMinHeight).toBe(112);
		expect(s.textareaPaddingY).toBe(11);
	});
});

// Verifies components actually consume the tokens (closes the "defined but
// unconsumed" gap). Variant builders return the class string statically, so we
// can assert token references without rendering.
describe('component variants consume their tokens', () => {
	it('button reads padding, gap, and the hover easing token', () => {
		const cls = button({ variant: 'primary', size: 'default' });
		expect(cls).toContain('var(--button-padding-x)');
		expect(cls).toContain('var(--button-gap)');
		expect(cls).toContain('var(--motion-easing-hover');
	});

	it('button sm/lg derive padding from the themed base (no longer shadow it)', () => {
		const sm = button({ variant: 'primary', size: 'sm' });
		const lg = button({ variant: 'primary', size: 'lg' });
		expect(sm).toContain('calc(var(--button-padding-x)');
		expect(lg).toContain('calc(var(--button-padding-x)');
	});

	it('input/textarea read the vertical field padding token', () => {
		const cls = input({ variant: 'primary' });
		expect(cls).toContain('var(--field-padding-y)');
	});
});

describe('themeToTypeScriptPreset', () => {
	it('returns a string containing a TS module', () => {
		const ts = themeToTypeScriptPreset(defaultPreset);
		expect(typeof ts).toBe('string');
		expect(ts).toContain('import type');
		expect(ts).toContain('ThemeDraft');
		expect(ts).toContain('export const preset');
	});

	it('serializes the theme name', () => {
		const ts = themeToTypeScriptPreset({
			...defaultPreset,
			name: 'My Custom Theme'
		});
		expect(ts).toContain('My Custom Theme');
	});

	it('produces output that re-parses to equivalent structural shape', () => {
		const ts = themeToTypeScriptPreset(defaultPreset);
		expect(ts).toContain(defaultPreset.slug);
		// fontSans contains double quotes (e.g. '"IBM Plex Sans", sans-serif'), so the
		// serializer JSON-escapes them; assert against the escaped form it actually emits.
		expect(ts).toContain(JSON.stringify(defaultPreset.fontSans));
	});
});

describe('contrastRatio', () => {
	it('returns 21 for black on white', () => {
		expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 5);
	});

	it('returns 1 for identical colors', () => {
		expect(contrastRatio('#2563eb', '#2563eb')).toBeCloseTo(1, 5);
	});

	it('is symmetric in its arguments', () => {
		expect(contrastRatio('#2563eb', '#ffffff')).toBeCloseTo(
			contrastRatio('#ffffff', '#2563eb'),
			10
		);
	});

	it('matches the WCAG reference value for #767676 on white', () => {
		// 4.54:1 is the canonical "just passes AA" gray.
		expect(contrastRatio('#767676', '#ffffff')).toBeCloseTo(4.54, 2);
	});

	it('stays within the 1-21 bounds for arbitrary colors', () => {
		const samples = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#123456', '#fedcba'];
		for (const a of samples) {
			for (const b of samples) {
				const ratio = contrastRatio(a, b);
				expect(ratio).toBeGreaterThanOrEqual(1);
				expect(ratio).toBeLessThanOrEqual(21);
			}
		}
	});

	it('matches the button-foreground pick from generatePaletteFromBase', () => {
		// The palette generator chooses white button text on a dark primary via
		// the same luminance math; the resulting pair passes WCAG AA.
		const palette = generatePaletteFromBase(
			{ background: '#ffffff', card: '#ffffff', text: '#111111', primary: '#2563eb' },
			'light'
		);
		expect(palette.foregroundButton).toBe('#ffffff');
		expect(contrastRatio(palette.foregroundButton, palette.primary)).toBeGreaterThanOrEqual(4.5);
	});
});
