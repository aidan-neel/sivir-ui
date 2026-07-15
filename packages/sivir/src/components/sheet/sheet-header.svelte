<script lang="ts">
	import { cn } from '@sivir/ui/utils';
	import type { SheetHeaderProps, SheetState } from '.';
	import Button from '@sivir/ui/components/button';
	import X from '@lucide/svelte/icons/x';
	import { states } from '@sivir/ui/internals/state.svelte.ts';
	import { getContext } from 'svelte';

	let { class: className, children, ...rest }: SheetHeaderProps = $props();

	const key = getContext<string>('key');
	const uiState = states[key].data as SheetState;
</script>

<div
	{...rest}
	class={cn(className, `flex flex-col gap-1 pb-[var(--sheet-header-padding-bottom,1.5rem)]`)}
>
	{@render children?.()}
	<Button
		onclick={() => {
			uiState.open = false;
		}}
		class="absolute top-3 right-3 size-8 text-foreground-muted"
		variant="ghost"
		aria-label="Close"
	>
		<X />
	</Button>
</div>
