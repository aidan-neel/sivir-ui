<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import type { ProgressProps } from '.';

	let {
		class: className,
		value = 0,
		max = 100,
		indeterminate = false,
		...rest
	}: ProgressProps = $props();

	const clamped = $derived(Math.min(Math.max(value, 0), max));
	const pct = $derived((clamped / max) * 100);
</script>

<div
	data-ui="progress"
	role="progressbar"
	aria-valuemin={0}
	aria-valuemax={max}
	aria-valuenow={indeterminate ? undefined : clamped}
	class={cn(
		'relative h-[var(--progress-height)] w-full overflow-hidden rounded-full bg-secondary',
		className
	)}
	{...rest}
>
	{#if indeterminate}
		<div
			class="progress-indeterminate absolute inset-y-0 left-0 w-1/3 rounded-full bg-primary"
		></div>
	{:else}
		<div
			class="h-full rounded-full bg-primary transition-[width] [transition-duration:var(--motion-duration-panel)] ease-out"
			style:width={`${pct}%`}
		></div>
	{/if}
</div>

<style>
	@keyframes progress-slide {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(400%);
		}
	}
	.progress-indeterminate {
		animation: progress-slide 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
	}
	@media (prefers-reduced-motion: reduce) {
		.progress-indeterminate {
			animation-duration: 0.01ms;
		}
	}
</style>
