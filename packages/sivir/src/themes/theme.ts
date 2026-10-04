export const THEME_VERSION = 4 as const;

/** Versions accepted by parseTheme. Older theme payloads keep working. */
export const SUPPORTED_THEME_VERSIONS = [2, 3, 4] as const;

export type SupportedThemeVersion = (typeof SUPPORTED_THEME_VERSIONS)[number];

export const neutralTemperatures = ['cool', 'true', 'warm'] as const;
export const radiusScales = ['none', 'sharp', 'default', 'rounded'] as const;
export const densities = ['compact', 'default', 'comfortable'] as const;
export const motionFeels = ['none', 'subtle', 'default', 'expressive'] as const;
export const themeFontWeights = ['400', '500', '600', '700'] as const;
export const interactiveCursors = ['default', 'pointer'] as const;

export type NeutralTemp = (typeof neutralTemperatures)[number];
export type RadiusScale = (typeof radiusScales)[number];
export type Density = (typeof densities)[number];
export type MotionFeel = (typeof motionFeels)[number];
export type ThemeFontWeight = (typeof themeFontWeights)[number];
export type InteractiveCursor = (typeof interactiveCursors)[number];

export type ThemeFoundationPalette = {
    base?: string;
    border?: string;
    background?: string;
    secondary?: string;
    foreground?: string;
    foregroundMuted?: string;
    onPrimary?: string;
    buttonForeground?: string;
};

export type ThemeFoundation = {
    light?: ThemeFoundationPalette;
    dark?: ThemeFoundationPalette;
};

export type ThemeTokenOverrides = {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    shared?: Record<string, string>;
};

export type ThemeRoleWeights = {
    body?: ThemeFontWeight;
    label?: ThemeFontWeight;
    button?: ThemeFontWeight;
    badge?: ThemeFontWeight;
    description?: ThemeFontWeight;
};

export type ThemeTypography = {
    headerSize?: number;
    headerWeight?: ThemeFontWeight;
    roleWeights?: ThemeRoleWeights;
};

export type ThemeChrome = {
    shadows?: boolean;
    /** Shadows on cards, floating menus, and other surfaces (`--elevation-1`, `--elevation-float`). */
    surfaceShadows?: boolean;
    /** Shadows on inputs, buttons, and similar controls (`--elevation-control`, `--elevation-button-outline`). */
    controlShadows?: boolean;
    /** Shadows on dialogs and sheets (`--elevation-modal`). */
    dialogShadows?: boolean;
    /** Keeps the item highlight but disables the slide between items. */
    travelingHighlight?: false;
    /** Set `false` to swap icons and labels with a plain crossfade, dropping the blur, scale, rotation, and slide. */
    fancySwap?: false;
    /** Set `false` for plain 1px-border menus: drops the inset frame around dropdown, context, select, and combobox menus. */
    menuPaneling?: boolean;
    /** Set `false` to make modals, sheets, popovers, cards, and code blocks a single continuous container instead of an inset surface inside a frame. */
    surfacePaneling?: boolean;
    primaryStroke?: boolean;
    interactiveCursor?: InteractiveCursor;
};

/** The single, versioned public authoring contract for Sivir themes. */
export type Theme = {
    version: SupportedThemeVersion;
    slug: string;
    name: string;
    description: string;
    publisher?: string;
    /** Primary/accent color as a six-digit hex value. */
    brand: string;
    neutral: NeutralTemp;
    radius: RadiusScale;
    density: Density;
    motion: MotionFeel;
    /** CSS font-family values, including fallbacks when desired. */
    fontSans: string;
    fontMono: string;
    fontHeader: string;
    /** Optional per-mode surface colors. Mirrors the Studio foundation section. */
    foundation?: ThemeFoundation;
    /** Optional raw token overrides keyed by CSS custom property name. */
    tokens?: ThemeTokenOverrides;
    /** Optional type-scale overrides. Mirrors the Studio typography section. */
    typography?: ThemeTypography;
    /** Optional chrome flags. Mirrors the Studio chrome section. */
    chrome?: ThemeChrome;
};

export type ThemeRecord = Theme & {
    id: string;
    createdAt: string;
    updatedAt: string;
};

/** Matches the public axes baked into ui.css exactly. */
export const DEFAULT_THEME: Theme = {
    version: THEME_VERSION,
    slug: 'legacy',
    name: 'Legacy',
    description: 'Original Sivir defaults — a calm, warm-neutral interface system.',
    publisher: 'Sivir UI',
    brand: '#1e78e6',
    neutral: 'warm',
    radius: 'default',
    density: 'default',
    motion: 'default',
    fontSans: "'Inter', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    fontHeader: 'var(--font-sans)'
};

