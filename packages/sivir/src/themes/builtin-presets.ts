import { DEFAULT_THEME, THEME_VERSION, type Theme } from './theme';

type CodePalette = {
    comment: string;
    keyword: string;
    string: string;
    number: string;
    function: string;
    property: string;
    builtin: string;
    entity: string;
    meta: string;
};

function codeTokens(palette: CodePalette): Record<string, string> {
    return {
        '--color-code-comment': palette.comment,
        '--color-code-keyword': palette.keyword,
        '--color-code-string': palette.string,
        '--color-code-number': palette.number,
        '--color-code-function': palette.function,
        '--color-code-property': palette.property,
        '--color-code-builtin': palette.builtin,
        '--color-code-entity': palette.entity,
        '--color-code-meta': palette.meta
    };
}

export const magicTheme: Theme = {
    version: THEME_VERSION,
    slug: 'magic',
    name: 'Magic',
    description: 'Sivir default — a calm, warm-neutral interface system.',
    brand: '#0033ff',
    neutral: 'warm',
    radius: 'default',
    density: 'compact',
    motion: 'subtle',
    fontSans: "'Geist', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    fontHeader: 'var(--font-sans)',
    publisher: 'Sivir UI',
    foundation: {
        light: {
            base: '#ffffff',
            border: '#e8e8ea',
            background: '#f4f4f4',
            secondary: '#ebebeb',
            foreground: '#1c1c1b',
            foregroundMuted: '#737373',
            onPrimary: '#ffffff',
            buttonForeground: '#1c1c1b'
        },
        dark: {
            base: '#171717',
            border: '#27272a',
            background: '#101010',
            secondary: '#1b1b1b',
            foreground: '#ededed',
            foregroundMuted: '#878787',
            onPrimary: '#ffffff',
            buttonForeground: '#ededed'
        }
    },
    tokens: {
        shared: {
            '--radius-lg': '8px',
            '--radius-md': '6px',
            '--radius-sm': '4px',
            '--radius-xl': '12px',
            '--motion-modal-blur': '0px',
            '--motion-menu-scale-start': '0.9',
            '--motion-menu-blur': '0px',
            '--motion-modal-scale-start': '0.9',
            '--motion-duration-panel-out': '170ms',
            '--motion-duration-panel-in': '120ms',
            '--motion-duration-modal-in': '180ms',
            '--motion-menu-origin': 'top'
        }
    },
    typography: {
        headerSize: 16,
        headerWeight: '600',
        roleWeights: {
            body: '500',
            label: '500',
            button: '500',
            badge: '500',
            description: '500'
        }
    },
    chrome: {
        surfaceShadows: true,
        controlShadows: false,
        dialogShadows: true,
        travelingHighlight: false,
        menuPaneling: false,
        surfacePaneling: false,
        primaryStroke: false,
        interactiveCursor: 'default'
    }
};

