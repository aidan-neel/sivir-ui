import type { Snippet } from 'svelte';
import type { DefaultProps } from '$lib/silk/utils';
import ScrollArea from './scroll-area.svelte';

export type ScrollAreaProps = {
	orientation?: 'vertical' | 'horizontal' | 'both';
	children?: Snippet;
} & DefaultProps;

export { ScrollArea };
export default ScrollArea;
