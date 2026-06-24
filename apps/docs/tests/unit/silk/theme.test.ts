import { describe, expect, it } from 'vitest';
import { DEFAULT_THEME, themeToCss } from '@silk/ui/themes/theme';

describe('DEFAULT_THEME', () => {
	it('uses Inter, soft blue brand, default scales', () => {
		expect(DEFAULT_THEME.fontSans).toBe('Inter');
		expect(DEFAULT_THEME.brand).toBe('#4a8cff');
		expect(DEFAULT_THEME.radius).toBe('default');
		expect(DEFAULT_THEME.density).toBe('default');
		expect(DEFAULT_THEME.motion).toBe('default');
	});
});

describe('themeToCss', () => {
	const css = themeToCss(DEFAULT_THEME);
	it('emits a :root, .dark shared block with fonts, radii, brand ramp, motion', () => {
		expect(css).toContain('--font-sans: Inter');
		expect(css).toContain('--radius-lg: 8px');
		expect(css).toContain('--silk-blue-500: #4a8cff');
		expect(css).toContain('--silk-space-unit: 4px');
		expect(css).toContain('--motion-duration-panel: 180ms');
	});
	it('derives the brand ramp via oklch from the brand hex', () => {
		const c = themeToCss({ ...DEFAULT_THEME, brand: '#22cc88' });
		expect(c).toContain('--silk-blue-500: #22cc88');
		expect(c).toContain('--silk-blue-600: oklch(from #22cc88');
		expect(c).toContain('--silk-blue-ring: oklch(from #22cc88 l c h / 0.4)');
	});
	it('maps radius preset "sharp" to the sharp scale', () => {
		expect(themeToCss({ ...DEFAULT_THEME, radius: 'sharp' })).toContain('--radius-lg: 4px');
	});
	it('maps density "compact" to a smaller space unit', () => {
		expect(themeToCss({ ...DEFAULT_THEME, density: 'compact' })).toContain(
			'--silk-space-unit: 3.5px'
		);
	});
	it('maps motion "none" to zeroed durations', () => {
		expect(themeToCss({ ...DEFAULT_THEME, motion: 'none' })).toContain(
			'--motion-duration-panel: 0ms'
		);
	});
	it('emits a true-gray neutral override only for non-cool temperatures', () => {
		expect(themeToCss(DEFAULT_THEME)).not.toContain('color-mix(in srgb, #e2e2df'); // cool => no override
		const warm = themeToCss({ ...DEFAULT_THEME, neutral: 'warm' });
		expect(warm).toContain('--silk-neutral-200:');
	});
});
