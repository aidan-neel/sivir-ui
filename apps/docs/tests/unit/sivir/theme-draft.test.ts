import { builtInThemePresets } from '@sivir-ui/svelte/themes/builtin-presets';
import { DEFAULT_THEME, parseTheme, type Theme, themeToCss } from '@sivir-ui/svelte/themes/theme';
import { describe, expect, it } from 'vitest';
import {
    DEFAULT_FOUNDATION_COLORS,
    draftToTheme,
    HEADER_SIZE_RANGE,
    sameThemeDesign,
    themeToDraft
} from '$lib/studio/theme-draft';
import { themePreviewCss } from '$lib/theme-registry';

describe('Theme Studio draft', () => {
    it('exports a portable theme that parseTheme accepts for every preset', () => {
        for (const preset of builtInThemePresets) {
            const exported = draftToTheme(themeToDraft(preset));

            expect(parseTheme(exported)).toEqual(exported);
            expect(() => themeToCss(exported)).not.toThrow();
        }
    });

    it('round-trips a theme through the Studio controls without design changes', () => {
        for (const preset of builtInThemePresets) {
            const once = draftToTheme(themeToDraft(preset));
            const twice = draftToTheme(themeToDraft(once));

            expect(sameThemeDesign(once, twice)).toBe(true);
        }
    });

    it('keeps preset foundation colors instead of the Studio defaults', () => {
        const magic = builtInThemePresets.find((preset) => preset.slug === 'magic');
        expect(magic?.foundation?.light?.border).toBeDefined();

        const draft = themeToDraft(magic as Theme);

        expect(draft.foundationColors.light.border).toBe(magic?.foundation?.light?.border);
        expect(draft.foundationColors.light.foreground).toBe(
            DEFAULT_FOUNDATION_COLORS.light.foreground
        );
    });

    it('maps preset radius tokens onto the editable spacing controls', () => {
        const magic = builtInThemePresets.find((preset) => preset.slug === 'magic') as Theme;
        const draft = themeToDraft(magic);

        expect(draft.advancedTokens.spacing['--radius-lg']).toBe(
            magic.tokens?.shared?.['--radius-lg']
        );
        expect(draft.extraTokens.shared).toBeUndefined();
    });

    it('exports a distinct dark brand as dark primary tokens and reads it back', () => {
        const draft = themeToDraft(DEFAULT_THEME);
        const exported = draftToTheme({
            ...draft,
            brandColors: {
                light: '#1e78e6',
                dark: '#7457d9'
            }
        });

        expect(exported.brand).toBe('#1e78e6');
        expect(exported.tokens?.dark?.['--color-primary']).toBe('#7457d9');
        expect(themeToDraft(exported).brandColors.dark).toBe('#7457d9');
        expect(themeToDraft(exported).advancedTokens.colors.dark).toEqual({});
    });

    it('maps detail tokens onto the Studio detail controls and back', () => {
        const theme: Theme = {
            ...DEFAULT_THEME,
            tokens: {
                shared: {
                    '--opacity-disabled': '0.4'
                },
                light: {
                    '--elevation-1': 'none'
                },
                dark: {
                    '--focus-ring': '0 0 0 2px #ffffff'
                }
            }
        };
        const draft = themeToDraft(theme);
        const exported = draftToTheme(draft);

        expect(draft.advancedTokens.details).toEqual({
            shared: {
                '--opacity-disabled': '0.4'
            },
            light: {
                '--elevation-1': 'none'
            },
            dark: {
                '--focus-ring': '0 0 0 2px #ffffff'
            }
        });
        expect(draft.extraTokens).toEqual({});
        expect(exported.tokens).toEqual(theme.tokens);
    });

    it('preserves tokens the Studio has no control for', () => {
        const theme: Theme = {
            ...DEFAULT_THEME,
            tokens: {
                shared: {
                    '--custom-gap': '3px'
                },
                dark: {
                    '--custom-glow': '#ffffff'
                }
            }
        };
        const exported = draftToTheme(themeToDraft(theme));

        expect(exported.tokens?.shared?.['--custom-gap']).toBe('3px');
        expect(exported.tokens?.dark?.['--custom-glow']).toBe('#ffffff');
    });

    it('clamps the header size to the theme contract', () => {
        const draft = themeToDraft(DEFAULT_THEME);
        const exported = draftToTheme({
            ...draft,
            headerSize: 48
        });

        expect(exported.typography?.headerSize).toBe(HEADER_SIZE_RANGE.max);
    });

    it('ignores identity when comparing designs', () => {
        const exported = draftToTheme(themeToDraft(DEFAULT_THEME));

        expect(
            sameThemeDesign(exported, {
                ...exported,
                slug: 'renamed',
                name: 'Renamed'
            })
        ).toBe(true);
        expect(
            sameThemeDesign(exported, {
                ...exported,
                radius: 'sharp'
            })
        ).toBe(false);
    });
});

describe('themePreviewCss', () => {
    it('raises every theme selector by one element without touching declarations', () => {
        const css = themePreviewCss(
            themeToCss({
                ...DEFAULT_THEME,
                foundation: {
                    light: {
                        base: '#ffffff'
                    }
                }
            })
        );

        expect(css).toContain('html:root,\nhtml.dark {');
        expect(css).toContain('html:root:not(.dark) {');
        expect(css).toContain('\nhtml.dark {');
        expect(css).not.toMatch(/^:root/m);
        expect(css).not.toMatch(/^\.dark/m);
    });
});
