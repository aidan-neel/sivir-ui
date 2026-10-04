import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { Snippet } from 'svelte';
import type { HTMLAnchorAttributes, HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import Root from './navigation-menu.svelte';
import Content from './navigation-menu-content.svelte';
import Item from './navigation-menu-item.svelte';
import Link from './navigation-menu-link.svelte';
import LinkDescription from './navigation-menu-link-description.svelte';
import LinkTitle from './navigation-menu-link-title.svelte';
import List from './navigation-menu-list.svelte';
import Trigger from './navigation-menu-trigger.svelte';
import Viewport from './navigation-menu-viewport.svelte';

export type NavigationMenuProps = {
    /** The open item's `value`, or `''` while every panel is closed. */
    value?: string;
    onValueChange?: (value: string) => void;
    /** Milliseconds a pointer rests on a trigger before its panel opens. */
    openDelay?: number;
    /** Milliseconds after the pointer leaves before a hover-opened panel closes. */
    closeDelay?: number;
    'aria-label'?: string;
} & DefaultProps;

export type NavigationMenuListProps = DefaultProps;

export type NavigationMenuItemProps = {
    value?: string;
} & DefaultProps;

export type NavigationMenuTriggerProps = {
    class?: string;
    children?: Snippet;
} & Omit<HTMLButtonAttributes, 'class' | 'children' | 'type'>;

export type NavigationMenuContentProps = {
    class?: string;
    children?: Snippet;
} & Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'children'>;

export type NavigationMenuViewportProps = Omit<DefaultProps, 'children'>;

export type NavigationMenuLinkProps = {
    href: string;
    active?: boolean;
    class?: string;
    children?: Snippet;
} & Omit<HTMLAnchorAttributes, 'class' | 'children' | 'href'>;

export type NavigationMenuLinkTitleProps = DefaultProps;
export type NavigationMenuLinkDescriptionProps = DefaultProps;

export { Content, Item, Link, LinkDescription, LinkTitle, List, Root, Trigger, Viewport };
