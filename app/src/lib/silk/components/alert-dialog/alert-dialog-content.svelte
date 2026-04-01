<script lang="ts">
	import { flyAndScale } from '$lib/silk/internals/transition';
	import { clickOutside, type DefaultProps, cn, trapFocus } from '$lib/silk/utils';
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import type { AlertDialogState } from '.';
	import { getContext, onMount } from 'svelte';
	import { states, UIState } from '$lib/silk/internals/state.svelte.ts';

	type Props = {
		allowClickOutside?: boolean;
	} & DefaultProps;

	let { class: className, allowClickOutside = false, children, ...rest }: Props = $props();

	const key = getContext<string>('key');
	const uiState = states[key] as UIState<AlertDialogState>;
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
		bind:this={element}
		transition:flyAndScale={{ durationVar: '--motion-duration-panel' }}
		data-ui="alert-dialog-content"
		class={cn(
			className,
			`bg-[var(--color-panel)] text-[var(--color-panel-foreground)] border border-[var(--panel-border)] rounded-[var(--panel-radius)] shadow-[inset_0_1px_0_var(--panel-highlight),var(--panel-shadow)] p-[var(--panel-padding-lg)] duration-200 transition-all flex flex-col fixed top-1/2 left-1/2 z-50 overflow-y-auto -translate-x-1/2 -translate-y-1/2 m-auto md:w-full w-[calc(100%-1.5rem)] max-w-[35rem] min-h-[5rem] max-h-[30rem]`
		)}
		use:clickOutside={() => {
			if (allowClickOutside) {
				uiState.data.open = false;
			}
		}}
		role="alertdialog"
		aria-modal="true"
		id={'alert-dialog-' + uiState.key}
		aria-labelledby={'alert-dialog-' + uiState.key + '-title'}
		aria-describedby={'alert-dialog-' + uiState.key + '-desc'}
		tabindex="-1"
		{...rest}
	>
		{@render children?.()}
	</div>
{/if}
