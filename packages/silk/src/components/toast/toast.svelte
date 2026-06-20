<!-- token-lint-disable-file -->
<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import Check from '@lucide/svelte/icons/circle-check';
	import X from '@lucide/svelte/icons/x';
	import Warning from '@lucide/svelte/icons/triangle-alert';
	import Info from '@lucide/svelte/icons/info';
	import CircleX from '@lucide/svelte/icons/circle-x';
	import Loader from '@lucide/svelte/icons/loader-circle';
	import type { Toast } from './lib.svelte';
	import { dismissToast, pauseToast, resumeToast } from './lib.svelte';
	import Button from '@silk/ui/components/button';

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
		if (toast.type === 'success')
			return 'text-[var(--color-success)] bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)]';
		if (toast.type === 'error')
			return 'text-[var(--color-error)] bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)]';
		if (toast.type === 'warning')
			return 'text-[var(--color-warning)] bg-[color-mix(in_srgb,var(--color-warning)_12%,transparent)]';
		if (toast.type === 'info')
			return 'text-[var(--color-info)] bg-[color-mix(in_srgb,var(--color-info)_12%,transparent)]';
		if (toast.type === 'loading') return 'text-foreground-muted bg-secondary/40';
		return '';
	});

	const progressColorClass = $derived.by(() => {
		if (toast.type === 'success') return 'bg-[var(--color-success)]';
		if (toast.type === 'error') return 'bg-[var(--color-error)]';
		if (toast.type === 'warning') return 'bg-[var(--color-warning)]';
		if (toast.type === 'info') return 'bg-[var(--color-info)]';
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
		'rounded-[calc(var(--radius-lg)+0.15rem)] border border-border',
		'bg-[var(--toast-bg)] shadow-[var(--toast-shadow)] backdrop-blur-[14px]',
		'ring-1 ring-black/4 sm:ring-0',
		'text-foreground'
	)}
	onmouseenter={() => toast.id !== undefined && pauseToast(toast.id)}
	onmouseleave={() => toast.id !== undefined && resumeToast(toast.id)}
>
	<div class="flex items-start gap-3 px-[var(--toast-padding-x)] py-[var(--toast-padding-y)]">
		{#if Icon}
			<div
				class={cn(
					'mt-0.5 flex size-[var(--toast-icon-size)] shrink-0 items-center justify-center rounded-md',
					iconColorClass
				)}
			>
				<Icon size="13" class={toast.type === 'loading' ? 'animate-spin' : ''} />
			</div>
		{/if}

		<div class="flex min-w-0 flex-1 flex-col gap-0.5">
			<p
				class="[font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] leading-snug tracking-[-0.015em] text-foreground"
			>
				{toast.title}
			</p>
			{#if toast.description}
				<p
					class="[font-size:var(--font-size-body,16px)] leading-[1.45] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted"
				>
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
					'mt-0.5 inline-flex size-[var(--toast-close-size)] shrink-0 items-center justify-center rounded-md',
					'text-foreground-muted opacity-0 transition-[opacity,background-color,color] [transition-duration:var(--motion-duration-hover)] ease-[var(--ease-out)]',
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
			class={cn(
				'absolute bottom-0 left-0 h-[2px] w-full origin-left opacity-40',
				progressColorClass
			)}
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