const RADII: Record<RadiusScale, readonly [string, string, string, string]> = {
    none: ['0px', '0px', '0px', '0px'],
    sharp: ['2px', '4px', '6px', '8px'],
    default: ['6px', '8px', '10px', '14px'],
    rounded: ['10px', '14px', '18px', '24px']
};

const DENSITY_UNIT: Record<Density, string> = {
    compact: '3.2px',
    default: '3.6px',
    comfortable: '4px'
};

type MotionSet = {
    hover: string;
    menu: string;
    panel: string;
    sheet: string;
    overlay: string;
    toastIn: string;
    toastOut: string;
    stepIn: string;
    stepOut: string;
    swapScale: string;
    swapRotate: string;
    swapY: string;
};

const MOTION: Record<MotionFeel, MotionSet> = {
    none: {
        hover: '0ms',
        menu: '0ms',
        panel: '0ms',
        sheet: '0ms',
        overlay: '0ms',
        toastIn: '0ms',
        toastOut: '0ms',
        stepIn: '0ms',
        stepOut: '0ms',
        swapScale: '1',
        swapRotate: '0deg',
        swapY: '0px'
    },
    subtle: {
        hover: '90ms',
        menu: '30ms',
        panel: '130ms',
        sheet: '220ms',
        overlay: '90ms',
        toastIn: '240ms',
        toastOut: '180ms',
        stepIn: '260ms',
        stepOut: '100ms',
        swapScale: '0.75',
        swapRotate: '45deg',
        swapY: '2px'
    },
    default: {
        hover: '120ms',
        menu: '40ms',
        panel: '180ms',
        sheet: '320ms',
        overlay: '120ms',
        toastIn: '320ms',
        toastOut: '240ms',
        stepIn: '360ms',
        stepOut: '130ms',
        swapScale: '0.5',
        swapRotate: '90deg',
        swapY: '3px'
    },
    expressive: {
        hover: '180ms',
        menu: '120ms',
        panel: '260ms',
        sheet: '400ms',
        overlay: '160ms',
        toastIn: '400ms',
        toastOut: '300ms',
        stepIn: '460ms',
        stepOut: '170ms',
        swapScale: '0.25',
        swapRotate: '120deg',
        swapY: '5px'
    }
};

const NEUTRAL_STEPS = [0, 10, 50, 100, 150, 300, 500, 900] as const;
type NeutralRamp = Record<(typeof NEUTRAL_STEPS)[number], string>;

// Immutable source values keep generated declarations acyclic in every mode.
const NEUTRALS: Record<NeutralTemp, { light: NeutralRamp; dark: NeutralRamp }> = {
    warm: {
        light: {
            0: 'hsl(0 0% 100%)',
            10: 'hsl(60 11.1% 99.2%)',
            50: 'hsl(60 11.1% 96.5%)',
            100: 'hsl(60 6.2% 93.7%)',
            150: 'hsl(60 4.2% 90.6%)',
            300: 'hsl(60 4.4% 82.4%)',
            500: 'hsl(60 3% 41.5%)',
            900: 'hsl(60 5.7% 10.4%)'
        },
        dark: {
            0: 'hsl(0 0% 5%)',
            10: 'hsl(60 11.1% 7%)',
            50: 'hsl(0 0% 10%)',
            100: 'hsl(0 0% 13%)',
            150: 'hsl(0 0% 15.7%)',
            300: 'hsl(0 0% 22.7%)',
            500: 'hsl(0 0% 65%)',
            900: 'hsl(0 0% 93%)'
        }
    },
    true: {
        light: {
            0: 'hsl(0 0% 100%)',
            10: 'hsl(0 0% 99%)',
            50: 'hsl(0 0% 96%)',
            100: 'hsl(0 0% 93%)',
            150: 'hsl(0 0% 90%)',
            300: 'hsl(0 0% 82%)',
            500: 'hsl(0 0% 42%)',
            900: 'hsl(0 0% 10%)'
        },
        dark: {
            0: 'hsl(0 0% 5%)',
            10: 'hsl(0 0% 7%)',
            50: 'hsl(0 0% 10%)',
            100: 'hsl(0 0% 13%)',
            150: 'hsl(0 0% 16%)',
            300: 'hsl(0 0% 23%)',
            500: 'hsl(0 0% 65%)',
            900: 'hsl(0 0% 93%)'
        }
    },
    cool: {
        light: {
            0: 'hsl(220 20% 100%)',
            10: 'hsl(220 20% 99%)',
            50: 'hsl(220 16% 96%)',
            100: 'hsl(220 14% 93%)',
            150: 'hsl(220 12% 90%)',
            300: 'hsl(220 10% 81%)',
            500: 'hsl(220 8% 42%)',
            900: 'hsl(220 12% 10%)'
        },
        dark: {
            0: 'hsl(220 12% 5%)',
            10: 'hsl(220 12% 7%)',
            50: 'hsl(220 11% 10%)',
            100: 'hsl(220 10% 13%)',
            150: 'hsl(220 9% 16%)',
            300: 'hsl(220 8% 23%)',
            500: 'hsl(220 7% 65%)',
            900: 'hsl(220 10% 93%)'
        }
    }
};

