import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { Snippet } from 'svelte';
import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { ButtonProps } from '../button';
import Root from './sidebar.svelte';
import Content from './sidebar-content.svelte';
import Footer from './sidebar-footer.svelte';
import Group from './sidebar-group.svelte';
import GroupContent from './sidebar-group-content.svelte';
import GroupLabel from './sidebar-group-label.svelte';
import Header from './sidebar-header.svelte';
import Inset from './sidebar-inset.svelte';
import Item from './sidebar-item.svelte';
import ItemAction from './sidebar-item-action.svelte';
import ItemBadge from './sidebar-item-badge.svelte';
import ItemButton from './sidebar-item-button.svelte';
import ItemLabel from './sidebar-item-label.svelte';
import Menu from './sidebar-menu.svelte';
import Panel from './sidebar-panel.svelte';
import Trigger from './sidebar-trigger.svelte';

export type SidebarProps = {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    openMobile?: boolean;
    onOpenMobileChange?: (open: boolean) => void;
    variant?: 'sidebar' | 'inset';
    /**
     * `offcanvas` slides the panel fully out of view, `icon` shrinks it to an
     * icon rail, and `none` keeps it expanded on desktop.
     */
    collapsible?: 'offcanvas' | 'icon' | 'none';
} & DefaultProps;

export type SidebarPanelProps = {
    side?: 'left' | 'right';
    'aria-label'?: string;
} & DefaultProps;

export type SidebarInsetProps = DefaultProps;
export type SidebarTriggerProps = ButtonProps;
export type SidebarHeaderProps = DefaultProps;
export type SidebarContentProps = DefaultProps;
export type SidebarFooterProps = DefaultProps;

export type SidebarGroupProps = DefaultProps &
    (
        | {
              collapsible?: false;
              open?: never;
              onOpenChange?: never;
          }
        | {
              collapsible: true;
              open?: boolean;
              onOpenChange?: (open: boolean) => void;
          }
    );

export type SidebarGroupLabelProps = DefaultProps;
export type SidebarGroupContentProps = DefaultProps;
export type SidebarMenuProps = DefaultProps;
export type SidebarItemProps = DefaultProps;

type SidebarItemButtonBaseProps = {
    active?: boolean;
    /** Label shown in a tooltip while the sidebar is collapsed to its icon rail. */
    tooltip?: string;
    class?: string;
    children?: Snippet;
};

export type SidebarItemButtonProps = SidebarItemButtonBaseProps &
    (
        | ({
              href: string;
          } & Omit<HTMLAnchorAttributes, 'class' | 'children' | 'href'>)
        | ({
              href?: undefined;
          } & Omit<HTMLButtonAttributes, 'class' | 'children'>)
    );

export type SidebarItemLabelProps = DefaultProps;
export type SidebarItemBadgeProps = DefaultProps;

export type SidebarItemActionProps = ButtonProps & {
    'aria-label': string;
};

export {
    Content,
    Footer,
    Group,
    GroupContent,
    GroupLabel,
    Header,
    Inset,
    Item,
    ItemAction,
    ItemBadge,
    ItemButton,
    ItemLabel,
    Menu,
    Panel,
    Root,
    Trigger
};
