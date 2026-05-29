import type { Snippet } from 'svelte';
import type { DefaultProps } from '@silk/ui/utils';
import Marquee from './marquee.svelte';

export type MarqueeProps = {
	children?: Snippet;
	direction?: 'left' | 'right';
	duration?: string;
	gap?: string;
	pauseOnHover?: boolean;
	reverse?: boolean;
	repeat?: number;
	vertical?: boolean;
} & DefaultProps;

export { Marquee };
export default Marquee;
