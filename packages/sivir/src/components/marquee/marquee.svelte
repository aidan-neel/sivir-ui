<script lang="ts">
	import { cn } from '@sivir/ui/utils';
	import type { MarqueeProps } from '.';

	let {
		class: className,
		children,
		direction = 'left',
		duration = '40s',
		gap = '2rem',
		pauseOnHover = false,
		reverse = false,
		repeat = 2,
		vertical = false,
		...rest
	}: MarqueeProps = $props();

	const axis = $derived(vertical ? 'vertical' : 'horizontal');
	const directionFinal = $derived(reverse ? (direction === 'left' ? 'right' : 'left') : direction);
	const copies = $derived(Math.max(1, Math.floor(repeat)));
</script>

<div
	data-ui="marquee"
	data-axis={axis}
	data-direction={directionFinal}
	class={cn(
		className,
		'group/marquee relative flex gap-[var(--sivir-marquee-gap)] overflow-hidden',
		vertical ? 'flex-col' : 'flex-row'
	)}
	style:--sivir-marquee-duration={duration}
	style:--sivir-marquee-gap={gap}
	{...rest}
>
	{#each Array.from({ length: copies }) as _, i (i)}
		<div
			aria-hidden={i > 0 ? 'true' : undefined}
			class={cn(
				'flex shrink-0 items-center gap-[var(--sivir-marquee-gap)] motion-reduce:animate-none',
				vertical
					? '[animation:sivir-marquee-y_var(--sivir-marquee-duration)_linear_infinite] flex-col'
					: '[animation:sivir-marquee-x_var(--sivir-marquee-duration)_linear_infinite] flex-row',
				directionFinal === 'right' && '[animation-direction:reverse]',
				pauseOnHover && 'group-hover/marquee:[animation-play-state:paused]'
			)}
		>
			{@render children?.()}
		</div>
	{/each}
</div>

<style>
	:global {
		@keyframes sivir-marquee-x {
			from {
				transform: translateX(0);
			}
			to {
				transform: translateX(calc(-100% - var(--sivir-marquee-gap)));
			}
		}

		@keyframes sivir-marquee-y {
			from {
				transform: translateY(0);
			}
			to {
				transform: translateY(calc(-100% - var(--sivir-marquee-gap)));
			}
		}
	}
</style>
