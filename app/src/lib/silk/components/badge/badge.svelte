<script lang="ts">
	import type { Snippet } from 'svelte';
	import { badge } from './variants';
	import { cn } from '$lib/silk/utils';

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
	} & Record<string, unknown> = $props();
</script>

{#if href}
	<a data-ui="badge" data-variant={variant} {href} class={cn(classProp, badge({ variant }))} {...rest}>
		{@render children?.()}
	</a>
{:else}
	<div data-ui="badge" data-variant={variant} role="status" class={cn(classProp, badge({ variant }))} {...rest}>
		{@render children?.()}
	</div>
{/if}
