<script lang="ts">
	import { flyAndScale } from '$lib/silk/internals/transition';
	import {
		clickOutside,
		type DefaultProps,
		cn,
		getFocusableElements,
		trapFocus
	} from '$lib/silk/utils';
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import type { AlertDialogState } from '.';
	import { getContext } from 'svelte';
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
			cleanup = trapFocus(element as HTMLElement, {
				initialFocus: getFocusableElements(element as HTMLElement)[0] ?? null
			});
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
			cleanup?.();
			cleanup = undefined;
		}
	});
</script>

{#if uiState.data.open}
	<div class="fixed inset-0 z-40">
		<div
			transition:fade={{ duration: 150, easing: cubicOut }}
			class="absolute inset-0 bg-[var(--color-overlay)] [backface-visibility:hidden] [transform:translateZ(0)]"
			style="backdrop-filter: blur(var(--motion-overlay-blur));"
		></div>
		<div
			bind:this={element}
			transition:flyAndScale={{ durationVar: '--motion-duration-panel' }}
			data-ui="alert-dialog-content"
			class={cn(
				className,
				`bg-[var(--color-panel)] text-[var(--color-panel-foreground)] border border-border rounded-[var(--panel-radius)] shadow-[inset_0_1px_0_var(--panel-highlight),var(--panel-shadow)] p-[var(--panel-padding-lg)] duration-200 transition-all flex flex-col fixed top-1/2 left-1/2 z-50 overflow-y-auto overscroll-contain -translate-x-1/2 -translate-y-1/2 m-auto md:w-full w-[calc(100%-1.5rem)] max-w-[35rem] min-h-[5rem] max-h-[min(30rem,calc(100dvh-1.5rem))]`
			)}
			use:clickOutside={() => {
				if (allowClickOutside) {
					uiState.data.open = false;
				}
			}}
			onkeydown={(event) => {
				if (event.key === 'Escape') {
					event.preventDefault();
					uiState.data.open = false;
				}
			}}
			role="alertdialog"
			aria-modal="true"
			id={'alert-dialog-' + uiState.key}
			aria-labelledby={uiState.key + '-title'}
			aria-describedby={uiState.key + '-desc'}
			tabindex="-1"
			{...rest}
		>
			{@render children?.()}
		</div>
	</div>
{/if}
