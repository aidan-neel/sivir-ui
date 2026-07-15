<script lang="ts">
	import { cn } from '@sivir/ui/utils';
	import type { ProgressProps } from '.';

	let {
		class: className,
		value = 0,
		max = 100,
		indeterminate = false,
		...rest
	}: ProgressProps = $props();

	const safeMax = $derived(Math.max(max, 1));
	const clamped = $derived(Math.min(Math.max(value, 0), safeMax));
	const pct = $derived((clamped / safeMax) * 100);
</script>

<div
	data-ui="progress"
	role="progressbar"
	aria-valuemin={0}
	aria-valuemax={safeMax}
	aria-valuenow={indeterminate ? undefined : clamped}
	class={cn(
		className,
		'relative h-[var(--progress-height)] w-full overflow-hidden rounded-full bg-secondary'
	)}
	{...rest}
>
	{#if indeterminate}
		<div
			class="absolute inset-y-0 left-0 w-1/3 animate-[sivir-progress-slide_1.4s_cubic-bezier(0.4,0,0.2,1)_infinite] rounded-full bg-primary motion-reduce:[animation-duration:0.01ms]"
		></div>
	{:else}
		<div
			class="h-full rounded-full bg-primary transition-[width] [transition-duration:var(--motion-duration-panel)] ease-out"
			style:width={`${pct}%`}
		></div>
	{/if}
</div>

<style>
	:global {
		@keyframes sivir-progress-slide {
			from {
				transform: translateX(-100%);
			}
			to {
				transform: translateX(400%);
			}
		}
	}
</style>
