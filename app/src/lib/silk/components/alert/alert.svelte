<script lang="ts">
	import type { Snippet } from 'svelte';
	import { alert } from './variants';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '$lib/silk/utils';
	import Check from '@lucide/svelte/icons/circle-check';
	import X from '@lucide/svelte/icons/x';
	import Warning from '@lucide/svelte/icons/triangle-alert';
	import Info from '@lucide/svelte/icons/info';

	let {
		variant = 'info',
		children,
		class: classProp,
		...rest
	}: {
		variant?: 'info' | 'error' | 'success' | 'warning';
		children: Snippet;
		class?: string;
	} = $props();
</script>

<div role="alert" class={cn(classProp, alert({ variant: variant }))}>
	{#if variant == 'info'}
		<Info size="18" aria-hidden="true" class="mt-1 text-foreground" />
	{/if}
	{#if variant == 'success'}
		<Check size="18" aria-hidden="true" class="mt-1 text-success" />
	{/if}
	{#if variant == 'error'}
		<X size="18" aria-hidden="true" class="mt-1 text-error" />
	{/if}
	{#if variant == 'warning'}
		<Warning size="18" aria-hidden="true" class="mt-1 text-warning" />
	{/if}
	<header class="flex flex-col">
		{@render children?.()}
	</header>
</div>
