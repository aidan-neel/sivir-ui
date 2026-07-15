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
	<div class="relative h-1 w-full overflow-hidden rounded-full bg-secondary">
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
		class="absolute inset-0 m-0 w-full cursor-pointer appearance-none bg-transparent focus-visible:outline-none disabled:cursor-not-allowed [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-[transform,box-shadow] [&::-webkit-slider-thumb]:[transition-duration:var(--motion-duration-hover)] [&::-webkit-slider-thumb]:ease-out motion-reduce:[&::-webkit-slider-thumb]:transition-none [&::-webkit-slider-thumb:active]:scale-110 motion-reduce:[&::-webkit-slider-thumb:active]:scale-100 [&:focus-visible::-webkit-slider-thumb]:shadow-[var(--focus-ring)] [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:shadow-sm [&::-moz-range-track]:bg-transparent"
	/>
</div>