export const profitableTheme: Theme = {
    version: THEME_VERSION,
    slug: 'profitable',
    name: 'Profitable',
    description: 'Calm warm-neutral system with a graphite accent, Geist type, and flat surfaces.',
    brand: '#333333',
    neutral: 'warm',
    radius: 'rounded',
    density: 'default',
    motion: 'default',
    fontSans: "'Geist', sans-serif",
    fontMono: "'Roboto Mono', monospace",
    fontHeader: 'var(--font-sans)',
    publisher: 'Sivir UI',
    foundation: {
        light: {
            base: '#ffffff',
            border: '#e8e8e6',
            background: '#fcfcfc',
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
            onPrimary: '#242424',
            buttonForeground: '#ededed'
        }
    },
    tokens: {
        dark: {
            '--color-primary': '#e8e8e8',
            '--color-primary-hover': 'color-mix(in srgb, #e8e8e8 78%, black)',
            '--color-ring': 'color-mix(in srgb, #e8e8e8 30%, transparent)'
        },
        shared: {
            '--sivir-space-unit': '3.4px',
            '--radius-lg': '12px',
            '--radius-md': '10px',
            '--radius-xl': '14px',
            '--radius-sm': '7px',
            '--motion-duration-hover': '120ms',
            '--motion-duration-menu': '90ms',
            '--motion-duration-panel': '130ms',
            '--motion-duration-sheet': '130ms',
            '--motion-duration-overlay': '120ms',
            '--motion-menu-x': '2px',
            '--motion-menu-y': '2px',
            '--motion-menu-scale-start': '0.98',
            '--motion-menu-blur': '0px',
            '--motion-modal-x': '2px',
            '--motion-modal-y': '2px',
            '--motion-modal-scale-start': '0.98',
            '--motion-modal-blur': '0px',
            '--motion-panel-y': '2px',
            '--motion-panel-scale-start': '0.98',
            '--motion-step-x': '0px',
            '--motion-step-blur': '0px',
            '--motion-press-px': '0px',
            '--motion-duration-panel-in': '130ms',
            '--motion-duration-panel-out': '70ms',
            '--motion-duration-modal-in': '130ms',
            '--motion-duration-modal-out': '70ms',
            '--motion-duration-step-in': '130ms',
            '--motion-duration-step-out': '70ms',
            '--motion-duration-toast-in': '130ms',
            '--motion-duration-toast-out': '70ms',
            '--motion-duration-sheet-out': '70ms'
        }
    },
    typography: {
        headerSize: 16,
        headerWeight: '600',
        roleWeights: {
            body: '400',
            label: '500',
            button: '500',
            badge: '500',
            description: '400'
        }
    },
    chrome: {
        surfaceShadows: false,
        controlShadows: false,
        dialogShadows: true,
        menuPaneling: false,
        surfacePaneling: false,
        primaryStroke: false,
        interactiveCursor: 'default'
    }
};

export const ravenTheme: Theme = {
    version: THEME_VERSION,
    slug: 'raven',
    name: 'Raven',
    description: 'True-black timeline surfaces, hairline borders, and a bright blue accent.',
    brand: '#1d9bf0',
    neutral: 'cool',
    radius: 'default',
    density: 'default',
    motion: 'expressive',
    fontSans: "'Figtree', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    fontHeader: 'var(--font-sans)',
    publisher: 'Sivir UI',
    foundation: {
        light: {
            base: '#ffffff',
            border: '#eff3f4',
            background: '#ffffff',
            secondary: '#f7f9f9',
            foreground: '#0f1419',
            foregroundMuted: '#536471',
            onPrimary: '#ffffff',
            buttonForeground: '#0f1419'
        },
        dark: {
            base: '#000000',
            border: '#2f3336',
            background: '#000000',
            secondary: '#16181c',
            foreground: '#e7e9ea',
            foregroundMuted: '#71767b',
            onPrimary: '#ffffff',
            buttonForeground: '#e7e9ea'
        }
    },
    tokens: {
        light: {
            '--color-input': '#cfd9de'
        },
        dark: {
            '--color-input': '#333639'
        },
        shared: {
            '--radius-sm': '4px',
            '--radius-md': '6px',
            '--radius-lg': '8px',
            '--radius-xl': '12px',
            '--motion-duration-hover': '160ms',
            '--motion-duration-menu': '140ms',
            '--motion-duration-panel': '200ms',
            '--motion-duration-sheet': '300ms',
            '--motion-duration-overlay': '180ms',
            '--motion-duration-modal-in': '240ms',
            '--motion-duration-modal-out': '160ms',
            '--motion-menu-y': '0px',
            '--motion-menu-scale-start': '0.9',
            '--motion-menu-blur': '0px',
            '--motion-modal-y': '0px',
            '--motion-modal-scale-start': '0.88',
            '--motion-modal-blur': '0px',
            '--motion-step-x': '24px',
            '--motion-step-blur': '0px',
            '--motion-press-px': '1px'
        }
    },
    typography: {
        headerSize: 17,
        headerWeight: '700',
        roleWeights: {
            body: '500',
            label: '500',
            button: '700',
            badge: '600',
            description: '500'
        }
    },
    chrome: {
        surfaceShadows: false,
        controlShadows: false,
        dialogShadows: true,
        travelingHighlight: false,
        menuPaneling: false,
        surfacePaneling: false,
        primaryStroke: false,
        interactiveCursor: 'pointer'
    }
};

