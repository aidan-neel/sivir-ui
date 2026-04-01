<script lang="ts">
	import { flyAndScale } from '$lib/silk/internals/transition';
	import { clickOutside, type DefaultProps, cn, trapFocus } from '$lib/silk/utils';
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import type { DialogContentProps, DialogState } from '.';
	import { getContext, onDestroy, onMount } from 'svelte';
	import { states, UIState } from '$lib/silk/internals/state.svelte.ts';

	let {
		class: className,
		allowClickOutside = true,
		children,
		...rest
	}: DialogContentProps = $props();

	const key = getContext<string>('key');
	const uiState = states[key] as UIState<DialogState>;
	let element = $state<HTMLElement>();

	let cleanup: (() => void) | undefined;

	$effect(() => {
		if (!document) return;

		if (uiState.data.open) {
			cleanup = trapFocus(element as HTMLElement);
			document.body.style.overflow = 'hidden';
			const focusable = element!.querySelector<HTMLElement>(
				'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
			);
			focusable?.focus();
		} else {
			document.body.style.overflow = '';
			cleanup?.();
			cleanup = undefined;
		}
	});
</script>

{#if uiState.data.open}
	<div
		transition:fade={{ duration: 150, easing: cubicOut }}
		class="fixed inset-0 z-40 bg-[var(--color-overlay)] backdrop-blur-[2px]"
	></div>
	<div
		transition:flyAndScale={{ durationVar: '--motion-duration-panel' }}
		data-ui="dialog-content"
		bind:this={element}
		class={cn(
			className,
			`bg-[var(--color-panel)] text-[var(--color-panel-foreground)] border border-[var(--panel-border)] rounded-[var(--panel-radius)] shadow-[inset_0_1px_0_var(--panel-highlight),var(--panel-shadow)] p-[var(--panel-padding-lg)] duration-200 transition-all flex flex-col gap-4 fixed top-1/2 left-1/2 z-50 overflow-y-auto -translate-x-1/2 -translate-y-1/2 m-auto md:w-full w-[calc(100%-1.5rem)] max-w-[35rem] min-h-[5rem] max-h-[30rem]`
		)}
		use:clickOutside={() => {
			if (allowClickOutside) {
				uiState.data.open = false;
			}
		}}
		role="dialog"
		aria-modal="true"
		id={'dialog-' + uiState.key}
		aria-labelledby={'dialog-' + uiState.key + '-title'}
		aria-describedby={'dialog-' + uiState.key + '-desc'}
		tabindex="-1"
		{...rest}
	>
		{@render children?.()}
	</div>
{/if}
