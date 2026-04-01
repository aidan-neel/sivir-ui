<script lang="ts">
	import { cn } from '$lib/silk/utils';
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
	class={cn(classProp, 'animate-[skeleton-loading_2s_infinite_ease-in-out] rounded-lg')}
	style={`height: ${height}${unit}; width: ${width}${unit}; background: ${
		mode.current === 'light'
			? 'linear-gradient(90deg, #E9E9E9 25%, rgb(241 241 241) 50%, #E9E9E9 75%)'
			: 'linear-gradient(90deg, rgb(32 32 32) 25%, rgb(45 45 45) 50%, rgb(32 32 32) 75%)'
	}; background-size: 200% 100%;`}
>
	{@render children?.()}
</div>
