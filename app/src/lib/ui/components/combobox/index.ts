import Root from './combobox.svelte';
import Content from './combobox-content.svelte';
import Trigger from './combobox-trigger.svelte';
import Results from './combobox-results.svelte';
import Search from './combobox-search.svelte';
import Item from './combobox-item.svelte';
import type { PopoverState } from '$lib/ui/components/popover';
import type { DefaultProps } from '$lib/ui/utils';

export type ComboboxItem = {
	value: string;
	label: string;
	callback: () => void;
	ref: HTMLButtonElement | HTMLAnchorElement | undefined;
};

export type ComboboxState = {
	open: boolean;
	items: Set<ComboboxItem>;
	results: Set<ComboboxItem>;
	searchContent: string;
	selected?: ComboboxItem;
} & PopoverState;

export type ComboboxSearchProps = {
	threshold?: number;
	placeholder?: string;
} & DefaultProps;

export { Root, Content, Trigger, Results, Search, Item };