export const sivirTheme: Theme = {
    version: THEME_VERSION,
    slug: 'sivir',
    name: 'Sivir',
    description: 'Compact warm workspace with a blue accent, flat chrome, and tight radii.',
    publisher: 'Sivir UI',
    brand: '#1c68ff',
    neutral: 'warm',
    radius: 'default',
    density: 'compact',
    motion: 'subtle',
    fontSans: "'Inter', sans-serif",
    fontMono: "'Roboto Mono', monospace",
    fontHeader: 'var(--font-sans)',
    foundation: {
        light: {
            base: '#fffefb',
            border: '#d9d5c4',
            background: '#faf9f5',
            secondary: '#f0eee6',
            foreground: '#141413',
            foregroundMuted: '#73726c',
            onPrimary: '#ffffff',
            buttonForeground: '#141413'
        },
        dark: {
            base: '#222220',
            border: '#3c3c39',
            background: '#111112',
            secondary: '#30302e',
            foreground: '#faf9f5',
            foregroundMuted: '#a1a09a',
            onPrimary: '#ffffff',
            buttonForeground: '#faf9f5'
        }
    },
    tokens: {
        light: {
            '--color-input': '#dcd9cc',
            ...codeTokens({
                comment: '#8c8779',
                keyword: '#b5452a',
                string: '#5a7a3a',
                number: '#a5651b',
                function: '#7a5a9e',
                property: '#3f6b8c',
                builtin: '#c26a2c',
                entity: '#5a7a3a',
                meta: '#8c8779'
            })
        },
        dark: {
            '--color-input': '#3d3d3a'
        },
        shared: {
            '--sivir-space-unit': '3.4px',
            '--radius-sm': '5px',
            '--radius-md': '7px',
            '--radius-lg': '9px',
            '--radius-xl': '13px',
            '--size-button-md': '32px',
            '--padding-button-x': '9px',
            '--motion-duration-step-in': '30ms',
            '--motion-duration-step-out': '60ms',
            '--motion-duration-panel-in': '160ms',
            '--motion-duration-panel-out': '110ms',
            '--motion-duration-modal-in': '200ms',
            '--motion-duration-modal-out': '110ms',
            '--motion-duration-press': '40ms',
            '--motion-duration-item': '0ms',
            '--motion-menu-y': '3px',
            '--motion-menu-blur': '0px',
            '--motion-modal-x': '2px',
            '--motion-modal-y': '2px',
            '--motion-modal-scale-start': '0.96',
            '--motion-modal-blur': '1px',
            '--motion-panel-y': '2px',
            '--motion-panel-scale-start': '0.98',
            '--motion-step-x': '0px',
            '--motion-step-blur': '0px',
            '--motion-press-px': '0px',
            '--motion-duration-switch': '150ms',
            '--motion-menu-x': '2px',
            '--motion-menu-scale-start': '0.97',
            '--motion-duration-swap': '100ms',
            '--motion-switch-stretch': '0.5',
            '--motion-duration-hover': '100ms',
            '--motion-slider-stretch': '0',
            '--motion-menu-origin': 'top left'
        }
    },
    typography: {
        headerSize: 16,
        headerWeight: '600',
        roleWeights: {
            body: '500',
            label: '500',
            button: '600',
            badge: '500',
            description: '500'
        }
    },
    chrome: {
        surfaceShadows: true,
        controlShadows: true,
        dialogShadows: true,
        fancySwap: false,
        menuPaneling: false,
        surfacePaneling: false,
        primaryStroke: true,
        interactiveCursor: 'default'
    }
};

