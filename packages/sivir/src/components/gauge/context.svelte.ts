import { createContext } from '@sivir-ui/svelte/utils';
import type { GaugeSize, GaugeTone } from '.';

export type GaugeGeometry = {
    box: number;
    stroke: number;
    path: string;
};

export type GaugeContext = {
    get value(): number;
    get current(): number;
    get max(): number;
    get tone(): GaugeTone;
    get size(): GaugeSize;
    get geometry(): GaugeGeometry;
};

const GAUGE_SIZES: Record<
    GaugeSize,
    {
        box: number;
        stroke: number;
    }
> = {
    sm: {
        box: 20,
        stroke: 3
    },
    md: {
        box: 32,
        stroke: 3
    },
    lg: {
        box: 56,
        stroke: 4.5
    }
};

function round(value: number) {
    return Math.round(value * 1000) / 1000;
}

export function gaugeGeometry(size: GaugeSize): GaugeGeometry {
    const { box, stroke } = GAUGE_SIZES[size];
    const center = box / 2;
    const radius = (box - stroke) / 2;
    const offset = radius * Math.SQRT1_2;
    const startX = round(center - offset);
    const endX = round(center + offset);
    const y = round(center + offset);
    const r = round(radius);

    return {
        box,
        stroke,
        path: `M ${startX} ${y} A ${r} ${r} 0 1 1 ${endX} ${y}`
    };
}

export function wholePercent(current: number, max: number) {
    const exact = (current / max) * 100;

    if (exact <= 0) {
        return 0;
    }

    if (exact >= 100) {
        return 100;
    }

    return Math.min(99, Math.max(1, Math.round(exact)));
}

const { set: setGaugeContext, get: getGaugeContext } = createContext<GaugeContext>('gauge');

export { getGaugeContext, setGaugeContext };
