import type { DefaultProps } from '$lib/silk/utils';
import Separator from './separator.svelte';

export type SeparatorProps = {
	orientation?: 'horizontal' | 'vertical';
	decorative?: boolean;
} & DefaultProps;

export { Separator };
export default Separator;