export const clawdTheme: Theme = {
    version: THEME_VERSION,
    slug: 'clawd',
    name: 'Clawd',
    description: 'Compact warm-dark workspace with a clay accent, flat chrome, and tight radii.',
    brand: '#292929',
    neutral: 'warm',
    radius: 'default',
    density: 'compact',
    motion: 'subtle',
    fontSans: "'DM Sans', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    fontHeader: 'var(--font-sans)',
    publisher: 'Sivir UI',
    foundation: {
        light: {
            base: '#fffefb',
            border: '#e8e6dc',
            background: '#faf9f5',
            secondary: '#f0eee6',
            foreground: '#141413',
            foregroundMuted: '#73726c',
            onPrimary: '#ffffff',
            buttonForeground: '#141413'
        },
        dark: {
            base: '#262624',
            border: '#30302e',
            background: '#131314',
            secondary: '#30302e',
            foreground: '#faf9f5',
            foregroundMuted: '#a1a09a',
            onPrimary: '#000000',
            buttonForeground: '#faf9f5'
        }
    },
    tokens: {
        light: {
            '--color-input': '#dcd9cc',
            ...codeTokens({
                comment: '#8c8779',
                keyword: '#b5452a',
                string: '#5a7a3a',
                number: '#a5651b',
                function: '#7a5a9e',
                property: '#3f6b8c',
                builtin: '#c26a2c',
                entity: '#5a7a3a',
                meta: '#8c8779'
            })
        },
        dark: {
            '--color-primary': '#e8e8e8',
            '--color-primary-hover': 'color-mix(in srgb, #e8e8e8 78%, black)',
            '--color-ring': 'color-mix(in srgb, #e8e8e8 30%, transparent)',
            '--color-input': '#3d3d3a',
            ...codeTokens({
                comment: '#8c8779',
                keyword: '#e8917a',
                string: '#a6c47f',
                number: '#e0b062',
                function: '#c0a2e3',
                property: '#8fbbdb',
                builtin: '#eba26a',
                entity: '#a6c47f',
                meta: '#8c8779'
            })
        },
        shared: {
            '--motion-duration-step-in': '30ms',
            '--motion-duration-step-out': '60ms',
            '--motion-duration-panel-in': '30ms',
            '--motion-duration-panel-out': '60ms',
            '--motion-duration-modal-in': '30ms',
            '--motion-duration-modal-out': '60ms',
            '--motion-duration-press': '40ms',
            '--motion-duration-item': '0ms',
            '--motion-menu-x': '2px',
            '--motion-menu-y': '2px',
            '--motion-menu-scale-start': '1',
            '--motion-menu-blur': '0px',
            '--motion-modal-x': '2px',
            '--motion-modal-y': '2px',
            '--motion-modal-scale-start': '1',
            '--motion-modal-blur': '0px',
            '--motion-panel-y': '2px',
            '--motion-panel-scale-start': '0.98',
            '--motion-step-x': '0px',
            '--motion-step-blur': '0px',
            '--motion-press-px': '0px',
            '--motion-duration-switch': '0ms',
            '--motion-switch-stretch': '0'
        }
    },
    typography: {
        headerSize: 16,
        headerWeight: '600',
        roleWeights: {
            body: '500',
            label: '500',
            button: '600',
            badge: '500',
            description: '500'
        }
    },
    chrome: {
        surfaceShadows: false,
        controlShadows: false,
        dialogShadows: true,
        travelingHighlight: false,
        fancySwap: false,
        menuPaneling: false,
        surfacePaneling: false,
        primaryStroke: false,
        interactiveCursor: 'default'
    }
};