function block(selector: string, declarations: string[]): string {
    return `${selector} {\n${declarations.map((declaration) => `\t${declaration}`).join('\n')}\n}\n`;
}

function neutralDeclarations(ramp: NeutralRamp) {
    return NEUTRAL_STEPS.map((step) => `--sivir-neutral-${step}: ${ramp[step]};`);
}

function brandDeclarations(brand: string, mode: 'light' | 'dark') {
    const isDefault = brand.toLowerCase() === DEFAULT_THEME.brand;
    return [
        `--color-primary: ${brand};`,
        // Darken the brand itself so hover keeps its hue instead of shifting teal.
        `--color-primary-hover: color-mix(in srgb, ${brand} 78%, black);`,
        `--color-ring: color-mix(in srgb, ${brand} 30%, transparent);`,
        `--sivir-blue-500: ${
            isDefault
                ? mode === 'light'
                    ? 'hsl(212.2 100% 64.5%)'
                    : 'hsl(216.6 100% 67.8%)'
                : 'var(--color-primary)'
        };`,
        `--sivir-blue-50: ${
            isDefault
                ? mode === 'light'
                    ? 'hsl(218.8 100% 96.7%)'
                    : 'hsl(217.1 52.5% 15.7%)'
                : `color-mix(in srgb, var(--color-primary) 12%, ${mode === 'light' ? 'white' : 'black'})`
        };`
    ];
}

/** Scales a `Nms` motion token (keeps `0ms` as-is). */
function scaleMotionMs(value: string, factor: number): string {
    const n = Number.parseFloat(value);
    if (!Number.isFinite(n) || n === 0) {
        return value;
    }
    return `${Math.round(n * factor)}ms`;
}

const FOUNDATION_TOKEN_MAP = {
    base: ['--color-card', '--color-panel'],
    border: ['--color-border', '--color-input'],
    background: ['--color-background'],
    secondary: ['--color-secondary'],
    foreground: ['--color-foreground'],
    foregroundMuted: ['--color-foreground-muted'],
    onPrimary: ['--color-on-primary'],
    buttonForeground: ['--color-button-foreground']
} as const;

type FoundationPaletteKey = keyof typeof FOUNDATION_TOKEN_MAP;

function foundationDeclarations(palette: ThemeFoundationPalette): string[] {
    const declarations: string[] = [];
    const keys = Object.keys(FOUNDATION_TOKEN_MAP).sort() as FoundationPaletteKey[];
    for (const key of keys) {
        const value = palette[key];
        if (typeof value !== 'string' || value.trim() === '') {
            continue;
        }
        for (const token of FOUNDATION_TOKEN_MAP[key]) {
            declarations.push(`${token}: ${value.trim()};`);
        }
    }
    return declarations;
}

function tokenMapDeclarations(map: Record<string, string> | undefined): string[] {
    if (!map) {
        return [];
    }
    return Object.keys(map)
        .sort()
        .map((name) => `${name}: ${map[name].trim()};`);
}

function typographyDeclarations(typography: ThemeTypography | undefined): string[] {
    if (!typography) {
        return [];
    }
    const declarations: string[] = [];
    if (typeof typography.headerSize === 'number') {
        declarations.push(`--font-size-header: ${typography.headerSize}px;`);
    }
    if (typeof typography.headerWeight === 'string') {
        declarations.push(`--font-weight-header: ${typography.headerWeight};`);
    }
    const roles = typography.roleWeights;
    if (roles) {
        const roleKeys = ['body', 'label', 'button', 'badge', 'description'] as const;
        for (const role of roleKeys) {
            const weight = roles[role];
            if (typeof weight === 'string') {
                declarations.push(`--font-weight-${role}: ${weight};`);
            }
        }
    }
    return declarations;
}

/** Stylesheet that flattens menu frames into a single bordered container. */
export function menuPanelingOffCss(): string {
    return block(".sivir-menu-panel[data-ui='popover-content']", [
        '--sivir-modal-inset: 0px;',
        'background-color: var(--color-card);'
    ]);
}

