export type ShadowLayer = {
    inset: boolean;
    x: number;
    y: number;
    blur: number;
    spread: number;
    color: string;
};

const LENGTH_PATTERN = /^-?(?:\d+|\d*\.\d+)(?:px)?$/;

export const defaultShadowLayer: ShadowLayer = {
    inset: false,
    x: 0,
    y: 4,
    blur: 12,
    spread: 0,
    color: 'rgb(0 0 0 / 0.08)'
};

function splitTopLevel(value: string, separator: ',' | ' ') {
    const parts: string[] = [];
    let depth = 0;
    let current = '';

    for (const character of value) {
        if (character === '(') {
            depth += 1;
        }

        if (character === ')') {
            depth -= 1;
        }

        const isSeparator =
            depth === 0 && (separator === ' ' ? /\s/.test(character) : character === separator);

        if (isSeparator) {
            if (current.trim()) {
                parts.push(current.trim());
            }

            current = '';
            continue;
        }

        current += character;
    }

    if (current.trim()) {
        parts.push(current.trim());
    }

    return parts;
}

function parseLayer(value: string): ShadowLayer | null {
    const tokens = splitTopLevel(value, ' ');
    const lengths: number[] = [];
    const colors: string[] = [];
    let inset = false;

    for (const token of tokens) {
        if (token.toLowerCase() === 'inset') {
            inset = true;
            continue;
        }

        if (LENGTH_PATTERN.test(token)) {
            lengths.push(Number.parseFloat(token));
            continue;
        }

        const looksLikeLength = /^-?[\d.]/.test(token) || /^(?:calc|min|max|clamp)\(/i.test(token);

        if (looksLikeLength) {
            return null;
        }

        colors.push(token);
    }

    const hasLengths = lengths.length >= 2 && lengths.length <= 4;
    const hasOneColor = colors.length === 1;

    if (!hasLengths || !hasOneColor) {
        return null;
    }

    return {
        inset,
        x: lengths[0] ?? 0,
        y: lengths[1] ?? 0,
        blur: lengths[2] ?? 0,
        spread: lengths[3] ?? 0,
        color: colors[0] ?? defaultShadowLayer.color
    };
}

/**
 * Parses a `box-shadow` value into editable layers. Returns `null` when any layer
 * uses a length the editor cannot represent, such as `var()` or `calc()`.
 */
export function parseShadow(value: string): ShadowLayer[] | null {
    const trimmed = value.trim();

    if (!trimmed || trimmed === 'none') {
        return [];
    }

    const layers: ShadowLayer[] = [];

    for (const part of splitTopLevel(trimmed, ',')) {
        const layer = parseLayer(part);

        if (!layer) {
            return null;
        }

        layers.push(layer);
    }

    return layers;
}

function formatLength(value: number) {
    const rounded = Math.round(value * 10) / 10;

    if (rounded === 0) {
        return '0';
    }

    return `${rounded}px`;
}

export function serializeShadow(layers: ShadowLayer[]): string {
    if (layers.length === 0) {
        return 'none';
    }

    return layers
        .map((layer) => {
            const lengths = [layer.x, layer.y, layer.blur, layer.spread].map(formatLength);
            const parts = [...lengths, layer.color];

            if (layer.inset) {
                parts.unshift('inset');
            }

            return parts.join(' ');
        })
        .join(', ');
}
