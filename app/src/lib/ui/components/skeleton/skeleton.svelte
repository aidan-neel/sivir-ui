<script lang="ts">
	import { cn } from '$lib/ui/utils';
	import { type Snippet } from 'svelte';

	let {
		children,
		class: classProp,
		w: width,
		h: height,
		unit = 'px',
		...rest
	}: {
		children: Snippet;
		class?: string;
		w: number;
		h: number;
		unit:
			| 'px'
			| 'rem'
			| 'em'
			| '%'
			| 'vh'
			| 'vw'
			| 'vmin'
			| 'vmax'
			| 'ch'
			| 'ex'
			| 'cm'
			| 'mm'
			| 'in'
			| 'pt'
			| 'pc';
	} = $props();
</script>

<div
	{...rest}
	class={cn(classProp, `skeleton rounded-lg`)}
	style={`height: ${height}${unit}; width: ${width}${unit};`}
>
	{@render children?.()}
</div>

<style>
	.skeleton {
		background: linear-gradient(90deg, var(--color-secondary) 25%, var(--color-secondary) 100%, var(--color-secondary) 75%);
		background-size: 200% 100%;
		animation: skeleton-loading 2.5s infinite linear;
	}

	@keyframes skeleton-loading {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}
</style>