/** Stylesheet that flattens modal, sheet, popover, card, and code block frames into one container. */
export function surfacePanelingOffCss(): string {
    return (
        block('.sivir-modal-frame,\n.sivir-inset-frame', [
            '--sivir-modal-inset: 0px;',
            'background-color: var(--color-card);'
        ]) +
        block(".sivir-modal-frame > [data-ui='modal-frame-header']", [
            'padding: calc(var(--spacing) * 5) calc(var(--spacing) * 5) 0;'
        ]) +
        block(".sivir-modal-frame > [data-ui='modal-frame-header'] + [data-ui='modal-surface']", [
            'padding-top: calc(var(--spacing) * 3);'
        ]) +
        block(
            ".sivir-modal-frame > [data-ui='modal-footer'],\n.sivir-modal-frame > [data-ui='card-footer']",
            ['padding: 0 calc(var(--spacing) * 5) calc(var(--spacing) * 5);']
        ) +
        block(
            ".sivir-modal-frame > [data-ui='modal-surface']:has(+ [data-ui='modal-footer']),\n.sivir-modal-frame > [data-ui='card-surface']:has(+ [data-ui='card-footer'])",
            ['padding-bottom: calc(var(--spacing) * 4);']
        ) +
        block(
            ".sivir-modal-frame > [data-ui='card-surface']:has(+ [data-ui='card-footer'] > [data-ui='question-actions'])",
            ['padding-bottom: 0;']
        ) +
        block(".sivir-modal-frame > [data-ui='card-footer']:has(> [data-ui='question-actions'])", [
            'padding: 0 calc(var(--spacing) * 3) calc(var(--spacing) * 3);'
        ]) +
        block(".sivir-modal-frame > [data-ui='card-footer'] > [data-ui='question-actions']", [
            'padding: 0;'
        ]) +
        block(".sivir-inset-frame [data-ui='code-block-header']", [
            'padding: calc(var(--spacing) * 1.5) calc(var(--spacing) * 2);'
        ]) +
        block(
            ".sivir-inset-frame [data-ui='code-block-header'],\n.sivir-inset-frame > [data-ui='file-diff-top-bar']",
            [
                'border-bottom: var(--border-size) solid var(--color-border);',
                'background-color: color-mix(in oklab, var(--color-foreground) 3%, var(--color-card));'
            ]
        ) +
        block(".sivir-inset-frame:where([data-ui='code-block'])", ['position: relative;']) +
        block(".sivir-inset-frame [data-ui='code-block-header']:not(:has([role='tablist']))", [
            'position: absolute;',
            'top: calc(var(--spacing) * 1.5);',
            'right: calc(var(--spacing) * 1.5);',
            'z-index: 1;',
            'width: auto;',
            'padding: 0;',
            'border-bottom: 0;',
            'background-color: transparent;'
        ]) +
        block('.sivir-inset-frame .sivir-inset-surface', ['border-radius: 0;']) +
        block('.sivir-card-frame', ['padding: 0;', 'background-color: var(--color-card);']) +
        block('.sivir-card-surface', ['box-shadow: var(--elevation-1);']) +
        commandPanelingOffCss()
    );
}

