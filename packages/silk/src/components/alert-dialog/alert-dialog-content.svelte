<script lang="ts">
	import * as Modal from '@silk/ui/components/modal';
	import { cn, type DefaultProps } from '@silk/ui/utils';

	type Props = {
		allowClickOutside?: boolean;
	} & DefaultProps;

	let { class: className, allowClickOutside = false, children, ...rest }: Props = $props();
</script>

<Modal.Content
	{allowClickOutside}
	role="alertdialog"
	panelIdPrefix="alert-dialog"
	data-ui="alert-dialog-content"
	class={cn(
		className,
		`bg-[var(--color-modal)] text-[var(--color-panel-foreground)] border border-border rounded-[var(--radius-xl)]`
	)}
	{...rest}
>
	{@render children?.()}
</Modal.Content>
