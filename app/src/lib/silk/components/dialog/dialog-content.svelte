<script lang="ts">
	import * as Modal from '$lib/silk/components/modal';
	import { cn } from '$lib/silk/utils';
	import type { DialogContentProps } from '.';

	let {
		class: className,
		allowClickOutside = true,
		children,
		...rest
	}: DialogContentProps = $props();
</script>

<Modal.Content
	{allowClickOutside}
	role="dialog"
	panelIdPrefix="dialog"
	data-ui="dialog-content"
	class={cn(
		className,
		`bg-[var(--color-modal)] text-[var(--color-panel-foreground)] border border-border rounded-[var(--radius-lg)]`
	)}
	{...rest}
>
	{@render children?.()}
</Modal.Content>