/** Flat command palette: top-anchored, wider, with a roomier search row and taller items. */
function commandPanelingOffCss(): string {
    const top = 'min(7.5rem, 14vh)';

    return (
        block(".sivir-modal-frame[data-ui='command-content']", [
            `top: calc(var(--sivir-viewport-top) + ${top});`,
            'translate: -50% 0;',
            'max-width: 41.25rem;',
            `max-height: min(32rem, calc(var(--sivir-viewport-height) - ${top} - var(--overlay-gutter)));`
        ]) +
        block("[data-ui='command-search']", [
            'height: calc(var(--spacing) * 13.5);',
            'gap: calc(var(--spacing) * 3);',
            'padding-inline: calc(var(--spacing) * 4.5);'
        ]) +
        block("[data-ui='command-search'] > svg", [
            'width: calc(var(--spacing) * 4);',
            'height: calc(var(--spacing) * 4);'
        ]) +
        block("[data-ui='command-search'] > input", [
            'font-size: calc(var(--font-size-body) * 1.1);'
        ]) +
        block("[data-ui='command-search'] > input::placeholder", [
            'color: color-mix(in oklab, var(--color-foreground-muted) 70%, transparent);'
        ]) +
        block("[data-ui='command-results']", [
            'padding: calc(var(--spacing) * 2) calc(var(--spacing) * 2) calc(var(--spacing) * 1.5);',
            'scrollbar-gutter: auto;'
        ]) +
        block("[data-ui='command-group']", ['gap: 0;']) +
        block("[data-ui='command-group']:not(:has([role='option']:not([hidden])))", [
            'display: none;'
        ]) +
        block("[data-ui='command-group'] > .sivir-menu-label", [
            'display: block;',
            'padding: calc(var(--spacing) * 2) calc(var(--spacing) * 2.5) calc(var(--spacing) * 1.5);'
        ]) +
        block("[data-ui='command-content'] .sivir-menu-item", [
            'height: auto;',
            'min-height: calc(var(--spacing) * 9.5);',
            'padding-inline: calc(var(--spacing) * 2.5);',
            'font-size: var(--font-size-body);',
            'font-weight: var(--font-weight-label);'
        ]) +
        block("[data-ui='command-content'] .sivir-menu-item > div", [
            'gap: calc(var(--spacing) * 3);'
        ]) +
        block("[data-ui='command-content'] .sivir-menu-item svg", [
            'color: var(--color-foreground-muted);'
        ]) +
        block("[data-ui='command-content'] .sivir-menu-separator", [
            'margin-inline: calc(var(--spacing) * 2.5);'
        ]) +
        block("[data-ui='command-content'] .sivir-menu-item kbd", [
            'border-color: transparent;',
            'background-color: transparent;',
            'font-size: var(--font-size-body);',
            'font-weight: var(--font-weight-body);'
        ]) +
        block(".sivir-modal-frame[data-ui='command-content'] > [data-ui='modal-surface']", [
            'padding-bottom: 0;'
        ]) +
        block(".sivir-modal-frame[data-ui='command-content'] > [data-ui='modal-frame-header']", [
            'padding: calc(var(--spacing) * 3) calc(var(--spacing) * 4.5);',
            'border-bottom: var(--border-size) solid var(--color-border);'
        ]) +
        block(".sivir-modal-frame[data-ui='command-content'] > [data-ui='modal-footer']", [
            'gap: calc(var(--spacing) * 4);',
            'padding: calc(var(--spacing) * 2.5) calc(var(--spacing) * 4.5);',
            'border-top: var(--border-size) solid var(--color-border);'
        ]) +
        block("[data-ui='command-content'] > [data-ui='modal-footer'] kbd", [
            'border-color: transparent;',
            'background-color: color-mix(in oklab, var(--color-foreground) 7%, transparent);'
        ])
    );
}

function chromeBlocks(chrome: ThemeChrome | undefined): string {
    if (!chrome) {
        return '';
    }
    const masterShadows = chrome.shadows !== false;
    const surfaceShadows = masterShadows && chrome.surfaceShadows !== false;
    const controlShadows = masterShadows && chrome.controlShadows !== false;
    const dialogShadows = masterShadows && chrome.dialogShadows !== false;
    const elevationOff: string[] = [];
    if (!surfaceShadows) {
        elevationOff.push('--elevation-1: none;', '--elevation-float: none;');
    }
    if (!dialogShadows) {
        elevationOff.push('--elevation-modal: none;');
    }
    if (!controlShadows) {
        elevationOff.push(
            '--elevation-control: inset 0 0 0 var(--border-size) var(--color-border);',
            '--elevation-button-outline: inset 0 0 0 var(--border-size) var(--color-border);'
        );
    }
    const shared = [`--ui-cursor-interactive: ${chrome.interactiveCursor ?? 'default'};`];
    if (chrome.travelingHighlight === false) {
        shared.push('--sivir-traveling-highlight: none;');
    }
    if (chrome.fancySwap === false) {
        shared.push(
            '--motion-swap-blur: 0px;',
            '--motion-swap-scale: 1;',
            '--motion-swap-rotate: 0deg;',
            '--motion-swap-y: 0px;'
        );
    }
    const withElevations = (declarations: string[]) =>
        elevationOff.length > 0 ? [...declarations, ...elevationOff] : declarations;
    const light = withElevations([
        `--color-primary-stroke: ${
            chrome.primaryStroke ? 'color-mix(in srgb, black 14%, transparent)' : 'transparent'
        };`,
        ...shared
    ]);
    const dark = withElevations([
        `--color-primary-stroke: ${
            chrome.primaryStroke ? 'color-mix(in srgb, white 24%, transparent)' : 'transparent'
        };`,
        ...shared
    ]);
    const hasChromeWork =
        !surfaceShadows ||
        !controlShadows ||
        !dialogShadows ||
        chrome.travelingHighlight === false ||
        chrome.fancySwap === false ||
        chrome.menuPaneling === false ||
        chrome.surfacePaneling === false ||
        chrome.primaryStroke === true ||
        chrome.interactiveCursor === 'pointer';
    if (!hasChromeWork) {
        return '';
    }
    const menuPaneling = chrome.menuPaneling === false ? menuPanelingOffCss() : '';
    const surfacePaneling = chrome.surfacePaneling === false ? surfacePanelingOffCss() : '';
    return block(':root:not(.dark)', light) + block('.dark', dark) + menuPaneling + surfacePaneling;
}

