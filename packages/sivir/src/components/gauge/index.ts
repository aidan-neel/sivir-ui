import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { Snippet } from 'svelte';
import Root from './gauge.svelte';
import Indicator from './gauge-indicator.svelte';
import Track from './gauge-track.svelte';
import Value from './gauge-value.svelte';

export type GaugeTone = 'primary' | 'muted' | 'success' | 'warning' | 'error';

export type GaugeSize = 'sm' | 'md' | 'lg';

export type GaugeRootProps = {
    /** The bounded quantity shown by the filled arc. */
    value: number;
    max?: number;
    /** Describes the quantity, such as "Context remaining" or "Monthly API usage". */
    label?: string;
    tone?: GaugeTone;
    size?: GaugeSize;
    /** Defaults to Track, Indicator, and Value. Value is left out at the `sm` size. */
    children?: Snippet;
} & Omit<DefaultProps, 'children'>;

export type GaugeTrackProps = Omit<DefaultProps, 'children'>;

export type GaugeIndicatorProps = Omit<DefaultProps, 'children'>;

/** The animated reading. `percent` is a whole number that only reaches 0 or 100 at the bounds. */
export type GaugeValueState = Readonly<{
    value: number;
    max: number;
    percent: number;
}>;

export type GaugeValueProps = {
    children?: Snippet<[GaugeValueState]>;
} & Omit<DefaultProps, 'children'>;

export { Indicator, Root, Track, Value };
