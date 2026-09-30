import type {
    InteractiveCursor,
    Theme,
    ThemeChrome,
    ThemeFontWeight,
    ThemeTokenOverrides
} from '@sivir-ui/svelte/themes/theme';
import {
    type AnimationTokenName,
    animationTokenDefinitions,
    type ColorTokenName,
    colorTokenDefinitions,
    type DetailTokenName,
    detailTokenDefinitions,
    type SpacingTokenName,
    spacingTokenDefinitions
} from '$lib/studio-advanced-tokens';

export type FoundationPalette = {
    base: string;
    border: string;
    background: string;
    secondary: string;
    foreground: string;
    foregroundMuted: string;
    onPrimary: string;
    buttonForeground: string;
};

export type FoundationColors = {
    light: FoundationPalette;
    dark: FoundationPalette;
};

export type BrandColors = {
    light: string;
    dark: string;
};

export type RoleWeights = {
    body: ThemeFontWeight;
    label: ThemeFontWeight;
    button: ThemeFontWeight;
    badge: ThemeFontWeight;
    description: ThemeFontWeight;
};

export type AdvancedTokens = {
    colors: Record<'light' | 'dark', Partial<Record<ColorTokenName, string>>>;
    spacing: Partial<Record<SpacingTokenName, string>>;
    animation: Partial<Record<AnimationTokenName, string>>;
    details: Record<'light' | 'dark' | 'shared', Partial<Record<DetailTokenName, string>>>;
};

export type StudioChrome = {
    surfaceShadows: boolean;
    controlShadows: boolean;
    dialogShadows: boolean;
    travelingHighlight: boolean;
    menuPaneling: boolean;
    surfacePaneling: boolean;
    primaryStroke: boolean;
    interactiveCursor: InteractiveCursor;
};

/** Every Studio control, projected from (and serialized back to) one portable Theme. */
export type StudioDraft = {
    theme: Theme;
    brandColors: BrandColors;
    foundationColors: FoundationColors;
    headerSize: number;
    headerWeight: ThemeFontWeight;
    roleWeights: RoleWeights;
    advancedTokens: AdvancedTokens;
    extraTokens: ThemeTokenOverrides;
    chrome: StudioChrome;
};

export const HEADER_SIZE_RANGE = {
    min: 12,
    max: 32,
    fallback: 16
} as const;

export const DEFAULT_HEADER_WEIGHT: ThemeFontWeight = '600';

export const DEFAULT_FOUNDATION_COLORS: FoundationColors = {
    light: {
        base: '#ffffff',
        border: '#e8e8e6',
        background: '#fdfdfc',
        secondary: '#efefee',
        foreground: '#1c1c1b',
        foregroundMuted: '#737373',
        onPrimary: '#ffffff',
        buttonForeground: '#1c1c1b'
    },
    dark: {
        base: '#171717',
        border: '#2a2a2a',
        background: '#0a0a0a',
        secondary: '#252525',
        foreground: '#ededed',
        foregroundMuted: '#a3a3a3',
        onPrimary: '#ffffff',
        buttonForeground: '#ededed'
    }
};

export const DEFAULT_ROLE_WEIGHTS: RoleWeights = {
    body: '400',
    label: '500',
    button: '500',
    badge: '500',
    description: '400'
};

const colorTokenNames: ReadonlySet<string> = new Set(
    colorTokenDefinitions.map((definition) => definition.name)
);
const spacingTokenNames: ReadonlySet<string> = new Set(
    spacingTokenDefinitions.map((definition) => definition.name)
);
const animationTokenNames: ReadonlySet<string> = new Set(
    animationTokenDefinitions.map((definition) => definition.name)
);
const modeDetailTokenNames: ReadonlySet<string> = new Set(
    detailTokenDefinitions
        .filter((definition) => definition.scope === 'mode')
        .map((definition) => definition.name)
);
const sharedDetailTokenNames: ReadonlySet<string> = new Set(
    detailTokenDefinitions
        .filter((definition) => definition.scope !== 'mode')
        .map((definition) => definition.name)
);

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

export function emptyAdvancedTokens(): AdvancedTokens {
    return {
        colors: {
            light: {},
            dark: {}
        },
        spacing: {},
        animation: {},
        details: {
            light: {},
            dark: {},
            shared: {}
        }
    };
}

export function clampHeaderSize(value: number): number {
    if (!Number.isFinite(value)) {
        return HEADER_SIZE_RANGE.fallback;
    }

    return Math.min(HEADER_SIZE_RANGE.max, Math.max(HEADER_SIZE_RANGE.min, Math.round(value)));
}

