<script lang="ts">
	import { cn } from "$lib/silk/utils";
	import type { DialogHeaderProps, DialogState } from ".";
	import Button from "$lib/silk/components/button";
    import X from "@lucide/svelte/icons/x"
	import { states } from '$lib/silk/internals/state.svelte.ts';
	import { getContext } from 'svelte';

    let { class: className, children, ...rest }: DialogHeaderProps = $props();

    const key = getContext<string>('key');
    const uiState = states[key].data as DialogState;
</script>

<div
	{...rest}
	class={cn(className, 'relative flex flex-col gap-[var(--modal-title-description-gap,6px)]')}
>
	{@render children?.()}
	<Button
		onclick={() => {
			uiState.open = false;
		}}
		size="icon"
		class="absolute top-3 right-3 text-foreground-muted"
		variant="ghost"
	>
		<X />
	</Button>
</div>
