import type { DefaultProps } from '@sivir-ui/svelte/utils';
import Root from './slider.svelte';
import Label from './slider-label.svelte';
import Range from './slider-range.svelte';
import Thumb from './slider-thumb.svelte';
import Value from './slider-value.svelte';

export type SliderProps = {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    /** Visible label in the default layout; the accessible name when composing parts without `Slider.Label`. */
    label?: string;
    name?: string;
    format?: (value: number) => string;
    onValueChange?: (value: number) => void;
    /** Fires once per gesture on pointer release, and on each keyboard change. */
    onValueCommit?: (value: number) => void;
} & DefaultProps;

export type SliderRangeProps = Omit<DefaultProps, 'children'>;

export type SliderThumbProps = Omit<DefaultProps, 'children'>;

export type SliderLabelProps = DefaultProps;

export type SliderValueProps = Omit<DefaultProps, 'children'>;

export { default as Slider } from './slider.svelte';
export { Label, Range, Root, Thumb, Value };
export default Root;
