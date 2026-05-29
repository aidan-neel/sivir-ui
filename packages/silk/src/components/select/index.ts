import Root from './select.svelte';
import Trigger from './select-trigger.svelte';
import Label from './select-label.svelte';
import Item from './select-item.svelte';
import Content from './select-content.svelte';
import type { PopoverState } from '@silk/ui/components/popover';

export type SelectState = PopoverState & {
	values: Set<string>;
	labels: Map<string, string>;
	value: string;
	selectedLabel: string;
};

export { Root, Trigger, Label, Item, Content };
