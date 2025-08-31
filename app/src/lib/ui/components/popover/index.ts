import Root from './popover.svelte';
import Trigger from './popover-trigger.svelte';
import Content from './popover-content.svelte';
import Title from './popover-title.svelte';

import type { DefaultProps } from '$lib/ui/utils';
import type { Snippet } from 'svelte';
import type { UIState } from '$lib/ui/internals/state.svelte';
import type { ButtonProps } from '$lib/ui/components/button';
import type { VirtualElement } from '@floating-ui/dom';

export type PopoverContentProps = {
	children: Snippet;
	class?: string;
	allowClickOutside?: boolean;
	portal?: boolean;
	refElement?: VirtualElement;
} & DefaultProps;

export type PopoverProps = {
	open?: boolean;
	stateName?: string;
	placement?: 'top' | 'left' | 'bottom' | 'right';
	state_key?: string;
	state?: UIState<any>;
	hoverable?: boolean;
	delay?: number;
	closeDelay?: number;
} & DefaultProps;

export type PopoverTriggerProps = {
	icon?: boolean;
} & ButtonProps;
export type PopoverTitleProps = DefaultProps;

export type Placement = 'top' | 'left' | 'right' | 'bottom';

export type PopoverState = {
	open: boolean;
	focusedInside?: boolean;
	trigger: HTMLElement | null;
	focusedElement: HTMLElement | null;
	buttonRef: HTMLElement | null;
	popoverRef: HTMLElement | undefined;
	placement: Placement; // replace with the actual placement type if known
	onclick: (() => void) | undefined;
	closeTimeout: ReturnType<typeof setTimeout> | undefined;
	hoverable: boolean;
	hovering?: boolean;
	delay: number | undefined;
	closeDelay: number | undefined;
};

export { Root, Trigger, Content, Title };
