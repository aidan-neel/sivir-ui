<script lang="ts">
	import { flyAndScale } from '$lib/ui/internals/transition';
	import { cn } from '$lib/ui/utils';
	import Check from '@lucide/svelte/icons/circle-check';
	import X from '@lucide/svelte/icons/x';
	import Warning from '@lucide/svelte/icons/triangle-alert';
	import Info from '@lucide/svelte/icons/info';
	import type { Toast } from './lib.svelte';

	export let toast: Toast;
	export let index: number;
</script>

<div
	transition:flyAndScale
	class={cn(
		'border p-4 bg-background gap-3 flex flex-row shadow-sm relative fixed rounded-lg transition-all duration-300 right-8'
	)}
	style="
        bottom: {24 + index * 2}px;
    "
>
	{#if toast.exitable}
		<button
			onclick={() => {
				if (toast.exit) {
					toast.exit();
				}
			}}
			class="text-foreground/50 duration-150 absolute top-4 right-4 hover:text-foreground"
		>
			<X size="20" />
		</button>
	{/if}
	{#if toast.type == 'success'}
		<Check size="22" class="mt-1 text-success" />
	{/if}
	{#if toast.type == 'error'}
		<X size="22" class="mt-1 text-error" />
	{/if}
	{#if toast.type == 'warning'}
		<Warning size="22" class="mt-1 text-warning" />
	{/if}
	<header class="flex flex-col gap-2">
		<p class="font-medium text-foreground tracking-tight">
			{toast.title}
		</p>
		<p class="text-sm text-foreground-muted">
			{toast.description}
		</p>
		{#if toast.actions}
			<div class="flex flex-row gap-4">
				{#each toast.actions as action}
					<button
						class="text-sm text-foreground hover:text-foreground-muted"
						onclick={action.callback}
					>
						{action.label}
					</button>
				{/each}
			</div>
		{/if}
	</header>
</div>