function brandTokens(color: string): Record<string, string> {
    return {
        '--color-primary': color,
        '--color-primary-hover': `color-mix(in srgb, ${color} 78%, black)`,
        '--color-ring': `color-mix(in srgb, ${color} 30%, transparent)`
    };
}

function filledEntries(map: Partial<Record<string, string>>): Record<string, string> {
    const filled: Record<string, string> = {};

    for (const [name, value] of Object.entries(map)) {
        const trimmed = value?.trim();
        if (trimmed) {
            filled[name] = trimmed;
        }
    }

    return filled;
}

function nonEmpty(map: Record<string, string>): Record<string, string> | undefined {
    return Object.keys(map).length > 0 ? map : undefined;
}

function toChrome(chrome: StudioChrome): ThemeChrome {
    return {
        surfaceShadows: chrome.surfaceShadows,
        controlShadows: chrome.controlShadows,
        dialogShadows: chrome.dialogShadows,
        ...(chrome.travelingHighlight
            ? {}
            : {
                  travelingHighlight: false as const
              }),
        ...(chrome.menuPaneling
            ? {}
            : {
                  menuPaneling: false
              }),
        ...(chrome.surfacePaneling
            ? {}
            : {
                  surfacePaneling: false
              }),
        primaryStroke: chrome.primaryStroke,
        interactiveCursor: chrome.interactiveCursor
    };
}

function fromChrome(chrome: ThemeChrome | undefined): StudioChrome {
    const shadows = chrome?.shadows !== false;

    return {
        surfaceShadows: shadows && chrome?.surfaceShadows !== false,
        controlShadows: shadows && chrome?.controlShadows !== false,
        dialogShadows: shadows && chrome?.dialogShadows !== false,
        travelingHighlight: chrome?.travelingHighlight !== false,
        menuPaneling: chrome?.menuPaneling !== false,
        surfacePaneling: chrome?.surfacePaneling !== false,
        primaryStroke: chrome?.primaryStroke === true,
        interactiveCursor: chrome?.interactiveCursor ?? 'default'
    };
}

/** The theme's identity and axes, without the optional sections the Studio owns. */
export function themeAxes(theme: Theme): Theme {
    return {
        version: theme.version,
        slug: theme.slug,
        name: theme.name,
        description: theme.description,
        ...(theme.publisher
            ? {
                  publisher: theme.publisher
              }
            : {}),
        brand: theme.brand,
        neutral: theme.neutral,
        radius: theme.radius,
        density: theme.density,
        motion: theme.motion,
        fontSans: theme.fontSans,
        fontMono: theme.fontMono,
        fontHeader: theme.fontHeader
    };
}

/** Serializes Studio state to the portable Theme that CSS, JSON, and publishing share. */
export function draftToTheme(draft: StudioDraft): Theme {
    const darkBrand =
        draft.brandColors.dark.toLowerCase() === draft.brandColors.light.toLowerCase()
            ? {}
            : brandTokens(draft.brandColors.dark);
    const shared = nonEmpty({
        ...draft.extraTokens.shared,
        ...filledEntries(draft.advancedTokens.spacing),
        ...filledEntries(draft.advancedTokens.animation),
        ...filledEntries(draft.advancedTokens.details.shared)
    });
    const light = nonEmpty({
        ...draft.extraTokens.light,
        ...filledEntries(draft.advancedTokens.colors.light),
        ...filledEntries(draft.advancedTokens.details.light)
    });
    const dark = nonEmpty({
        ...draft.extraTokens.dark,
        ...darkBrand,
        ...filledEntries(draft.advancedTokens.colors.dark),
        ...filledEntries(draft.advancedTokens.details.dark)
    });
    const tokens: ThemeTokenOverrides = {
        ...(shared
            ? {
                  shared
              }
            : {}),
        ...(light
            ? {
                  light
              }
            : {}),
        ...(dark
            ? {
                  dark
              }
            : {})
    };

    return {
        ...themeAxes(draft.theme),
        brand: draft.brandColors.light.toLowerCase(),
        foundation: {
            light: {
                ...draft.foundationColors.light
            },
            dark: {
                ...draft.foundationColors.dark
            }
        },
        ...(shared || light || dark
            ? {
                  tokens
              }
            : {}),
        typography: {
            headerSize: clampHeaderSize(draft.headerSize),
            headerWeight: draft.headerWeight,
            roleWeights: {
                ...draft.roleWeights
            }
        },
        chrome: toChrome(draft.chrome)
    };
}

