import Root from './sheet.svelte';
import Trigger from './sheet-trigger.svelte';
import Title from './sheet-title.svelte';
import Header from './sheet-header.svelte';
import Footer from './sheet-footer.svelte';
import Description from './sheet-description.svelte';
import Content from './sheet-content.svelte';
import Close from './sheet-close.svelte';

import type { DefaultProps } from '$lib/ui/utils';
import type { ButtonProps } from '../button';

export type SheetProps = {
	open?: boolean;
} & DefaultProps;

export type SheetTriggerProps = {} & ButtonProps;
export type SheetTitleProps = {} & DefaultProps;
export type SheetHeaderProps = {} & DefaultProps;
export type SheetFooterProps = {} & DefaultProps;
export type SheetDescriptionProps = {} & DefaultProps;
export type SheetContentProps = {
	allowClickOutside?: boolean;
	side?: 'left' | 'right';
} & DefaultProps;

export type SheetCloseProps = {} & DefaultProps;

export type SheetState = {
	open: boolean;
};

export { Root, Trigger, Title, Header, Footer, Description, Content, Close };
