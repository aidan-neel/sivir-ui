<script lang="ts">
	import { Button, type ButtonProps } from '@silk/ui/components/button';
	import { states, type UIState } from '@silk/ui/internals/state.svelte.ts';
	import { cn } from '@silk/ui/utils';
	import { getContext, onDestroy, tick, type Snippet } from 'svelte';
	import Check from '@lucide/svelte/icons/check';
	import type { SelectState } from '.';

	const key = getContext('key') as string;
	const uiState = states[key] as UIState<SelectState>;

	type Props = {
		value: string;
		label?: string;
	} & ButtonProps;

	let { children, class: className, value, label, onclick: userOnclick, ...rest }: Props = $props();
	let element = $state<HTMLButtonElement | HTMLAnchorElement | undefined>();

	function resolveLabel() {
		if (label) return label;
		const fromAttr = element
			?.querySelector<HTMLElement>('[data-select-label]')
			?.textContent?.trim();
		if (fromAttr) return fromAttr;
		return element?.textContent?.trim() ?? '';
	}

	$effect(() => {
		uiState.data.values.add(value);
		void tick().then(() => {
			const resolved = resolveLabel();
			if (!resolved) return;
			uiState.data.labels.set(value, resolved);
			if (uiState.data.value === value) {
				uiState.data.selectedLabel = resolved;
			}
		});
	});

	onDestroy(() => {
		uiState.data.values.delete(value);
		uiState.data.labels.delete(value);
	});
</script>

<Button
	bind:element
	id={`select-${key}-option-${value}`}
	role="option"
	aria-selected={uiState.data.value === value}
	{...rest}
	onclick={() => {
		uiState.data.value = value;
		uiState.data.selectedLabel = resolveLabel() || uiState.data.labels.get(value) || value;
		uiState.data.open = false;
		uiState.data.buttonRef?.focus();
		userOnclick?.();
	}}
	class={cn(
		className,
		'[--button-height:var(--menu-item-height)] h-[var(--menu-item-height)] px-[var(--menu-item-padding-x)] py-0 rounded-[var(--radius-md)] text-[var(--menu-item-foreground)] border border-transparent transition-[background-color,border-color,color,box-shadow] [transition-duration:var(--motion-duration-menu)] hover:bg-[var(--menu-item-hover-bg)] data-[active=true]:bg-[var(--menu-item-hover-bg)] data-[selected=true]:bg-[var(--menu-item-active-bg)] w-full [font-size:var(--font-size-button,14px)] [font-weight:var(--font-weight-button,500)] [letter-spacing:var(--tracking-button,0em)] hover:cursor-default items-center justify-between text-left'
	)}
	variant={'ghost'}
>
	{@render children?.()}

	{#if uiState.data.value === value}
		<div aria-hidden="true">
			<Check />
		</div>
	{/if}
</Button>
