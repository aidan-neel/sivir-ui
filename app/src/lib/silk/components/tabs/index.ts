import Root from './tabs.svelte';
import List from './tabs-list.svelte';
import Trigger from './tabs-trigger.svelte';
import Content from './tabs-content.svelte';
import type { DefaultProps } from '$lib/silk/utils';

export type TabsState = {
	id: string;
	value: string;
	orientation: 'horizontal' | 'vertical';
};

export type TabsProps = {
	value?: string;
	orientation?: 'horizontal' | 'vertical';
} & DefaultProps;

export type TabsListProps = {} & DefaultProps;

export type TabsTriggerProps = {
	value: string;
	disabled?: boolean;
} & DefaultProps;

export type TabsContentProps = {
	value: string;
	forceMount?: boolean;
} & DefaultProps;

export { Root, List, Trigger, Content };
