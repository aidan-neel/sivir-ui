import type { HTMLLabelAttributes } from 'svelte/elements';
import type { DefaultProps } from '@silk/ui/utils';
import Label from './label.svelte';

export type LabelProps = DefaultProps & HTMLLabelAttributes;

export { Label };
export default Label;
