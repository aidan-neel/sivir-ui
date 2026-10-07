import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { HTMLAnchorAttributes, HTMLAttributes } from 'svelte/elements';
import Root from './source.svelte';
import Content from './source-content.svelte';
import Count from './source-count.svelte';
import Description from './source-description.svelte';
import Icon from './source-icon.svelte';
import Item from './source-item.svelte';
import Label from './source-label.svelte';
import Title from './source-title.svelte';

export type SourceRootProps = {
    /** The cited page. Absolute http and https links open in a new tab unless `target` is set. */
    href: string;
    /** How many pages back this chip. `Count` shows the ones beyond the first. Defaults to 1. */
    count?: number;
    /** Whether the `Content` card is showing. Only has an effect when the chip holds a `Content`. */
    open?: boolean;
    openDelay?: number;
    closeDelay?: number;
} & DefaultProps &
    Omit<HTMLAnchorAttributes, 'children' | 'href'>;

export type SourceIconProps = {
    /** Favicon or logo URL. Falls back when missing or when it fails to load. */
    src?: string;
    /** Text whose first character stands in for a missing icon, such as the site name. Without it, a globe shows. */
    fallback?: string;
} & Omit<DefaultProps, 'children'> &
    Omit<HTMLAttributes<HTMLSpanElement>, 'children'>;

export type SourceLabelProps = DefaultProps & Omit<HTMLAttributes<HTMLSpanElement>, 'children'>;

export type SourceCountProps = Omit<DefaultProps, 'children'> &
    Omit<HTMLAttributes<HTMLSpanElement>, 'children'>;

export type SourceContentProps = DefaultProps;

export type SourceItemProps = {
    href: string;
} & DefaultProps &
    Omit<HTMLAnchorAttributes, 'children' | 'href'>;

export type SourceTitleProps = DefaultProps & Omit<HTMLAttributes<HTMLSpanElement>, 'children'>;

export type SourceDescriptionProps = DefaultProps &
    Omit<HTMLAttributes<HTMLSpanElement>, 'children'>;

export { Content, Count, Description, Icon, Item, Label, Root, Title };
