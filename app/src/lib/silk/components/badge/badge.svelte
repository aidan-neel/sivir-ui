<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import { badge } from './variants';
	import { cn } from '$lib/silk/utils';

	let {
		variant = 'primary',
		children,
		class: classProp,
		href,
		icon: Icon,
		iconSize = 13,
		...rest
	}: {
		variant?: 'primary' | 'flat' | 'outlined' | 'secondary' | 'ghost' | 'alternate' | 'destructive';
		children?: Snippet;
		class?: string;
		href?: string;
		icon?: Component<{ size?: number | string; class?: string }>;
		iconSize?: number | string;
	} & Record<string, unknown> = $props();
</script>

{#snippet inner()}
	{#if Icon}
		<Icon size={iconSize} class="text-foreground-muted" />
	{/if}
	{@render children?.()}
{/snippet}

{#if href}
	<a
		data-ui="badge"
		data-variant={variant}
		{href}
		class={cn(classProp, badge({ variant }))}
		{...rest}
	>
		{@render inner()}
	</a>
{:else}
	<div
		data-ui="badge"
		data-variant={variant}
		role="status"
		class={cn(classProp, badge({ variant }))}
		{...rest}
	>
		{@render inner()}
	</div>
{/if}
