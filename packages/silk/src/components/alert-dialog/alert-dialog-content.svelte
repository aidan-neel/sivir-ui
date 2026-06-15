<script lang="ts">
	import * as Modal from '@silk/ui/components/modal';
	import { setContext } from 'svelte';
	import { cn, type DefaultProps } from '@silk/ui/utils';
	import { ALERT_DIALOG_VARIANT_KEY, type AlertDialogVariant } from '.';

	type Props = {
		allowClickOutside?: boolean;
		variant?: AlertDialogVariant;
	} & DefaultProps;

	let {
		class: className,
		allowClickOutside = false,
		variant = 'default',
		children,
		...rest
	}: Props = $props();

	// Broadcast the variant (as a getter so it stays reactive) to descendant
	// parts -- Title, Description, Footer, Confirm, Exit -- so they can opt into
	// the matching treatment.
	setContext(ALERT_DIALOG_VARIANT_KEY, () => variant);

	const panelClass = $derived(
		variant === 'spotlight'
			? 'text-center text-[var(--color-panel-foreground)] border border-border rounded-[1.5rem] gap-5 p-7 max-w-[26rem]'
			: 'text-[var(--color-panel-foreground)] border border-border rounded-[var(--radius-xl)]'
	);
</script>

<Modal.Content
	{allowClickOutside}
	role="alertdialog"
	panelIdPrefix="alert-dialog"
	data-ui="alert-dialog-content"
	data-variant={variant}
	class={cn(className, panelClass)}
	{...rest}
>
	{@render children?.()}
</Modal.Content>
