<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import { type Snippet } from 'svelte';

	let {
		children,
		class: classProp,
		w: width,
		h: height,
		unit = 'px',
		...rest
	}: {
		children?: Snippet;
		class?: string;
		w?: number;
		h?: number;
		unit?:
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
	aria-hidden="true"
	{...rest}
	class={cn(classProp, 'animate-[skeleton-loading_2s_infinite_ease-in-out] rounded-lg')}
	style={`height: ${height}${unit}; width: ${width}${unit}; background: linear-gradient(90deg, var(--skeleton-base) 0%, var(--skeleton-highlight) 50%, var(--skeleton-base) 100%); background-size: 200% 100%;`}
>
	{@render children?.()}
</div>
