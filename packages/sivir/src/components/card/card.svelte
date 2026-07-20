<script lang="ts">
	import { cn } from '@sivir/ui/utils';
	import { type Snippet } from 'svelte';
	import { CARD_PANEL_FRAME, CARD_PANEL_SURFACE } from './surface';

	let {
		children,
		class: classProp,
		variant = 'default',
		...rest
	}: {
		children: Snippet;
		class?: string;
		variant?: 'default' | 'panel';
	} = $props();
</script>

{#if variant === 'panel'}
	<div
		data-ui="card"
		data-variant="panel"
		{...rest}
		class={cn(classProp, CARD_PANEL_FRAME, 'flex flex-col')}
	>
		<div data-ui="card-surface" class={cn(CARD_PANEL_SURFACE, 'flex min-h-0 flex-1 flex-col p-6')}>
			{@render children?.()}
		</div>
	</div>
{:else}
	<div
		data-ui="card"
		data-variant="default"
		{...rest}
		class={cn(
			classProp,
			'flex flex-col rounded-[var(--radius-lg)] border border-border bg-card p-6'
		)}
	>
		{@render children?.()}
	</div>
{/if}
