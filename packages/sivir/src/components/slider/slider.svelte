<script lang="ts">
	import { cn } from '@sivir/ui/utils';
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

	const pct = $derived(
		max > min ? Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100) : 0
	);

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
	<div
		class="relative h-[var(--slider-track-height)] w-full overflow-hidden rounded-full bg-secondary"
	>
		<div class="absolute inset-y-0 left-0 rounded-full bg-primary" style:width={`${pct}%`}></div>
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
		class="absolute inset-0 m-0 w-full cursor-pointer appearance-none bg-transparent focus-visible:outline-none disabled:cursor-not-allowed [&::-webkit-slider-thumb]:size-[var(--slider-thumb-size)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-background)] [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-[transform,box-shadow] [&::-webkit-slider-thumb]:[border:var(--slider-thumb-border)_solid_var(--color-primary)] [&::-webkit-slider-thumb]:[transition-duration:var(--slider-transition-duration)] [&::-webkit-slider-thumb]:ease-out [&::-webkit-slider-thumb:active]:scale-110 [&:focus-visible::-webkit-slider-thumb]:shadow-[var(--focus-ring)] [&::-moz-range-thumb]:size-[var(--slider-thumb-size)] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--color-background)] [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:[border:var(--slider-thumb-border)_solid_var(--color-primary)] [&::-moz-range-track]:bg-transparent"
	/>
</div>
