<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import { button } from './variants';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '@silk/ui/utils';
	import type { ButtonProps } from '.';
	import { useState } from '@silk/ui/internals/state.svelte.ts';

	let {
		href,
		variant = 'primary',
		children,
		class: classProp,
		size = 'md',
		element = $bindable(),
		onclick,
		...rest
	}: ButtonProps = $props();

	const key = Math.random().toString(36).substring(2);
	const uiState = useState<{ onclick?: (() => void) | undefined }>(
		{
			onclick: undefined
		},
		key
	);

	setContext('key', key);

	$effect(() => {
		uiState.data.onclick = onclick;
	});
</script>

{#if href}
	<a
		bind:this={element as HTMLAnchorElement}
		{href}
		data-ui="button"
		data-variant={variant}
		data-size={size}
		class={cn(classProp, button({ variant, size }))}
		aria-disabled={(rest as HTMLAnchorAttributes)['aria-disabled']}
		onclick={() => onclick?.()}
		onkeydown={(e) => {
			if ((e.code === 'Space' || e.key === ' ') && e.currentTarget.matches(':focus-visible')) {
				e.preventDefault();
				onclick?.();
			}
		}}
		{...rest as HTMLAnchorAttributes}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={element as HTMLButtonElement}
		type={(rest as HTMLButtonAttributes).type ?? 'button'}
		data-ui="button"
		data-variant={variant}
		data-size={size}
		class={cn(classProp, button({ variant, size }))}
		onclick={() => onclick?.()}
		onkeydown={(e) => {
			if ((e.code === 'Space' || e.key === ' ') && e.currentTarget.matches(':focus-visible')) {
				e.preventDefault();
				onclick?.();
			}
		}}
		{...rest as HTMLButtonAttributes}
	>
		{@render children?.()}
	</button>
{/if}
