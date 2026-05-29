<script lang="ts">
	import { getContext } from 'svelte';
	import { cn } from '@silk/ui/utils';
	import type { AvatarImageProps } from '.';

	let { class: className, src, alt = '', ...rest }: AvatarImageProps = $props();

	const ctx = getContext<{ imageLoaded: boolean }>('avatar-state');
	let errored = $state(false);
</script>

{#if src && !errored}
	<img
		{src}
		{alt}
		onload={() => (ctx.imageLoaded = true)}
		onerror={() => {
			errored = true;
			ctx.imageLoaded = false;
		}}
		class={cn('absolute inset-0 h-full w-full object-cover', className)}
		{...rest}
	/>
{/if}
