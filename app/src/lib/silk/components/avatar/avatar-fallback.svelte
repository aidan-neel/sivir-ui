<script lang="ts">
	import { getContext } from 'svelte';
	import { cn } from '$lib/silk/utils';
	import type { AvatarFallbackProps } from '.';

	let { class: className, children, ...rest }: AvatarFallbackProps = $props();
	const ctx = getContext<{ imageLoaded: boolean }>('avatar-state');
</script>

{#if !ctx.imageLoaded}
	<span
		class={cn('flex h-full w-full items-center justify-center', className)}
		{...rest}
	>
		{@render children?.()}
	</span>
{/if}
