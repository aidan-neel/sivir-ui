import type { DefaultProps } from '$lib/ui/utils';
import Root from './dialog.svelte';
import Trigger from './dialog-trigger.svelte';
import Content from './dialog-content.svelte';
import Title from './dialog-title.svelte';
import Description from './dialog-description.svelte';
import Footer from './dialog-footer.svelte';
import Header from './dialog-header.svelte';
import Exit from './dialog-exit.svelte';
import Confirm from './dialog-confirm.svelte';
import type { ButtonProps } from '../button';

export type DialogState = {
	open: boolean;
};

export type DialogTriggerProps = {} & ButtonProps;
export type DialogTitleProps = {} & DefaultProps;
export type DialogHeaderProps = {} & DefaultProps;
export type DialogFooterProps = {} & DefaultProps;

export type DialogConfirmProps = {
	onclick?: () => any;
} & DefaultProps;

export type DialogExitProps = {
	onclick?: () => any;
} & DefaultProps;

export type DialogDescriptionProps = {} & DefaultProps;

export type DialogContentProps = {
	allowClickOutside?: boolean;
} & DefaultProps;

export type DialogCloseProps = {} & DefaultProps;

export type DialogProps = {
	open: boolean;
} & DefaultProps;

export { Root, Trigger, Content, Title, Description, Header, Exit, Footer, Confirm };
