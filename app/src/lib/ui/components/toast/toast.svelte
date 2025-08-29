<script lang="ts">
	import { flyAndScale } from '$lib/ui/internals/transition';
	import { cn } from '$lib/ui/utils';
	import Check from '@lucide/svelte/icons/circle-check';
	import X from '@lucide/svelte/icons/x';
	import Warning from '@lucide/svelte/icons/triangle-alert';
	import Info from '@lucide/svelte/icons/info';
	import type { Toast } from './lib.svelte';
	import Button from '$lib/ui/components/button';

	const { toast, index }: { toast: Toast; index: number } = $props();

    function getToastScale(index: number, total = 1, minScale = 0.9, maxScale = 1) {
        if (total === 1) return maxScale;
        return Math.max(maxScale - ((total - 1 - index) * (maxScale - minScale) / (total - 1)), minScale);
    }
</script>

<div
    role="alert"
    aria-live="polite"
    aria-atomic="true"
	in:flyAndScale={{ y: -40 }}
    out:flyAndScale={{ y: 40 }}
	class={cn(
		'border p-4 bg-popover max-w-[500px] gap-3 flex flex-row items-center shadow-xs fixed rounded-lg z-[999] left-1/2 -translate-x-1/2',
	)}
	style={`top: ${16 + index * 6}px; transform: scale(${getToastScale(index, 5, 0.9, 1)})`}
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
		<Check size="20" class="mt-1 text-primary" />
	{/if}
	{#if toast.type == 'error'}
		<X size="20" class="mt-1 text-error" />
	{/if}
	{#if toast.type == 'warning'}
		<Warning size="20" class="mt-1 text-warning" />
	{/if}
	<header class="flex flex-col gap-0">
		<p class="font-medium text-sm text-foreground tracking-tight">
			{toast.title}
		</p>
		<p class="text-sm text-foreground-muted">
			{toast.description}
		</p>
	</header>
    {#if toast.actions}
        <div class="flex flex-row gap-4 ml-1">
            {#each toast.actions as action}
                <Button
                    variant="primary"
                    class="text-[13.75px] h-7 rounded-lg"
                    onclick={action.callback}
                >
                    {action.label}
                </Button>
            {/each}
        </div>
    {/if}
</div>
