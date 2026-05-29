import Root from './breadcrumb.svelte';
import Item from './breadcrumb-item.svelte';
import Separator from './breadcrumb-separator.svelte';
import type { DefaultProps } from '@silk/ui/utils';

export type BreadcrumbProps = {} & DefaultProps;
export type BreadcrumbItemProps = {
	href?: string;
} & DefaultProps;
export type BreadcrumbSeparatorProps = {} & DefaultProps;

export { Root, Item, Separator };
