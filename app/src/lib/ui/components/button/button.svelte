<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import { button } from './variants';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '$lib/ui/utils';
	import type { ButtonProps } from '.';
	import { getState } from '$lib/ui/internals/state.svelte';

	let {
		href,
		variant = 'primary',
		children,
		class: classProp,
        size,
		element = $bindable(),
        onhover,
        onhoverend,
        onclick,
		...rest
	}: ButtonProps = $props();

    const buttonProps: HTMLButtonAttributes = rest as HTMLButtonAttributes;
	const anchorProps: HTMLAnchorAttributes = rest as HTMLAnchorAttributes;

    const key = Math.random().toString(36).substring(2);
    setContext("key", key)

    const uiState = getState(key, {
        onclick: onclick
    })
</script>

{#if href}
	<a
		bind:this={element as HTMLAnchorElement}
		href={href}
		class={cn(classProp, button({ variant }))}
		onmouseenter={() => onhover?.()}
        onmouseleave={() => onhoverend?.()}
        onclick={() => onclick?.()}
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
        onclick={() => onclick?.()}
		{...buttonProps}
	>
		{@render children?.()}
	</button>
{/if}