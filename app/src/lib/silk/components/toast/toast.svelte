<script lang="ts">
	import { cn } from '$lib/silk/utils';
	import Check from '@lucide/svelte/icons/circle-check';
	import X from '@lucide/svelte/icons/x';
	import Warning from '@lucide/svelte/icons/triangle-alert';
	import Info from '@lucide/svelte/icons/info';
	import CircleX from '@lucide/svelte/icons/circle-x';
	import Loader from '@lucide/svelte/icons/loader-circle';
	import type { Toast } from './lib.svelte';
	import { dismissToast, pauseToast, resumeToast } from './lib.svelte';
	import Button from '$lib/silk/components/button';

	const { toast }: { toast: Toast } = $props();

	const Icon = $derived.by(() => {
		if (toast.type === 'success') return Check;
		if (toast.type === 'error') return CircleX;
		if (toast.type === 'warning') return Warning;
		if (toast.type === 'loading') return Loader;
		if (toast.type === 'info') return Info;
		return null;
	});

	const iconColorClass = $derived.by(() => {
		if (toast.type === 'success') return 'text-emerald-500 bg-emerald-500/10';
		if (toast.type === 'error') return 'text-red-500 bg-red-500/10';
		if (toast.type === 'warning') return 'text-amber-500 bg-amber-500/10';
		if (toast.type === 'info') return 'text-blue-500 bg-blue-500/10';
		if (toast.type === 'loading') return 'text-foreground-muted bg-secondary/40';
		return '';
	});

	const progressColorClass = $derived.by(() => {
		if (toast.type === 'success') return 'bg-emerald-500';
		if (toast.type === 'error') return 'bg-red-500';
		if (toast.type === 'warning') return 'bg-amber-500';
		if (toast.type === 'info') return 'bg-blue-500';
		return 'bg-foreground-muted';
	});
</script>

<div
	data-ui="toast"
	role="alert"
	aria-live="polite"
	aria-atomic="true"
	class={cn(
		'group relative flex w-full flex-col overflow-hidden',
		'rounded-[var(--toast-radius)] border border-[var(--toast-border)]',
		'bg-[var(--toast-bg)] shadow-[var(--toast-shadow)] backdrop-blur-[14px]',
		'text-foreground'
	)}
	onmouseenter={() => toast.id !== undefined && pauseToast(toast.id)}
	onmouseleave={() => toast.id !== undefined && resumeToast(toast.id)}
>
	<div class="flex items-start gap-3 px-4 py-3.5">
		{#if Icon}
			<div
				class={cn(
					'mt-0.5 flex size-[1.65rem] shrink-0 items-center justify-center rounded-md',
					iconColorClass
				)}
			>
				<Icon size="13" class={toast.type === 'loading' ? 'animate-spin' : ''} />
			</div>
		{/if}

		<div class="flex min-w-0 flex-1 flex-col gap-0.5">
			<p
				class="text-[0.875rem] font-medium leading-snug tracking-[-0.015em] text-foreground [font-family:var(--font-header),sans-serif]"
			>
				{toast.title}
			</p>
			{#if toast.description}
				<p class="text-[0.8125rem] leading-[1.45] text-foreground-muted">
					{toast.description}
				</p>
			{/if}

			{#if toast.actions?.length}
				<div class="mt-2.5 flex flex-row items-center gap-2">
					{#each toast.actions as action}
						<Button
							variant={action.variant ?? 'secondary'}
							class="py-0 h-7 min-h-7 shrink-0 rounded-lg px-2 text-[11.5px]"
							onclick={() => {
								action.callback();
								if (toast.id !== undefined) dismissToast(toast.id);
							}}
						>
							{action.label}
						</Button>
					{/each}
				</div>
			{/if}
		</div>

		{#if toast.exitable && toast.id !== undefined}
			<button
				type="button"
				onclick={() => dismissToast(toast.id!)}
				class={cn(
					'mt-0.5 inline-flex size-[1.2rem] shrink-0 items-center justify-center rounded-md',
					'text-foreground-muted opacity-0 transition-all duration-200',
					'hover:bg-secondary/50 hover:text-foreground',
					'group-hover:opacity-100'
				)}
				aria-label="Dismiss notification"
			>
				<X size="13" />
			</button>
		{/if}
	</div>

	{#if !toast.persistent && toast.duration}
		<div
			class={cn('absolute bottom-0 left-0 h-[2px] w-full origin-left opacity-40', progressColorClass)}
			style="animation: silk-toast-progress {toast.duration}ms linear forwards; animation-play-state: {toast.paused
				? 'paused'
				: 'running'};"
		></div>
	{/if}
</div>

<style>
	:global {
		@keyframes silk-toast-progress {
			from {
				transform: scaleX(1);
			}
			to {
				transform: scaleX(0);
			}
		}
	}
</style>
