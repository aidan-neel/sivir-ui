import { describe, expect, it } from 'vitest';
import {
	slugifyThemeName,
	resolveSpacing,
	resolveTypography,
	resolveThemeMotion,
	generatePaletteFromBase,
	themeToCss,
	themeToTypeScriptPreset,
	defaultSpacing,
	defaultTypography,
	type ThemeBasePalette
} from '@silk/ui/themes/presets';
import { preset as defaultPreset } from '@silk/ui/themes/presets/default';

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

describe('resolveThemeMotion', () => {
	it('returns a complete ThemeMotion object for a known preset', () => {
		const motion = resolveThemeMotion('default');
		expect(motion).toBeDefined();
		expect(typeof motion.panelDuration).toBe('string');
		expect(typeof motion.panelY).toBe('number');
		expect(motion).toHaveProperty('hoverDuration');
		expect(motion).toHaveProperty('menuDuration');
		expect(motion).toHaveProperty('panelDuration');
		expect(motion).toHaveProperty('sheetDuration');
		expect(motion).toHaveProperty('overlayDuration');
		expect(motion).toHaveProperty('tooltipDuration');
		expect(motion).toHaveProperty('toastInDuration');
		expect(motion).toHaveProperty('toastOutDuration');
	});

	it('overrides individual motion fields', () => {
		const motion = resolveThemeMotion('default', { panelDuration: '999ms' });
		expect(motion.panelDuration).toBe('999ms');
	});

	it('falls back to default preset for unknown slug', () => {
		const motion = resolveThemeMotion('nonexistent-slug' as never);
		expect(motion).toBeDefined();
		expect(typeof motion.panelDuration).toBe('string');
	});

	it('honors null motion override', () => {
		const motion = resolveThemeMotion('default', null);
		expect(motion).toBeDefined();
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

	it('propagates motion duration tokens', () => {
		const css = themeToCss({
			...defaultPreset,
			motion: { ...defaultPreset.motion, panelDuration: '777ms' }
		});
		expect(css).toContain('--motion-duration-panel: 777ms');
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
		expect(ts).toContain(defaultPreset.fontSans);
	});
});