/** Generates complete, acyclic overrides for every public theme axis. */
export function themeToCss(themeInput: Theme): string {
    const theme = parseTheme(themeInput);
    const [radiusSm, radiusMd, radiusLg, radiusXl] = RADII[theme.radius];
    const motion = MOTION[theme.motion];
    const shared = [
        `--font-sans: ${theme.fontSans};`,
        `--font-mono: ${theme.fontMono};`,
        `--font-header: ${theme.fontHeader};`,
        `--radius-sm: ${radiusSm};`,
        `--radius-md: ${radiusMd};`,
        `--radius-lg: ${radiusLg};`,
        `--radius-xl: ${radiusXl};`,
        `--sivir-space-unit: ${DENSITY_UNIT[theme.density]};`,
        `--motion-duration-hover: ${motion.hover};`,
        `--motion-duration-menu: ${motion.menu};`,
        `--motion-duration-panel: ${motion.panel};`,
        `--motion-duration-sheet: ${motion.sheet};`,
        `--motion-duration-sheet-out: ${scaleMotionMs(motion.sheet, 0.7)};`,
        `--motion-duration-overlay: ${motion.overlay};`,
        `--motion-duration-toast-in: ${motion.toastIn};`,
        `--motion-duration-toast-out: ${motion.toastOut};`,
        `--motion-duration-step-in: ${motion.stepIn};`,
        `--motion-duration-step-out: ${motion.stepOut};`,
        `--motion-swap-scale: ${motion.swapScale};`,
        `--motion-swap-rotate: ${motion.swapRotate};`,
        `--motion-swap-y: ${motion.swapY};`
    ];
    if (theme.motion === 'none') {
        shared.push(
            '--motion-duration-panel-in: 0ms;',
            '--motion-duration-panel-out: 0ms;',
            '--motion-duration-modal-in: 0ms;',
            '--motion-duration-modal-out: 0ms;',
            '--motion-duration-press: 0ms;',
            '--motion-duration-item: 0ms;',
            '--motion-duration-switch: 0ms;'
        );
    }

    let css =
        block(':root,\n.dark', shared) +
        block(':root', [
            ...brandDeclarations(theme.brand, 'light'),
            ...neutralDeclarations(NEUTRALS[theme.neutral].light)
        ]) +
        block('.dark', [
            ...brandDeclarations(theme.brand, 'dark'),
            ...neutralDeclarations(NEUTRALS[theme.neutral].dark)
        ]);

    const typography = typographyDeclarations(theme.typography);
    if (typography.length > 0) {
        css += block(':root,\n.dark', typography);
    }

    if (theme.foundation?.light) {
        const declarations = foundationDeclarations(theme.foundation.light);
        if (declarations.length > 0) {
            css += block(':root:not(.dark)', declarations);
        }
    }
    if (theme.foundation?.dark) {
        const declarations = foundationDeclarations(theme.foundation.dark);
        if (declarations.length > 0) {
            css += block('.dark', declarations);
        }
    }

    if (theme.tokens?.shared) {
        const declarations = tokenMapDeclarations(theme.tokens.shared);
        if (declarations.length > 0) {
            css += block(':root,\n.dark', declarations);
        }
    }
    if (theme.tokens?.light) {
        const declarations = tokenMapDeclarations(theme.tokens.light);
        if (declarations.length > 0) {
            css += block(':root:not(.dark)', declarations);
        }
    }
    if (theme.tokens?.dark) {
        const declarations = tokenMapDeclarations(theme.tokens.dark);
        if (declarations.length > 0) {
            css += block('.dark', declarations);
        }
    }

    css += chromeBlocks(theme.chrome);
    return css;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requiredString(value: unknown, field: string) {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new TypeError(`Invalid theme: ${field} must be a non-empty string.`);
    }
    return value;
}

function enumValue<T extends string>(value: unknown, field: string, values: readonly T[]): T {
    if (typeof value !== 'string' || !values.includes(value as T)) {
        throw new TypeError(`Invalid theme: ${field} must be one of ${values.join(', ')}.`);
    }
    return value as T;
}

function cssValue(value: unknown, field: string): string {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new TypeError(`Invalid theme: ${field} must be a non-empty string.`);
    }
    const trimmed = value.trim();
    if (trimmed.length > 500 || /[{};]/.test(trimmed)) {
        throw new TypeError(`Invalid theme: ${field} must be a plain CSS value.`);
    }
    return trimmed;
}

