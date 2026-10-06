import { builtInThemePresets } from '@sivir-ui/svelte/themes/builtin-presets';
import { parseTheme, themeToCss } from '@sivir-ui/svelte/themes/theme';
import { describe, expect, it } from 'vitest';

describe('builtInThemePresets', () => {
    it('ships a valid, unique version-2 catalog led by the Sivir theme', () => {
        expect(builtInThemePresets[0].slug).toBe('sivir');
        expect(builtInThemePresets.length).toBeGreaterThan(1);
        expect(new Set(builtInThemePresets.map((theme) => theme.slug)).size).toBe(
            builtInThemePresets.length
        );
        for (const theme of builtInThemePresets) expect(parseTheme(theme)).toEqual(theme);
    });
});

describe('chrome.triggerDistance', () => {
    const base = builtInThemePresets[0];

    it('emits the distance token and validates the 0 to 16 range', () => {
        const themed = { ...base, chrome: { ...base.chrome, triggerDistance: 12 } };

        expect(parseTheme(themed).chrome?.triggerDistance).toBe(12);
        expect(themeToCss(themed)).toContain('--menu-trigger-distance: 12px;');
        expect(() => {
            parseTheme({ ...base, chrome: { triggerDistance: 17 } });
        }).toThrow('chrome.triggerDistance');
        expect(() => {
            parseTheme({ ...base, chrome: { triggerDistance: '8' } });
        }).toThrow('chrome.triggerDistance');
    });

    it('omits the token when the theme does not set it', () => {
        expect(themeToCss(base)).not.toContain('--menu-trigger-distance');
    });
});