export const inspirationTheme: Theme = {
    version: THEME_VERSION,
    slug: 'inspiration',
    name: 'Inspiration',
    description: 'Violet primary, sharp corners, heavier type, and quick, unblurred menus.',
    brand: '#bc3afc',
    neutral: 'warm',
    radius: 'sharp',
    density: 'default',
    motion: 'expressive',
    fontSans: "'Inter', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    fontHeader: 'var(--font-sans)',
    publisher: 'Sivir UI',
    foundation: {
        light: {
            base: '#ffffff',
            border: '#ddddda',
            background: '#fdfdfc',
            secondary: '#f0f0ef',
            foreground: '#1f1f1e',
            foregroundMuted: '#808080',
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
    },
    tokens: {
        dark: {
            '--color-primary': '#be3dff',
            '--color-primary-hover': 'color-mix(in srgb, #be3dff 78%, black)',
            '--color-ring': 'color-mix(in srgb, #be3dff 30%, transparent)'
        },
        shared: {
            '--radius-sm': '4px',
            '--radius-md': '5px',
            '--radius-lg': '6px',
            '--radius-xl': '8px',
            '--motion-press-px': '2px',
            '--motion-menu-origin': 'top',
            '--motion-menu-scale-start': '1',
            '--motion-menu-blur': '0px',
            '--motion-duration-panel-out': '160ms',
            '--motion-duration-panel-in': '190ms',
            '--motion-menu-y': '3px',
            '--motion-duration-hover': '70ms',
            '--motion-duration-swap': '0ms',
            '--motion-duration-switch': '160ms',
            '--motion-switch-stretch': '0.8'
        }
    },
    typography: {
        headerSize: 16,
        headerWeight: '600',
        roleWeights: {
            body: '500',
            label: '600',
            button: '600',
            badge: '600',
            description: '500'
        }
    },
    chrome: {
        surfaceShadows: true,
        controlShadows: true,
        dialogShadows: true,
        travelingHighlight: false,
        fancySwap: false,
        menuPaneling: false,
        surfacePaneling: false,
        primaryStroke: true,
        interactiveCursor: 'pointer'
    }
};

export const governmentTheme: Theme = {
    version: THEME_VERSION,
    slug: 'government',
    name: 'Government',
    description:
        'Square corners, flat hairline surfaces, near-zero motion, and a single amber accent.',
    brand: '#fbb724',
    neutral: 'cool',
    radius: 'none',
    density: 'compact',
    motion: 'none',
    fontSans: "'Inter', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    fontHeader: 'var(--font-sans)',
    publisher: 'Sivir UI',
    foundation: {
        light: {
            base: '#ffffff',
            border: '#d5d9de',
            background: '#f1f3f5',
            secondary: '#e6e9ed',
            foreground: '#14171a',
            foregroundMuted: '#5b6570',
            onPrimary: '#14171a',
            buttonForeground: '#14171a'
        },
        dark: {
            base: '#14171a',
            border: '#2b3036',
            background: '#0b0d0f',
            secondary: '#1d2125',
            foreground: '#e3e6e9',
            foregroundMuted: '#8b949e',
            onPrimary: '#14171a',
            buttonForeground: '#e3e6e9'
        }
    },
    tokens: {
        shared: {
            '--motion-duration-hover': '0ms',
            '--motion-duration-menu': '0ms',
            '--motion-duration-panel': '0ms',
            '--motion-duration-sheet': '0ms',
            '--motion-duration-overlay': '0ms',
            '--motion-duration-panel-in': '0ms',
            '--motion-duration-panel-out': '0ms',
            '--motion-duration-modal-in': '0ms',
            '--motion-duration-modal-out': '0ms',
            '--motion-duration-step-in': '0ms',
            '--motion-duration-step-out': '0ms',
            '--motion-duration-toast-in': '60ms',
            '--motion-duration-toast-out': '0ms',
            '--motion-duration-sheet-out': '0ms',
            '--motion-menu-x': '0px',
            '--motion-menu-y': '0px',
            '--motion-menu-scale-start': '1',
            '--motion-menu-blur': '0px',
            '--motion-modal-x': '0px',
            '--motion-modal-y': '0px',
            '--motion-modal-scale-start': '1',
            '--motion-modal-blur': '0px',
            '--motion-panel-y': '0px',
            '--motion-panel-scale-start': '1',
            '--motion-step-x': '0px',
            '--motion-step-blur': '0px',
            '--motion-press-px': '0px'
        }
    },
    typography: {
        headerSize: 15,
        headerWeight: '600',
        roleWeights: {
            body: '400',
            label: '500',
            button: '500',
            badge: '500',
            description: '400'
        }
    },
    chrome: {
        surfaceShadows: false,
        controlShadows: false,
        dialogShadows: false,
        travelingHighlight: false,
        menuPaneling: false,
        surfacePaneling: false,
        primaryStroke: false,
        interactiveCursor: 'default'
    }
};

export const builtInThemePresets: readonly Theme[] = [
    sivirTheme,
    DEFAULT_THEME,
    magicTheme,
    profitableTheme,
    ravenTheme,
    clawdTheme,
    inspirationTheme,
    governmentTheme
];

export const defaultTheme = DEFAULT_THEME;