function tokenName(value: string, field: string): string {
    if (!/^--[a-z0-9-]+$/.test(value)) {
        throw new TypeError(`Invalid theme: ${field} keys must look like --token-name.`);
    }
    return value;
}

function optionalTokenMap(value: unknown, field: string): Record<string, string> | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (!isRecord(value)) {
        throw new TypeError(`Invalid theme: ${field} must be an object.`);
    }
    const entries = Object.entries(value);
    if (entries.length === 0) {
        return undefined;
    }
    if (entries.length > 200) {
        throw new TypeError(`Invalid theme: ${field} must have at most 200 entries.`);
    }
    const map: Record<string, string> = {};
    for (const [name, raw] of entries) {
        tokenName(name, field);
        map[name] = cssValue(raw, `${field}.${name}`);
    }
    return map;
}

function optionalFoundation(value: unknown): ThemeFoundation | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (!isRecord(value)) {
        throw new TypeError('Invalid theme: foundation must be an object.');
    }
    const paletteKeys = [
        'base',
        'border',
        'background',
        'secondary',
        'foreground',
        'foregroundMuted',
        'onPrimary',
        'buttonForeground'
    ] as const;
    const parsePalette = (raw: unknown, field: string) => {
        if (raw === undefined) {
            return undefined;
        }
        if (!isRecord(raw)) {
            throw new TypeError(`Invalid theme: ${field} must be an object.`);
        }
        const palette: ThemeFoundationPalette = {};
        for (const key of paletteKeys) {
            const candidate = raw[key];
            if (candidate === undefined) {
                continue;
            }
            palette[key] = cssValue(candidate, `${field}.${key}`);
        }
        return Object.keys(palette).length > 0 ? palette : undefined;
    };
    const foundation: ThemeFoundation = {
        light: parsePalette(value.light, 'foundation.light'),
        dark: parsePalette(value.dark, 'foundation.dark')
    };
    if (!foundation.light && !foundation.dark) {
        return undefined;
    }
    return foundation;
}

function optionalTypography(value: unknown): ThemeTypography | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (!isRecord(value)) {
        throw new TypeError('Invalid theme: typography must be an object.');
    }
    const typography: ThemeTypography = {};
    if (value.headerSize !== undefined) {
        if (
            typeof value.headerSize !== 'number' ||
            !Number.isFinite(value.headerSize) ||
            value.headerSize < 10 ||
            value.headerSize > 32
        ) {
            throw new TypeError('Invalid theme: typography.headerSize must be 10-32.');
        }
        typography.headerSize = value.headerSize;
    }
    if (value.headerWeight !== undefined) {
        typography.headerWeight = enumValue(
            value.headerWeight,
            'typography.headerWeight',
            themeFontWeights
        );
    }
    if (value.roleWeights !== undefined) {
        if (!isRecord(value.roleWeights)) {
            throw new TypeError('Invalid theme: typography.roleWeights must be an object.');
        }
        const roles: ThemeRoleWeights = {};
        const roleKeys = ['body', 'label', 'button', 'badge', 'description'] as const;
        for (const role of roleKeys) {
            const candidate = value.roleWeights[role];
            if (candidate === undefined) {
                continue;
            }
            roles[role] = enumValue(candidate, `typography.roleWeights.${role}`, themeFontWeights);
        }
        if (Object.keys(roles).length > 0) {
            typography.roleWeights = roles;
        }
    }
    return Object.keys(typography).length > 0 ? typography : undefined;
}

