<script lang="ts">
	import { flyAndScale, themedFade } from '$lib/silk/internals/transition';
	import { clickOutside, cn, getFocusableElements, trapFocus } from '$lib/silk/utils';
	import type { ModalContentProps, ModalState } from '.';
	import { getContext } from 'svelte';
	import { states, UIState } from '$lib/silk/internals/state.svelte.ts';

	let {
		class: className,
		allowClickOutside = true,
		role = 'dialog',
		contentClass = '',
		overlayClass = '',
		panelIdPrefix = 'modal',
		children,
		...rest
	}: ModalContentProps = $props();

	const key = getContext<string>('key');
	const uiState = states[key] as UIState<ModalState>;
	let element = $state<HTMLElement>();
	let portalEl = $state<HTMLDivElement>();

	let cleanup: (() => void) | undefined;

	// Portal the modal to <body> so its z-index escapes ancestor stacking
	// contexts (e.g. flex items with z-index, transformed parents, etc.).
	$effect(() => {
		if (!portalEl || typeof document === 'undefined') return;
		document.body.appendChild(portalEl);
		return () => {
			portalEl?.remove();
		};
	});

	$effect(() => {
		if (typeof document === 'undefined') return;

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
	<div bind:this={portalEl} class="fixed inset-0 z-[115]">
		<div
			transition:themedFade={{ durationVar: '--motion-duration-overlay', fallback: 150 }}
			class={cn(
				overlayClass,
				'absolute inset-0 bg-[var(--color-overlay)] [backface-visibility:hidden] [transform:translateZ(0)]'
			)}
		></div>
		<div
			transition:flyAndScale={{ durationVar: '--motion-duration-panel' }}
			bind:this={element}
			class={cn(
				contentClass,
				className,
				'bg-[var(--color-overlay-bg)] text-[var(--color-panel-foreground)] border border-border rounded-[var(--radius-lg)] shadow-outlined duration-200 transition-all flex flex-col fixed top-[47%] left-1/2 z-[120] overflow-y-auto overscroll-contain -translate-x-1/2 -translate-y-1/2 m-auto md:w-full w-[calc(100%-1.5rem)] max-w-[35rem] min-h-[5rem] max-h-[calc(100dvh-2rem)]'
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
			{role}
			aria-modal="true"
			id={`${panelIdPrefix}-${uiState.key}`}
			aria-labelledby={uiState.key + '-title'}
			aria-describedby={uiState.key + '-desc'}
			tabindex="-1"
			{...rest}
		>
			{@render children?.()}
		</div>
	</div>
{/if}