function splitSharedTokens(shared: Record<string, string> | undefined) {
    const spacing: AdvancedTokens['spacing'] = {};
    const animation: AdvancedTokens['animation'] = {};
    const details: Partial<Record<DetailTokenName, string>> = {};
    const extra: Record<string, string> = {};

    for (const [name, value] of Object.entries(shared ?? {})) {
        if (spacingTokenNames.has(name)) {
            spacing[name as SpacingTokenName] = value;
        } else if (animationTokenNames.has(name)) {
            animation[name as AnimationTokenName] = value;
        } else if (sharedDetailTokenNames.has(name)) {
            details[name as DetailTokenName] = value;
        } else {
            extra[name] = value;
        }
    }

    return {
        spacing,
        animation,
        details,
        extra
    };
}

function splitModeTokens(map: Record<string, string> | undefined) {
    const colors: Partial<Record<ColorTokenName, string>> = {};
    const details: Partial<Record<DetailTokenName, string>> = {};
    const extra: Record<string, string> = {};

    for (const [name, value] of Object.entries(map ?? {})) {
        if (colorTokenNames.has(name)) {
            colors[name as ColorTokenName] = value;
        } else if (modeDetailTokenNames.has(name)) {
            details[name as DetailTokenName] = value;
        } else {
            extra[name] = value;
        }
    }

    return {
        colors,
        details,
        extra
    };
}

function takeDarkBrand(dark: Record<string, string>, fallback: string): string {
    const primary = dark['--color-primary'];
    if (!primary || !HEX_COLOR.test(primary)) {
        return fallback;
    }

    const derived = brandTokens(primary);
    const names = Object.keys(derived);
    if (!names.every((name) => dark[name] === derived[name])) {
        return fallback;
    }

    for (const name of names) {
        delete dark[name];
    }

    return primary.toLowerCase();
}

/** Projects a portable Theme onto Studio controls; tokens the Studio has no control for are kept. */
export function themeToDraft(theme: Theme): StudioDraft {
    const sharedTokens = splitSharedTokens(theme.tokens?.shared);
    const lightTokens = splitModeTokens(theme.tokens?.light);
    const darkTokens = splitModeTokens(theme.tokens?.dark);
    const darkColors: Record<string, string> = {
        ...darkTokens.colors
    };
    const darkBrand = takeDarkBrand(darkColors, theme.brand);

    return {
        theme: themeAxes(theme),
        brandColors: {
            light: theme.brand,
            dark: darkBrand
        },
        foundationColors: {
            light: {
                ...DEFAULT_FOUNDATION_COLORS.light,
                ...theme.foundation?.light
            },
            dark: {
                ...DEFAULT_FOUNDATION_COLORS.dark,
                ...theme.foundation?.dark
            }
        },
        headerSize: clampHeaderSize(theme.typography?.headerSize ?? HEADER_SIZE_RANGE.fallback),
        headerWeight: theme.typography?.headerWeight ?? DEFAULT_HEADER_WEIGHT,
        roleWeights: {
            ...DEFAULT_ROLE_WEIGHTS,
            ...theme.typography?.roleWeights
        },
        advancedTokens: {
            colors: {
                light: lightTokens.colors,
                dark: darkColors
            },
            spacing: sharedTokens.spacing,
            animation: sharedTokens.animation,
            details: {
                light: lightTokens.details,
                dark: darkTokens.details,
                shared: sharedTokens.details
            }
        },
        extraTokens: {
            ...(nonEmpty(sharedTokens.extra)
                ? {
                      shared: sharedTokens.extra
                  }
                : {}),
            ...(nonEmpty(lightTokens.extra)
                ? {
                      light: lightTokens.extra
                  }
                : {}),
            ...(nonEmpty(darkTokens.extra)
                ? {
                      dark: darkTokens.extra
                  }
                : {})
        },
        chrome: fromChrome(theme.chrome)
    };
}

function stableStringify(value: unknown): string {
    if (Array.isArray(value)) {
        return `[${value.map(stableStringify).join(',')}]`;
    }

    if (typeof value === 'object' && value !== null) {
        const entries = Object.entries(value)
            .filter((entry) => entry[1] !== undefined)
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([key, entry]) => `${JSON.stringify(key)}:${stableStringify(entry)}`);

        return `{${entries.join(',')}}`;
    }

    return JSON.stringify(value);
}

/** Compares two themes by what they render, ignoring identity fields and key order. */
export function sameThemeDesign(left: Theme, right: Theme): boolean {
    const design = (theme: Theme) => {
        const {
            slug: _slug,
            name: _name,
            description: _description,
            publisher: _publisher,
            version: _version,
            ...rest
        } = theme;

        return stableStringify(rest);
    };

    return design(left) === design(right);
}
