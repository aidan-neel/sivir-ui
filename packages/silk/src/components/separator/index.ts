import type { DefaultProps } from '@silk/ui/utils';
import Separator from './separator.svelte';

export type SeparatorProps = {
	orientation?: 'horizontal' | 'vertical';
	decorative?: boolean;
} & DefaultProps;

export { Separator };
export default Separator;
