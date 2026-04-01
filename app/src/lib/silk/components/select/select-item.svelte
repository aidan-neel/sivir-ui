<script lang="ts">
	import { Button, type ButtonProps } from '$lib/silk/components/button';
	import { states } from '$lib/silk/internals/state.svelte.ts';
	import { cn } from '$lib/silk/utils';
	import { getContext, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Check from '@lucide/svelte/icons/check';
	import { flyAndScale } from '$lib/silk/internals/transition';

	const key = getContext('key') as string;
	const uiState = states[key];

	type Props = {
		value: string;
	} & ButtonProps;

	let { children, class: className, value, ...rest }: Props = $props();

	$effect(() => {
		uiState.data.values.add(value);
	});
</script>

<Button
	onclick={() => {
		uiState.data.value = value;
		setTimeout(() => {
			uiState.data.open = false;
		}, 1);
	}}
	{...rest}
	class={cn(
		className,
		'min-h-[var(--menu-item-height)] px-[var(--menu-item-padding-x)] rounded-[var(--menu-item-radius)] text-[var(--menu-item-foreground)] border border-transparent transition-[background-color,border-color,color,box-shadow] duration-150 hover:bg-[var(--menu-item-hover-bg)] hover:border-[var(--menu-item-hover-border)] hover:shadow-[inset_0_1px_0_color-mix(in_srgb,var(--panel-highlight)_44%,transparent)] data-[active=true]:bg-[var(--menu-item-hover-bg)] data-[active=true]:border-[var(--menu-item-hover-border)] data-[active=true]:shadow-[inset_0_1px_0_color-mix(in_srgb,var(--panel-highlight)_44%,transparent)] data-[selected=true]:bg-[var(--menu-item-active-bg)] w-full text-[14px] duration-50 font-medium hover:cursor-default px-2 items-center justify-between text-left'
	)}
	variant={'ghost'}
>
	{@render children?.()}

	{#if uiState.data.value === value}
		<div>
			<Check />
		</div>
	{/if}
</Button>
