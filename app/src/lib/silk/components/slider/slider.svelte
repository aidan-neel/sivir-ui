<script lang="ts">
	import { cn } from '$lib/silk/utils';
	import type { SliderProps } from '.';

	let {
		class: className,
		value = $bindable(0),
		min = 0,
		max = 100,
		step = 1,
		disabled = false,
		label,
		onValueChange,
		...rest
	}: SliderProps = $props();

	const pct = $derived(((value - min) / (max - min)) * 100);

	function handle(event: Event) {
		const next = Number((event.target as HTMLInputElement).value);
		value = next;
		onValueChange?.(next);
	}
</script>

<div
	data-ui="slider"
	class={cn('relative flex w-full select-none items-center', disabled && 'opacity-50', className)}
	{...rest}
>
	<div class="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
		<div
			class="absolute inset-y-0 left-0 rounded-full bg-primary"
			style:width={`${pct}%`}
		></div>
	</div>
	<input
		type="range"
		{min}
		{max}
		{step}
		{disabled}
		{value}
		aria-label={label}
		aria-valuemin={min}
		aria-valuemax={max}
		aria-valuenow={value}
		oninput={handle}
		class="silk-slider-input absolute inset-0 m-0 w-full cursor-pointer appearance-none bg-transparent focus-visible:outline-none disabled:cursor-not-allowed"
	/>
</div>

<style>
	/* Thumb — webkit */
	:global(.silk-slider-input::-webkit-slider-thumb) {
		appearance: none;
		width: 16px;
		height: 16px;
		border-radius: 9999px;
		background: var(--color-background);
		border: 2px solid var(--color-primary);
		box-shadow: 0 1px 2px rgb(0 0 0 / 0.15);
		cursor: pointer;
		transition: transform 120ms ease-out, box-shadow 120ms ease-out;
	}
	:global(.silk-slider-input:focus-visible::-webkit-slider-thumb) {
		box-shadow: 0 0 0 3px var(--color-ring);
	}
	:global(.silk-slider-input::-webkit-slider-thumb:active) {
		transform: scale(1.1);
	}
	/* Thumb — moz */
	:global(.silk-slider-input::-moz-range-thumb) {
		width: 16px;
		height: 16px;
		border-radius: 9999px;
		background: var(--color-background);
		border: 2px solid var(--color-primary);
		box-shadow: 0 1px 2px rgb(0 0 0 / 0.15);
		cursor: pointer;
	}
	:global(.silk-slider-input::-moz-range-track) {
		background: transparent;
	}
</style>
