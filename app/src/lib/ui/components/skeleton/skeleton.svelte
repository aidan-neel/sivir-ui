<script lang="ts">
	import { cn } from '$lib/ui/utils';
	import { mode } from 'mode-watcher';
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
	class={cn(classProp, `${mode.current === 'light' ? 'skeleton' : 'skeleton-dark'} rounded-lg`)}
	style={`height: ${height}${unit}; width: ${width}${unit};`}
>
	{@render children?.()}
</div>

<style>
    .skeleton {
        background: linear-gradient(90deg, #E9E9E9 25%, rgb(241 241 241) 50%, #E9E9E9 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 2s infinite ease-in-out;
    }

    .skeleton-dark {
        background: linear-gradient(90deg, rgb(32 32 32) 25%, rgb(45 45 45) 50%, rgb(32 32 32) 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 2s infinite ease-in-out;
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