function optionalChrome(value: unknown): ThemeChrome | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (!isRecord(value)) {
        throw new TypeError('Invalid theme: chrome must be an object.');
    }
    const chrome: ThemeChrome = {};
    if (value.shadows !== undefined) {
        if (typeof value.shadows !== 'boolean') {
            throw new TypeError('Invalid theme: chrome.shadows must be a boolean.');
        }
        chrome.shadows = value.shadows;
    }
    for (const key of ['surfaceShadows', 'controlShadows', 'dialogShadows'] as const) {
        if (value[key] !== undefined) {
            if (typeof value[key] !== 'boolean') {
                throw new TypeError(`Invalid theme: chrome.${key} must be a boolean.`);
            }
            chrome[key] = value[key];
        }
    }
    if (value.travelingHighlight !== undefined) {
        if (value.travelingHighlight !== false) {
            throw new TypeError(
                'Invalid theme: chrome.travelingHighlight only accepts false (the highlight is on by default).'
            );
        }
        chrome.travelingHighlight = false;
    }
    if (value.fancySwap !== undefined) {
        if (value.fancySwap !== false) {
            throw new TypeError(
                'Invalid theme: chrome.fancySwap only accepts false (the fancy swap is on by default).'
            );
        }
        chrome.fancySwap = false;
    }
    if (value.menuPaneling !== undefined) {
        if (typeof value.menuPaneling !== 'boolean') {
            throw new TypeError('Invalid theme: chrome.menuPaneling must be a boolean.');
        }
        chrome.menuPaneling = value.menuPaneling;
    }
    if (value.surfacePaneling !== undefined) {
        if (typeof value.surfacePaneling !== 'boolean') {
            throw new TypeError('Invalid theme: chrome.surfacePaneling must be a boolean.');
        }
        chrome.surfacePaneling = value.surfacePaneling;
    }
    if (value.primaryStroke !== undefined) {
        if (typeof value.primaryStroke !== 'boolean') {
            throw new TypeError('Invalid theme: chrome.primaryStroke must be a boolean.');
        }
        chrome.primaryStroke = value.primaryStroke;
    }
    if (value.interactiveCursor !== undefined) {
        chrome.interactiveCursor = enumValue(
            value.interactiveCursor,
            'chrome.interactiveCursor',
            interactiveCursors
        );
    }
    return Object.keys(chrome).length > 0 ? chrome : undefined;
}

/** Validates untrusted registry/local-storage JSON and returns a normalized theme. */
export function parseTheme(value: unknown): Theme {
    if (!isRecord(value)) {
        throw new TypeError('Invalid theme: expected an object.');
    }
    if (
        typeof value.version !== 'number' ||
        !(SUPPORTED_THEME_VERSIONS as readonly number[]).includes(value.version)
    ) {
        throw new TypeError(
            `Invalid theme: version must be one of ${SUPPORTED_THEME_VERSIONS.join(', ')}.`
        );
    }
    const version = value.version as SupportedThemeVersion;

    const slug = requiredString(value.slug, 'slug');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        throw new TypeError(
            'Invalid theme: slug must contain lowercase letters, numbers, or hyphens.'
        );
    }

    const brand = requiredString(value.brand, 'brand').toLowerCase();
    if (!/^#[0-9a-f]{6}$/.test(brand)) {
        throw new TypeError('Invalid theme: brand must be a six-digit hex color.');
    }

    const theme: Theme = {
        version,
        slug,
        name: requiredString(value.name, 'name'),
        description: typeof value.description === 'string' ? value.description : '',
        brand,
        neutral: enumValue(value.neutral, 'neutral', neutralTemperatures),
        radius: enumValue(value.radius, 'radius', radiusScales),
        density: enumValue(value.density, 'density', densities),
        motion: enumValue(value.motion, 'motion', motionFeels),
        fontSans: cssValue(value.fontSans, 'fontSans'),
        fontMono: cssValue(value.fontMono, 'fontMono'),
        fontHeader: cssValue(value.fontHeader, 'fontHeader')
    };
    if (typeof value.publisher === 'string' && value.publisher.trim()) {
        theme.publisher = value.publisher;
    }
    const foundation = optionalFoundation(value.foundation);
    if (foundation) {
        theme.foundation = foundation;
    }
    const tokens = isRecord(value.tokens)
        ? {
              light: optionalTokenMap(value.tokens.light, 'tokens.light'),
              dark: optionalTokenMap(value.tokens.dark, 'tokens.dark'),
              shared: optionalTokenMap(value.tokens.shared, 'tokens.shared')
          }
        : undefined;
    if (tokens && (tokens.light || tokens.dark || tokens.shared)) {
        theme.tokens = {
            ...(tokens.light ? { light: tokens.light } : {}),
            ...(tokens.dark ? { dark: tokens.dark } : {}),
            ...(tokens.shared ? { shared: tokens.shared } : {})
        };
    }
    const typography = optionalTypography(value.typography);
    if (typography) {
        theme.typography = typography;
    }
    const chrome = optionalChrome(value.chrome);
    if (chrome) {
        theme.chrome = chrome;
    }
    return theme;
}

/** Upgrades a v2 theme to v3 without changing its rendered CSS. */
export function migrateThemeV2ToV3(theme: Theme): Theme {
    const parsed = parseTheme(theme);
    return {
        ...parsed,
        version: 3
    };
}

/** Upgrades a v3 theme to v4, dropping the removed `foundation.muted` surface. */
export function migrateThemeV3ToV4(theme: Theme): Theme {
    const parsed = parseTheme(theme);
    return {
        ...parsed,
        version: THEME_VERSION
    };
}

export function isTheme(value: unknown): value is Theme {
    try {
        parseTheme(value);
        return true;
    } catch {
        return false;
    }
}
