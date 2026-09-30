import { DEFAULT_THEME, THEME_VERSION, type Theme } from './theme';

export const magicTheme: Theme = {
    version: THEME_VERSION,
    slug: 'magic',
    name: 'Magic',
    description: 'Compact warm-neutral system with an indigo accent and flat chrome.',
    publisher: 'Sivir UI',
    brand: '#1e42e6',
    neutral: 'warm',
    radius: 'default',
    density: 'compact',
    motion: 'subtle',
    fontSans: "'Inter', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    fontHeader: 'var(--font-sans)',
    foundation: {
        light: {
            base: '#ffffff',
            border: '#dedede',
            background: '#fafafa',
            secondary: '#efefee'
        },
        dark: {
            base: '#171717',
            border: '#1f1f1f',
            background: '#0f0f0f',
            secondary: '#1f1f1f'
        }
    },
    tokens: {
        shared: {
            '--radius-lg': '8px',
            '--radius-md': '6px',
            '--radius-sm': '4px',
            '--radius-xl': '12px'
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
        shadows: false,
        primaryStroke: false,
        interactiveCursor: 'default'
    }
};

export const bitsyTheme: Theme = {
    version: THEME_VERSION,
    slug: 'bitsy',
    name: 'Bitsy',
    description: 'Comfortable rounded system with a graphite accent and flat stroked chrome.',
    publisher: 'Sivir UI',
    brand: '#5a5c63',
    neutral: 'warm',
    radius: 'rounded',
    density: 'comfortable',
    motion: 'expressive',
    fontSans: "'DM Sans', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    fontHeader: 'var(--font-sans)',
    foundation: {
        light: {
            base: '#ffffff',
            border: '#d4d4d4',
            background: '#fdfdfc',
            secondary: '#efefee'
        },
        dark: {
            base: '#171717',
            border: '#2a2a2a',
            background: '#0a0a0a',
            secondary: '#252525'
        }
    },
    typography: {
        headerSize: 18,
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
        shadows: false,
        primaryStroke: true,
        interactiveCursor: 'default'
    }
};

export const openaiTheme: Theme = {
    version: THEME_VERSION,
    slug: 'openai',
    name: 'OpenAI',
    description: 'Calm warm-neutral system with a graphite accent, Geist type, and flat surfaces.',
    publisher: 'Sivir UI',
    brand: '#333333',
    neutral: 'warm',
    radius: 'rounded',
    density: 'default',
    motion: 'subtle',
    fontSans: "'Geist', sans-serif",
    fontMono: "'Roboto Mono', monospace",
    fontHeader: 'var(--font-sans)',
    foundation: {
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
            onPrimary: '#242424',
            buttonForeground: '#ededed'
        }
    },
    tokens: {
        shared: {
            '--sivir-space-unit': '3.4px',
            '--radius-lg': '12px',
            '--radius-md': '10px',
            '--radius-xl': '14px',
            '--radius-sm': '7px'
        },
        dark: {
            '--color-primary': '#e8e8e8',
            '--color-primary-hover': 'color-mix(in srgb, #e8e8e8 78%, black)',
            '--color-ring': 'color-mix(in srgb, #e8e8e8 30%, transparent)'
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
        controlShadows: false
    }
};

export const functionalTheme: Theme = {
    version: THEME_VERSION,
    slug: 'functional',
    name: 'Functional',
    description: 'Sivir default — a calm, warm-neutral interface system.',
    publisher: 'Sivir UI',
    brand: '#0088ff',
    neutral: 'warm',
    radius: 'rounded',
    density: 'default',
    motion: 'subtle',
    fontSans: "'Inter', sans-serif",
    fontMono: "'Roboto Mono', monospace",
    fontHeader: 'var(--font-sans)',
    foundation: {
        light: {
            base: '#ffffff',
            border: '#f2f2f2',
            background: '#ffffff',
            secondary: '#efefee',
            foreground: '#4a4a49',
            foregroundMuted: '#828282',
            onPrimary: '#ffffff'
        },
        dark: {
            base: '#171717',
            border: '#212121',
            background: '#0a0a0a',
            secondary: '#252525',
            foreground: '#d6d6d6',
            foregroundMuted: '#6b6b6b',
            onPrimary: '#ffffff'
        }
    },
    tokens: {
        shared: {
            '--radius-xl': '12px',
            '--radius-lg': '8px',
            '--radius-md': '6px',
            '--radius-sm': '3px',
            '--border-size': '1px',
            '--sivir-space-unit': '3.5px',
            '--motion-duration-item': '0ms',
            '--motion-duration-modal-in': '70ms',
            '--motion-duration-toast-out': '0ms',
            '--motion-duration-sheet-out': '0ms',
            '--motion-duration-menu': '70ms',
            '--motion-duration-hover': '0ms',
            '--motion-duration-sheet': '0ms',
            '--motion-duration-toast-in': '70ms',
            '--motion-duration-panel-out': '0ms',
            '--motion-duration-press': '0ms',
            '--motion-duration-modal-out': '0ms',
            '--motion-duration-panel-in': '70ms',
            '--motion-duration-overlay': '20ms',
            '--motion-duration-panel': '70ms',
            '--motion-panel-scale-start': '1',
            '--motion-menu-blur': '0px',
            '--motion-modal-blur': '0px',
            '--motion-menu-scale-start': '1',
            '--motion-modal-scale-start': '1',
            '--motion-press-px': '1px',
            '--motion-panel-y': '3px',
            '--motion-menu-y': '3px'
        },
        dark: {
            '--color-primary': '#1e78e6',
            '--color-primary-hover': 'color-mix(in srgb, #1e78e6 78%, black)',
            '--color-ring': 'color-mix(in srgb, #1e78e6 30%, transparent)'
        }
    },
    typography: {
        headerSize: 16,
        headerWeight: '600',
        roleWeights: {
            body: '400',
            label: '400',
            button: '400',
            badge: '400',
            description: '400'
        }
    },
    chrome: {
        controlShadows: false,
        travelingHighlight: false,
        interactiveCursor: 'pointer'
    }
};

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

export const figmaTheme: Theme = {
    version: THEME_VERSION,
    slug: 'figma',
    name: 'Figma',
    description: 'Dense editor chrome: 12px type, 28px controls, hairline strokes, and no shadows.',
    publisher: 'Sivir UI',
    brand: '#0d99ff',
    neutral: 'true',
    radius: 'sharp',
    density: 'compact',
    motion: 'subtle',
    fontSans: "'Inter', sans-serif",
    fontMono: "'IBM Plex Mono', monospace",
    fontHeader: 'var(--font-sans)',
    foundation: {
        light: {
            base: '#ffffff',
            border: '#e6e6e6',
            background: '#f5f5f5',
            secondary: '#f0f0f0',
            foreground: '#1e1e1e',
            foregroundMuted: '#8c8c8c',
            onPrimary: '#ffffff'
        },
        dark: {
            base: '#2c2c2c',
            border: '#444444',
            background: '#1e1e1e',
            secondary: '#383838',
            foreground: '#ffffff',
            foregroundMuted: '#a6a6a6',
            onPrimary: '#ffffff'
        }
    },
    tokens: {
        shared: {
            '--sivir-space-unit': '3px',
            '--radius-sm': '2px',
            '--radius-md': '3px',
            '--radius-lg': '4px',
            '--radius-xl': '6px',
            '--size-control-sm': '24px',
            '--size-control-md': '28px',
            '--size-control-lg': '32px',
            '--font-size-body': '12px',
            '--font-size-label': '11px',
            '--font-size-button': '12px',
            '--font-size-badge': '11px',
            '--font-size-header': '12px',
            '--font-size-title': '16px',
            '--font-size-display': '22px',
            '--tracking-header': '0em',
            '--tracking-body': '0.005em',
            '--tracking-label': '0.005em',
            '--focus-ring': '0 0 0 1px var(--color-primary)',
            '--elevation-1': 'none',
            '--elevation-float': '0 2px 5px rgb(0 0 0 / 0.15), 0 0 0.5px rgb(0 0 0 / 0.3)',
            '--elevation-modal': '0 5px 17px rgb(0 0 0 / 0.2), 0 0 0.5px rgb(0 0 0 / 0.35)',
            '--elevation-control': 'inset 0 0 0 1px var(--color-input)',
            '--elevation-button-outline': 'inset 0 0 0 1px var(--color-input)',
            '--overlay-blur': '0px',
            '--overlay-brightness': '1',
            '--motion-duration-hover': '0ms',
            '--motion-duration-item': '0ms',
            '--motion-menu-blur': '0px',
            '--motion-modal-blur': '0px',
            '--motion-menu-scale-start': '1',
            '--motion-modal-scale-start': '0.99'
        },
        light: {
            '--color-input': '#e6e6e6',
            '--color-field': '#ffffff',
            '--color-tooltip': '#1e1e1e',
            '--color-overlay': 'rgb(0 0 0 / 0.12)',
            ...codeTokens({
                comment: '#8c8c8c',
                keyword: '#9747ff',
                string: '#14ae5c',
                number: '#0d99ff',
                function: '#0d99ff',
                property: '#1e1e1e',
                builtin: '#f24822',
                entity: '#14ae5c',
                meta: '#9747ff'
            })
        },
        dark: {
            '--color-input': '#444444',
            '--color-field': '#383838',
            '--color-tooltip': '#000000',
            '--color-overlay': 'rgb(0 0 0 / 0.4)',
            ...codeTokens({
                comment: '#8c8c8c',
                keyword: '#c4a1ff',
                string: '#5fd68f',
                number: '#5ec2ff',
                function: '#5ec2ff',
                property: '#ffffff',
                builtin: '#ff8a70',
                entity: '#5fd68f',
                meta: '#c4a1ff'
            })
        }
    },
    typography: {
        headerSize: 12,
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
        travelingHighlight: false,
        menuPaneling: false,
        surfacePaneling: false,
        interactiveCursor: 'default'
    }
};

export const appleTheme: Theme = {
    version: THEME_VERSION,
    slug: 'apple',
    name: 'Apple',
    description: 'Frosted overlays, big continuous corners, filled fields, and system blue.',
    publisher: 'Sivir UI',
    brand: '#007aff',
    neutral: 'cool',
    radius: 'rounded',
    density: 'comfortable',
    motion: 'expressive',
    fontSans: "'Inter', sans-serif",
    fontMono: "'IBM Plex Mono', monospace",
    fontHeader: 'var(--font-sans)',
    foundation: {
        light: {
            base: '#ffffff',
            border: '#ececf0',
            background: '#f2f2f7',
            secondary: '#ececf1',
            foreground: '#1c1c1e',
            foregroundMuted: '#8e8e93',
            onPrimary: '#ffffff'
        },
        dark: {
            base: '#1c1c1e',
            border: '#2c2c2e',
            background: '#000000',
            secondary: '#2c2c2e',
            foreground: '#f2f2f7',
            foregroundMuted: '#8e8e93',
            onPrimary: '#ffffff'
        }
    },
    tokens: {
        shared: {
            '--sivir-space-unit': '4px',
            '--radius-sm': '8px',
            '--radius-md': '12px',
            '--radius-lg': '14px',
            '--radius-xl': '26px',
            '--size-control-sm': '34px',
            '--size-control-md': '44px',
            '--size-control-lg': '50px',
            '--font-size-body': '15px',
            '--font-size-label': '14px',
            '--font-size-button': '16px',
            '--font-size-header': '17px',
            '--font-size-title': '24px',
            '--font-size-display': '34px',
            '--tracking-header': '-0.022em',
            '--tracking-body': '-0.01em',
            '--tracking-label': '-0.01em',
            '--tracking-button': '-0.01em',
            '--focus-ring': '0 0 0 4px var(--color-ring)',
            '--elevation-1': '0 1px 3px rgb(0 0 0 / 0.06)',
            '--elevation-float':
                '0 12px 40px -8px rgb(0 0 0 / 0.22), 0 0 0 0.5px rgb(0 0 0 / 0.08)',
            '--elevation-modal':
                '0 28px 80px -12px rgb(0 0 0 / 0.35), 0 0 0 0.5px rgb(0 0 0 / 0.1)',
            '--elevation-control': 'none',
            '--elevation-button-outline': 'inset 0 0 0 1px rgb(0 0 0 / 0.08)',
            '--overlay-blur': '22px',
            '--overlay-brightness': '0.85',
            '--motion-menu-scale-start': '0.94',
            '--motion-modal-scale-start': '0.9',
            '--ease-out': 'cubic-bezier(0.32, 0.72, 0, 1)'
        },
        light: {
            '--color-input': 'transparent',
            '--color-field': '#f2f2f7',
            '--color-tooltip': '#1c1c1e',
            '--color-overlay': 'rgb(0 0 0 / 0.22)',
            ...codeTokens({
                comment: '#6c7986',
                keyword: '#ad3da4',
                string: '#d12f1b',
                number: '#272ad8',
                function: '#3e8087',
                property: '#0f68a0',
                builtin: '#804fb8',
                entity: '#4b21b0',
                meta: '#78492a'
            })
        },
        dark: {
            '--color-primary': '#0a84ff',
            '--color-primary-hover': 'color-mix(in srgb, #0a84ff 78%, black)',
            '--color-ring': 'color-mix(in srgb, #0a84ff 35%, transparent)',
            '--color-input': 'transparent',
            '--color-field': '#2c2c2e',
            '--color-tooltip': '#3a3a3c',
            '--color-overlay': 'rgb(0 0 0 / 0.5)',
            ...codeTokens({
                comment: '#7f8c98',
                keyword: '#ff7ab2',
                string: '#ff8170',
                number: '#d9c97c',
                function: '#4eb0cc',
                property: '#78c2b3',
                builtin: '#b281eb',
                entity: '#dabaff',
                meta: '#ffa14f'
            })
        }
    },
    typography: {
        headerSize: 17,
        headerWeight: '600',
        roleWeights: {
            body: '400',
            label: '500',
            button: '600',
            badge: '600',
            description: '400'
        }
    },
    chrome: {
        primaryStroke: false,
        interactiveCursor: 'default'
    }
};

export const claudeTheme: Theme = {
    version: THEME_VERSION,
    slug: 'claude',
    name: 'Claude',
    description:
        'Warm paper, serif headings, airy reading type, and a clay accent with no shadows.',
    publisher: 'Sivir UI',
    brand: '#d97757',
    neutral: 'warm',
    radius: 'rounded',
    density: 'comfortable',
    motion: 'default',
    fontSans: "'DM Sans', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    fontHeader: "'Newsreader', serif",
    foundation: {
        light: {
            base: '#fffefb',
            border: '#e8e6dc',
            background: '#faf9f5',
            secondary: '#f0eee6',
            foreground: '#141413',
            foregroundMuted: '#73726c',
            onPrimary: '#ffffff'
        },
        dark: {
            base: '#30302e',
            border: '#3d3d3a',
            background: '#262624',
            secondary: '#1f1e1d',
            foreground: '#faf9f5',
            foregroundMuted: '#a1a09a',
            onPrimary: '#ffffff'
        }
    },
    tokens: {
        shared: {
            '--sivir-space-unit': '3.8px',
            '--radius-sm': '8px',
            '--radius-md': '10px',
            '--radius-lg': '14px',
            '--radius-xl': '22px',
            '--size-control-sm': '34px',
            '--size-control-md': '40px',
            '--size-control-lg': '46px',
            '--font-size-body': '15.5px',
            '--font-size-label': '13.5px',
            '--font-size-button': '14.5px',
            '--font-size-header': '19px',
            '--font-size-title': '26px',
            '--font-size-display': '38px',
            '--leading-body': '1.65',
            '--tracking-header': '-0.01em',
            '--focus-ring': '0 0 0 2px var(--color-background), 0 0 0 4px var(--color-ring)',
            '--elevation-1': 'none',
            '--elevation-float':
                '0 0 0 0.5px rgb(20 20 19 / 0.12), 0 4px 20px rgb(20 20 19 / 0.06)',
            '--elevation-modal':
                '0 0 0 0.5px rgb(20 20 19 / 0.15), 0 12px 48px rgb(20 20 19 / 0.14)',
            '--elevation-control': 'inset 0 0 0 1px var(--color-input)',
            '--elevation-button-outline': 'inset 0 0 0 1px var(--color-input)',
            '--overlay-blur': '4px',
            '--overlay-brightness': '0.95',
            '--motion-menu-scale-start': '0.96',
            '--motion-modal-y': '10px',
            '--motion-modal-scale-start': '0.97'
        },
        light: {
            '--color-input': '#dcd9cc',
            '--color-field': '#ffffff',
            '--color-tooltip': '#3d3929',
            '--color-overlay': 'rgb(38 32 20 / 0.28)',
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
            '--color-input': '#4a4945',
            '--color-field': '#262624',
            '--color-tooltip': '#faf9f5',
            '--color-overlay': 'rgb(10 9 8 / 0.6)',
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
        }
    },
    typography: {
        headerSize: 19,
        headerWeight: '500',
        roleWeights: {
            body: '400',
            label: '500',
            button: '500',
            badge: '500',
            description: '400'
        }
    },
    chrome: {
        menuPaneling: false,
        interactiveCursor: 'pointer'
    }
};

export const googleTheme: Theme = {
    version: THEME_VERSION,
    slug: 'google',
    name: 'Google',
    description: 'Material: pill buttons, outlined fields, tonal surfaces, and layered elevation.',
    publisher: 'Sivir UI',
    brand: '#1a73e8',
    neutral: 'true',
    radius: 'rounded',
    density: 'comfortable',
    motion: 'default',
    fontSans: "'Roboto', sans-serif",
    fontMono: "'Roboto Mono', monospace",
    fontHeader: 'var(--font-sans)',
    foundation: {
        light: {
            base: '#ffffff',
            border: '#dadce0',
            background: '#f8f9fa',
            secondary: '#f1f3f4',
            foreground: '#202124',
            foregroundMuted: '#5f6368',
            onPrimary: '#ffffff'
        },
        dark: {
            base: '#292a2d',
            border: '#3c4043',
            background: '#202124',
            secondary: '#303134',
            foreground: '#e8eaed',
            foregroundMuted: '#9aa0a6',
            onPrimary: '#202124'
        }
    },
    tokens: {
        shared: {
            '--sivir-space-unit': '4px',
            '--radius-sm': '8px',
            '--radius-md': '12px',
            '--radius-lg': '20px',
            '--radius-xl': '28px',
            '--size-control-sm': '32px',
            '--size-control-md': '40px',
            '--size-control-lg': '56px',
            '--font-size-body': '14px',
            '--font-size-label': '12px',
            '--font-size-button': '14px',
            '--font-size-header': '22px',
            '--font-size-title': '28px',
            '--font-size-display': '36px',
            '--tracking-header': '0em',
            '--tracking-label': '0.02em',
            '--tracking-button': '0.01em',
            '--focus-ring': '0 0 0 3px var(--color-ring)',
            '--elevation-1': '0 1px 2px rgb(60 64 67 / 0.3), 0 1px 3px 1px rgb(60 64 67 / 0.15)',
            '--elevation-float':
                '0 1px 3px rgb(60 64 67 / 0.3), 0 4px 8px 3px rgb(60 64 67 / 0.15)',
            '--elevation-modal':
                '0 4px 8px 3px rgb(60 64 67 / 0.15), 0 1px 3px rgb(60 64 67 / 0.3)',
            '--elevation-control': 'inset 0 0 0 1px var(--color-input)',
            '--elevation-button-outline': 'inset 0 0 0 1px var(--color-border-strong)',
            '--overlay-blur': '0px',
            '--overlay-brightness': '1',
            '--ease-out': 'cubic-bezier(0.2, 0, 0, 1)',
            '--ease-press': 'cubic-bezier(0.2, 0, 0, 1)',
            '--motion-duration-hover': '150ms',
            '--motion-duration-panel-in': '200ms',
            '--motion-duration-modal-in': '280ms',
            '--motion-menu-scale-start': '0.9',
            '--motion-menu-y': '0px',
            '--motion-modal-scale-start': '0.85'
        },
        light: {
            '--color-input': '#747775',
            '--color-border-strong': '#747775',
            '--color-field': '#ffffff',
            '--color-tooltip': '#3c4043',
            '--color-overlay': 'rgb(32 33 36 / 0.32)',
            ...codeTokens({
                comment: '#5f6368',
                keyword: '#a142f4',
                string: '#188038',
                number: '#e8710a',
                function: '#1a73e8',
                property: '#d93025',
                builtin: '#c5221f',
                entity: '#188038',
                meta: '#5f6368'
            })
        },
        dark: {
            '--color-primary': '#8ab4f8',
            '--color-primary-hover': 'color-mix(in srgb, #8ab4f8 78%, black)',
            '--color-ring': 'color-mix(in srgb, #8ab4f8 30%, transparent)',
            '--color-input': '#8e918f',
            '--color-border-strong': '#8e918f',
            '--color-field': '#292a2d',
            '--color-tooltip': '#e8eaed',
            '--color-overlay': 'rgb(0 0 0 / 0.5)',
            ...codeTokens({
                comment: '#9aa0a6',
                keyword: '#d7aefb',
                string: '#81c995',
                number: '#fcad70',
                function: '#8ab4f8',
                property: '#f28b82',
                builtin: '#ff8bcb',
                entity: '#81c995',
                meta: '#9aa0a6'
            })
        }
    },
    typography: {
        headerSize: 22,
        headerWeight: '400',
        roleWeights: {
            body: '400',
            label: '500',
            button: '500',
            badge: '500',
            description: '400'
        }
    },
    chrome: {
        menuPaneling: false,
        surfacePaneling: false,
        primaryStroke: false,
        interactiveCursor: 'pointer'
    }
};

export const shadcnTheme: Theme = {
    version: THEME_VERSION,
    slug: 'shadcn',
    name: 'shadcn',
    description: 'Zinc and near-black, 1px borders, tiny shadows, and a crisp 3px focus ring.',
    publisher: 'Sivir UI',
    brand: '#18181b',
    neutral: 'cool',
    radius: 'default',
    density: 'default',
    motion: 'subtle',
    fontSans: "'Geist', sans-serif",
    fontMono: "'Geist Mono', monospace",
    fontHeader: 'var(--font-sans)',
    foundation: {
        light: {
            base: '#ffffff',
            border: '#e4e4e7',
            background: '#ffffff',
            secondary: '#f4f4f5',
            foreground: '#09090b',
            foregroundMuted: '#71717a',
            onPrimary: '#fafafa'
        },
        dark: {
            base: '#09090b',
            border: '#27272a',
            background: '#09090b',
            secondary: '#27272a',
            foreground: '#fafafa',
            foregroundMuted: '#a1a1aa',
            onPrimary: '#18181b'
        }
    },
    tokens: {
        shared: {
            '--sivir-space-unit': '4px',
            '--radius-sm': '6px',
            '--radius-md': '8px',
            '--radius-lg': '10px',
            '--radius-xl': '14px',
            '--size-control-sm': '32px',
            '--size-control-md': '36px',
            '--size-control-lg': '40px',
            '--font-size-body': '14px',
            '--font-size-label': '14px',
            '--font-size-button': '14px',
            '--font-size-header': '16px',
            '--font-size-title': '24px',
            '--font-size-display': '36px',
            '--tracking-header': '-0.025em',
            '--focus-ring':
                '0 0 0 3px color-mix(in srgb, var(--color-foreground) 22%, transparent)',
            '--elevation-1': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            '--elevation-float': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            '--elevation-modal':
                '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            '--elevation-control':
                '0 1px 2px 0 rgb(0 0 0 / 0.05), inset 0 0 0 1px var(--color-input)',
            '--elevation-button-outline':
                '0 1px 2px 0 rgb(0 0 0 / 0.05), inset 0 0 0 1px var(--color-input)',
            '--overlay-blur': '0px',
            '--overlay-brightness': '1',
            '--motion-menu-scale-start': '0.95',
            '--motion-menu-blur': '0px',
            '--motion-modal-blur': '0px',
            '--motion-modal-scale-start': '0.95'
        },
        light: {
            '--color-input': '#e4e4e7',
            '--color-field': 'transparent',
            '--color-tooltip': '#18181b',
            '--color-overlay': 'rgb(0 0 0 / 0.5)',
            ...codeTokens({
                comment: '#71717a',
                keyword: '#18181b',
                string: '#52525b',
                number: '#18181b',
                function: '#09090b',
                property: '#3f3f46',
                builtin: '#27272a',
                entity: '#3f3f46',
                meta: '#a1a1aa'
            })
        },
        dark: {
            '--color-primary': '#fafafa',
            '--color-primary-hover': 'color-mix(in srgb, #fafafa 78%, black)',
            '--color-ring': 'color-mix(in srgb, #fafafa 30%, transparent)',
            '--color-input': 'rgb(255 255 255 / 0.15)',
            '--color-field': 'rgb(255 255 255 / 0.04)',
            '--color-tooltip': '#fafafa',
            '--color-overlay': 'rgb(0 0 0 / 0.6)',
            ...codeTokens({
                comment: '#71717a',
                keyword: '#fafafa',
                string: '#a1a1aa',
                number: '#fafafa',
                function: '#ffffff',
                property: '#d4d4d8',
                builtin: '#e4e4e7',
                entity: '#d4d4d8',
                meta: '#52525b'
            })
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
        menuPaneling: false,
        surfacePaneling: false,
        travelingHighlight: false,
        interactiveCursor: 'default'
    }
};

export const linearTheme: Theme = {
    version: THEME_VERSION,
    slug: 'linear',
    name: 'Linear',
    description: 'Quiet and fast: 13px type, 30px controls, near-black surfaces, and indigo focus.',
    publisher: 'Sivir UI',
    brand: '#5e6ad2',
    neutral: 'cool',
    radius: 'sharp',
    density: 'compact',
    motion: 'subtle',
    fontSans: "'Inter', sans-serif",
    fontMono: "'Geist Mono', monospace",
    fontHeader: 'var(--font-sans)',
    foundation: {
        light: {
            base: '#ffffff',
            border: '#ebebed',
            background: '#f7f8f8',
            secondary: '#f0f1f3',
            foreground: '#1c1d1f',
            foregroundMuted: '#6f7177',
            onPrimary: '#ffffff'
        },
        dark: {
            base: '#101113',
            border: '#1f2126',
            background: '#08090a',
            secondary: '#191a1d',
            foreground: '#f7f8f8',
            foregroundMuted: '#8a8f98',
            onPrimary: '#ffffff'
        }
    },
    tokens: {
        shared: {
            '--sivir-space-unit': '3.3px',
            '--radius-sm': '3px',
            '--radius-md': '5px',
            '--radius-lg': '6px',
            '--radius-xl': '10px',
            '--size-control-sm': '26px',
            '--size-control-md': '30px',
            '--size-control-lg': '34px',
            '--font-size-body': '13px',
            '--font-size-label': '12px',
            '--font-size-button': '13px',
            '--font-size-badge': '11px',
            '--font-size-header': '13px',
            '--font-size-title': '18px',
            '--font-size-display': '26px',
            '--tracking-header': '-0.01em',
            '--tracking-body': '-0.003em',
            '--focus-ring':
                '0 0 0 1px var(--color-primary), 0 0 0 4px color-mix(in srgb, var(--color-primary) 22%, transparent)',
            '--elevation-1': 'none',
            '--elevation-float': '0 8px 24px rgb(0 0 0 / 0.16), 0 0 0 1px var(--color-border)',
            '--elevation-modal': '0 16px 48px rgb(0 0 0 / 0.28), 0 0 0 1px var(--color-border)',
            '--elevation-control': 'inset 0 0 0 1px var(--color-input)',
            '--elevation-button-outline': 'inset 0 0 0 1px var(--color-input)',
            '--overlay-blur': '0px',
            '--overlay-brightness': '1',
            '--motion-duration-hover': '40ms',
            '--motion-duration-item': '50ms',
            '--motion-duration-panel-in': '90ms',
            '--motion-duration-panel-out': '50ms',
            '--motion-duration-modal-in': '110ms',
            '--motion-duration-modal-out': '60ms',
            '--motion-menu-blur': '0px',
            '--motion-modal-blur': '0px',
            '--motion-menu-y': '0px',
            '--motion-menu-scale-start': '0.98',
            '--motion-modal-scale-start': '0.98'
        },
        light: {
            '--color-input': '#e0e1e4',
            '--color-field': '#ffffff',
            '--color-tooltip': '#1c1d1f',
            '--color-overlay': 'rgb(16 17 19 / 0.3)',
            ...codeTokens({
                comment: '#8a8f98',
                keyword: '#5e6ad2',
                string: '#2f8f5b',
                number: '#c2611b',
                function: '#3a6fd8',
                property: '#1c1d1f',
                builtin: '#a04fb8',
                entity: '#2f8f5b',
                meta: '#8a8f98'
            })
        },
        dark: {
            '--color-input': '#2a2c31',
            '--color-field': '#141518',
            '--color-tooltip': '#f7f8f8',
            '--color-overlay': 'rgb(0 0 0 / 0.6)',
            ...codeTokens({
                comment: '#62666d',
                keyword: '#8d96ff',
                string: '#68cc9d',
                number: '#f2a25c',
                function: '#6ea4ff',
                property: '#d0d6e0',
                builtin: '#c58bff',
                entity: '#68cc9d',
                meta: '#62666d'
            })
        }
    },
    typography: {
        headerSize: 13,
        headerWeight: '500',
        roleWeights: {
            body: '400',
            label: '500',
            button: '500',
            badge: '500',
            description: '400'
        }
    },
    chrome: {
        menuPaneling: false,
        surfacePaneling: false,
        travelingHighlight: false,
        interactiveCursor: 'default'
    }
};

export const builtInThemePresets: readonly Theme[] = [
    DEFAULT_THEME,
    magicTheme,
    bitsyTheme,
    openaiTheme,
    functionalTheme,
    figmaTheme,
    appleTheme,
    claudeTheme,
    googleTheme,
    shadcnTheme,
    linearTheme
];

export const defaultTheme = DEFAULT_THEME;
