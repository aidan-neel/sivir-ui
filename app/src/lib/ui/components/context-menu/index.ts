import Root from './context-menu.svelte';
import Content from './context-menu-content.svelte';
import Item from './context-menu-item.svelte';
import CheckboxItem from './context-menu-checkbox-item.svelte';
import Separator from './context-menu-separator.svelte';
import SubContent from './context-menu-sub-content.svelte';
import SubTrigger from './context-menu-sub-trigger.svelte';
import Sub from './context-menu-sub.svelte';
import Trigger from './context-menu-trigger.svelte';

import type { DefaultProps } from '$lib/ui/utils';
import type { PopoverState } from '../popover';
import type { VirtualElement } from '@floating-ui/dom';
import type { ButtonProps } from '../button';

export type ContextMenuProps = {} & DefaultProps;
export type ContextMenuContentProps = {} & DefaultProps;

export type ContextMenuItemProps = {
	callback?: () => any;
	inset?: boolean;
} & DefaultProps &
	ButtonProps;

export type ContextMenuCheckboxItemProps = {
	callback?: () => any;
	value: string;
	inset?: boolean;
	checked?: boolean;
} & DefaultProps &
	ButtonProps;

export type ContextMenuSeparatorProps = {} & DefaultProps;
export type ContextMenuSubContentProps = {} & DefaultProps;

export type ContextMenuSubTriggerProps = {
	inset?: boolean;
} & DefaultProps;

export type ContextMenuSubProps = {} & DefaultProps;
export type ContextMenuTriggerProps = {} & DefaultProps;

export type ContextMenuCheckboxItemState = {
	checked?: boolean;
	value: string;
};

export type ContextMenuState = {
	virtualElement?: VirtualElement;
	checkboxItems: Set<ContextMenuCheckboxItemState>;
} & PopoverState;

export { Root, Content, CheckboxItem, Item, Separator, SubContent, SubTrigger, Sub, Trigger };
