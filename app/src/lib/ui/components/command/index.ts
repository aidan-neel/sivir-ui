import Root from './command.svelte';
import Content from './command-content.svelte';
import Trigger from './command-trigger.svelte';
import Separator from './command-separator.svelte';
import Results from './command-results.svelte';
import Search from './command-search.svelte';
import Item from './command-item.svelte';
import Group from './command-group.svelte';

export type CommandItem = {
	name: string;
	callback: () => void;
};

export type CommandState = {
	open: boolean;
	items: Set<CommandItem>;
	results: Set<CommandItem>;
	searchContent: string;
};

export { Root, Content, Trigger, Separator, Results, Search, Item, Group };
