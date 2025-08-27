<script lang="ts">
	import type { Snippet } from 'svelte';
	import { button } from './variants';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '$lib/ui/utils';
	import type { ButtonProps } from '.';

	let {
		href,
		variant = 'primary',
		children,
		class: classProp,
        size,
		element = $bindable(),
        onhover,
        onhoverend,
		...rest
	}: ButtonProps = $props();

    const buttonProps: HTMLButtonAttributes = rest as HTMLButtonAttributes;
	const anchorProps: HTMLAnchorAttributes = rest as HTMLAnchorAttributes;
</script>

{#if href}
	<a
		bind:this={element as HTMLAnchorElement}
		href={href}
		class={cn(classProp, button({ variant }))}
		onmouseenter={() => onhover?.()}
        onmouseleave={() => onhoverend?.()}
		{...anchorProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={element as HTMLButtonElement}
		class={cn(classProp, button({ variant }))}
		onmouseenter={() => onhover?.()}
		onmouseleave={() => onhoverend?.()}
		{...buttonProps}
	>
		{@render children?.()}
	</button>
{/if}