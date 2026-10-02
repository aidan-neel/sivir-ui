import type { Theme } from '@sivir-ui/svelte/themes/theme';
import { DEFAULT_FOUNDATION_COLORS } from './theme-draft';

export type StudioMode = 'light' | 'dark';

export type PresetSwatch = {
    brand: string;
    onBrand: string;
    background: string;
    base: string;
    foreground: string;
    border: string;
};

export type CssChangeSummary = {
    count: number;
    css: string;
};

const DECLARATION_PATTERN = /^\s*(--[\w-]+)\s*:\s*(.+?);?\s*$/;

export function presetSwatch(theme: Theme, mode: StudioMode): PresetSwatch {
    const fallback = DEFAULT_FOUNDATION_COLORS[mode];
    const foundation = theme.foundation?.[mode];
    const tokenBrand =
        theme.tokens?.[mode]?.['--color-primary'] ?? theme.tokens?.shared?.['--color-primary'];

    return {
        brand: tokenBrand ?? theme.brand,
        onBrand: foundation?.onPrimary ?? fallback.onPrimary,
        background: foundation?.background ?? fallback.background,
        base: foundation?.base ?? fallback.base,
        foreground: foundation?.foreground ?? fallback.foreground,
        border: foundation?.border ?? fallback.border
    };
}

function declarationsBySelector(css: string): Map<string, Map<string, string>> {
    const blocks = new Map<string, Map<string, string>>();
    let selector = '';
    let pendingSelector = '';

    for (const line of css.split('\n')) {
        const trimmed = line.trim();
        if (trimmed.endsWith(',')) {
            pendingSelector = `${pendingSelector}${trimmed} `;
            continue;
        }
        if (trimmed.endsWith('{')) {
            selector = `${pendingSelector}${trimmed.slice(0, -1).trim()}`;
            pendingSelector = '';
            if (!blocks.has(selector)) {
                blocks.set(selector, new Map());
            }
            continue;
        }
        const match = DECLARATION_PATTERN.exec(trimmed);
        if (match) {
            blocks.get(selector)?.set(match[1], match[2]);
        }
    }

    return blocks;
}

/** Lists the custom properties in `css` whose value differs from `baseCss`, grouped by selector. */
export function cssChanges(css: string, baseCss: string): CssChangeSummary {
    const current = declarationsBySelector(css);
    const base = declarationsBySelector(baseCss);
    const sections: string[] = [];
    let count = 0;

    for (const [selector, declarations] of current) {
        const lines: string[] = [];
        for (const [name, value] of declarations) {
            if (base.get(selector)?.get(name) !== value) {
                lines.push(`    ${name}: ${value};`);
            }
        }
        if (lines.length > 0) {
            count += lines.length;
            sections.push(`${selector} {\n${lines.join('\n')}\n}`);
        }
    }

    return {
        count,
        css: sections.join('\n\n')
    };
}

export type SurfaceTransitionParams = {
    y?: number;
    delay?: number;
    direction?: 'in' | 'out';
};

function motionToken(name: string, fallback: number) {
    if (typeof window === 'undefined') {
        return fallback;
    }

    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const amount = Number.parseFloat(raw);

    if (!Number.isFinite(amount)) {
        return fallback;
    }

    return raw.endsWith('ms') ? amount : amount * 1000;
}

function easeOutQuint(t: number) {
    return 1 - (1 - t) ** 5;
}

export function surfaceTransition(
    _node: Element,
    { y = -6, delay = 0, direction = 'in' }: SurfaceTransitionParams = {}
) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration =
        direction === 'in'
            ? motionToken('--motion-duration-modal-in', 180) * 1.2
            : motionToken('--motion-duration-modal-out', 110);

    return {
        delay,
        duration: reduced ? 0 : duration,
        easing: easeOutQuint,
        css: (t: number, u: number) => {
            return [
                `opacity: ${t}`,
                `transform: translateY(${u * y}px) scale(${1 - u * 0.025})`,
                `filter: blur(${u * 4}px)`
            ].join(';');
        }
    };
}

export type NamedTokenRow = {
    definition: {
        name: string;
    };
};
