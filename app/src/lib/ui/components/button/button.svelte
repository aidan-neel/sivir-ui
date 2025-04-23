<script lang="ts">
	import type { Snippet } from 'svelte';
	import { button } from './variants';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '$lib/ui/utils';

	let {
		href,
		variant = 'primary',
		children,
		class: classProp,
		element = $bindable(),
		...rest
	}: HTMLButtonAttributes & {
		href?: string;
		variant?: 'primary' | 'flat' | 'outlined' | 'secondary' | 'ghost' | 'alternate' | 'destructive';
		children?: Snippet;
		element?: HTMLButtonElement | HTMLAnchorElement | undefined;
	} = $props();
</script>

{#if href}
	<a
		bind:this={element}
		onclick={() => {}}
		{href}
		class={cn(classProp, button({ variant: variant }))}
		{...rest}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={element}
		onclick={() => {}}
		class={cn(classProp, button({ variant: variant }))}
		{...rest}
	>
		{@render children?.()}
	</button>
{/if}
