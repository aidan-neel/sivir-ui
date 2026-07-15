<script lang="ts">
	import type { ModalConfirmProps } from '.';
	import { Button } from '@sivir/ui/components/button';
	import { cn } from '@sivir/ui/utils';
	import { getModalContext } from './context.svelte';

	let { class: className, children, onclick, ...rest }: ModalConfirmProps = $props();
	const modal = getModalContext();
</script>

<Button
	onclick={() => {
		modal.state.open = false;
		onclick?.();
	}}
	{...rest}
	class={cn(className, `flex sm:w-fit w-full flex-row gap-2 justify-center items-center`)}
>
	{@render children?.()}
</Button>
