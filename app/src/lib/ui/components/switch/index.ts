import type { DefaultProps } from '$lib/ui/utils';
import Switch from './switch.svelte';

export type SwitchState = {
	switched: boolean;
};

export type SwitchProps = {
	switched: boolean;
	label?: string;
} & DefaultProps;

export default Switch;
export { Switch };
