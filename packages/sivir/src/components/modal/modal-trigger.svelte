<script lang="ts">
	import type { ModalTriggerProps } from '.';
	import { Button } from '@sivir/ui/components/button';
	import { getModalContext } from './context.svelte';

	let {
		class: className,
		children,
		element = $bindable(),
		onclick,
		...rest
	}: ModalTriggerProps = $props();

	const modal = getModalContext();
</script>

<Button
	bind:element
	aria-haspopup="dialog"
	aria-expanded={modal.state.open}
	aria-controls={modal.contentId}
	onclick={() => {
		modal.returnFocusEl = element;
		modal.state.open = true;
		onclick?.();
	}}
	class={className}
	{...rest}
>
	{@render children?.()}
</Button>
