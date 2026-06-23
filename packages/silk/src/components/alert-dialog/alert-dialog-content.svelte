<script lang="ts">
	import * as Modal from '@silk/ui/components/modal';
	import { cn, type DefaultProps } from '@silk/ui/utils';

	type Props = {
		allowClickOutside?: boolean;
		/** Max-width preset (maps to the --modal-width-* tokens). Defaults to `md`. */
		size?: 'sm' | 'md' | 'lg' | 'xl';
		/** Show the top-right close (X) button. Defaults to `true`. */
		showClose?: boolean;
	} & DefaultProps;

	let {
		class: className,
		allowClickOutside = false,
		size = 'md',
		showClose = true,
		children,
		...rest
	}: Props = $props();
</script>

<Modal.Content
	{allowClickOutside}
	{size}
	{showClose}
	role="alertdialog"
	panelIdPrefix="alert-dialog"
	data-ui="alert-dialog-content"
	class={cn(
		className,
		`bg-[var(--color-panel)] text-[var(--color-foreground)] border border-border rounded-[var(--radius-xl)]`
	)}
	{...rest}
>
	{@render children?.()}
</Modal.Content>
