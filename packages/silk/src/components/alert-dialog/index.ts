import type { DefaultProps } from '@silk/ui/utils';
import Root from './alert-dialog.svelte';
import Trigger from './alert-dialog-trigger.svelte';
import Content from './alert-dialog-content.svelte';
import Header from './alert-dialog-header.svelte';
import Title from './alert-dialog-title.svelte';
import Description from './alert-dialog-description.svelte';
import Footer from './alert-dialog-footer.svelte';
import Exit from './alert-dialog-exit.svelte';
import Confirm from './alert-dialog-confirm.svelte';

export type AlertDialogState = {
	open: boolean;
	triggerRef?: HTMLElement | null;
};

export type AlertDialogProps = {
	open?: boolean;
} & DefaultProps;

/**
 * Visual treatment of the dialog surface.
 * - `default` -- themed panel matching the rest of silk's overlays.
 * - `spotlight` -- a focused, centered confirmation: a larger rounded surface,
 *   centered title and description, and two full-width actions (a neutral
 *   secondary Cancel beside the primary Confirm).
 */
export type AlertDialogVariant = 'default' | 'spotlight';

/** Context key `Content` uses to broadcast its variant to descendant parts. */
export const ALERT_DIALOG_VARIANT_KEY = 'silk-alert-dialog-variant';

export { Root, Trigger, Content, Header, Title, Description, Exit, Footer, Confirm };
