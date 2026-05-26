import Root from './popover.svelte';
import Trigger from './popover-trigger.svelte';
import Content from './popover-content.svelte';
import Title from './popover-title.svelte';

import type { DefaultProps } from '$lib/silk/utils';
import type { Snippet } from 'svelte';
import type { UIState } from '$lib/silk/internals/state.svelte.ts';
import type { ButtonVariant } from '$lib/silk/components/button';
import type { VirtualElement } from '@floating-ui/dom';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';

export type PopoverContentProps = {
	children: Snippet;
	class?: string;
	allowClickOutside?: boolean;
	portal?: boolean;
	refElement?: VirtualElement;
	role?: 'dialog' | 'menu' | 'listbox';
	tabindex?: number;
} & DefaultProps &
	Partial<HTMLAttributes<HTMLElement>>;

export type PopoverProps = {
	open?: boolean;
	stateName?: string;
	placement?: 'top' | 'left' | 'bottom' | 'right';
	state_key?: string;
	state?: UIState<PopoverState>;
	hoverable?: boolean;
	delay?: number;
	closeDelay?: number;
} & DefaultProps;

export type PopoverTriggerProps = {
	icon?: boolean;
	variant?: ButtonVariant;
	size?: 'default' | 'icon';
	children?: Snippet;
	class?: string;
	element?: HTMLButtonElement | HTMLAnchorElement | undefined;
	onclick?: () => void;
	onhover?: () => void;
	onhoverend?: () => void;
	style?: string;
} &
	Pick<
		HTMLButtonAttributes,
		'disabled' | 'type' | 'name' | 'value' | 'id' | 'role' | 'tabindex' | 'aria-label' | 'aria-controls' | 'aria-expanded' | 'aria-haspopup'
	> &
	Partial<Record<`data-${string}`, string | boolean | null>>;
export type PopoverTitleProps = DefaultProps;

export type Placement = 'top' | 'left' | 'right' | 'bottom';

export type PopoverState = {
	open: boolean;
	focusedInside?: boolean;
	trigger: HTMLElement | null;
	focusedElement: HTMLElement | null;
	buttonRef: HTMLElement | null;
	popoverRef: HTMLElement | undefined;
	placement: Placement;
	onclick: (() => void) | undefined;
	closeTimeout: ReturnType<typeof setTimeout> | undefined;
	hoverTimeout?: ReturnType<typeof setTimeout> | undefined;
	hoverable: boolean;
	hovering?: boolean;
	delay: number | undefined;
	closeDelay: number | undefined;
};

export { Root, Trigger, Content, Title };
