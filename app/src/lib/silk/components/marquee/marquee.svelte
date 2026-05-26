<script lang="ts">
	import { cn } from '$lib/silk/utils';
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
</script>

<div
	data-ui="marquee"
	data-axis={axis}
	data-direction={directionFinal}
	class={cn(
		'silk-marquee group/marquee relative flex overflow-hidden',
		vertical ? 'flex-col' : 'flex-row',
		pauseOnHover && 'silk-marquee-hover',
		className
	)}
	style:--silk-marquee-duration={duration}
	style:--silk-marquee-gap={gap}
	{...rest}
>
	{#each Array.from({ length: repeat }) as _, i (i)}
		<div
			aria-hidden={i > 0 ? 'true' : undefined}
			class={cn(
				'silk-marquee-track flex shrink-0 items-center',
				vertical ? 'flex-col' : 'flex-row'
			)}
		>
			{@render children?.()}
		</div>
	{/each}
</div>

<style>
	.silk-marquee {
		gap: var(--silk-marquee-gap);
	}
	.silk-marquee-track {
		gap: var(--silk-marquee-gap);
	}
	[data-axis='horizontal'] .silk-marquee-track {
		animation: silk-marquee-x var(--silk-marquee-duration) linear infinite;
	}
	[data-axis='vertical'] .silk-marquee-track {
		animation: silk-marquee-y var(--silk-marquee-duration) linear infinite;
	}
	[data-axis='horizontal'][data-direction='right'] .silk-marquee-track {
		animation-direction: reverse;
	}
	[data-axis='vertical'][data-direction='right'] .silk-marquee-track {
		animation-direction: reverse;
	}
	.silk-marquee-hover:hover .silk-marquee-track {
		animation-play-state: paused;
	}

	@keyframes silk-marquee-x {
		from { transform: translateX(0); }
		to { transform: translateX(calc(-100% - var(--silk-marquee-gap))); }
	}
	@keyframes silk-marquee-y {
		from { transform: translateY(0); }
		to { transform: translateY(calc(-100% - var(--silk-marquee-gap))); }
	}

	@media (prefers-reduced-motion: reduce) {
		.silk-marquee-track {
			animation: none;
		}
	}
</style>
