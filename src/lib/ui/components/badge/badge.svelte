<script lang="ts">
	import type { Snippet } from 'svelte';
	import { badge } from './variants';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '$lib/ui/utils';

	let {
		variant = 'primary',
		children,
		class: classProp,
		href,
		...rest
	}: {
		variant?: 'primary' | 'flat' | 'outlined' | 'secondary' | 'ghost' | 'alternate' | 'destructive';
		children?: Snippet;
		class?: string;
		href?: string;
	} & HTMLButtonAttributes = $props();
</script>

{#if href}
	<a {href} class={cn(classProp, badge({ variant: variant }))} {...rest}>
		{@render children?.()}
	</a>
{:else}
	<div class={cn(classProp, badge({ variant: variant }))} {...rest}>
		{@render children?.()}
	</div>
{/if}
