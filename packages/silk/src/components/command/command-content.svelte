<!-- token-lint-disable-file -->
<script lang="ts">
	import { getContext, tick, type Snippet } from 'svelte';
	import { states } from '@silk/ui/internals/state.svelte.ts';
	import type { CommandState } from '.';
	import { createPresence } from '@silk/ui/internals/presence.svelte.ts';
	import { clickOutside, cn, trapFocus } from '@silk/ui/utils';
	import { PANEL_FRAME, PANEL_SURFACE } from '../panel';
	import '../panel/panel.css';

	const key = getContext('key') as string;
	const uiState = states[key].data as CommandState;

	type Props = {
		children?: Snippet;
		class?: string;
		allowClickOutside?: boolean;
	};

	let element = $state<HTMLDivElement | undefined>();
	let portalEl = $state<HTMLDivElement>();
	let cleanup: (() => void) | undefined;
	let lastOpen = $state<boolean>(uiState.open);
	let scrollY = $state(0);
	const { children, class: className, allowClickOutside = true, ...rest }: Props = $props();

	// Keep the dialog mounted through its CSS exit animation.
	const presence = createPresence(() => uiState.open);

	// Portal the dialog to <body> so its fixed positioning and z-index escape
	// ancestor stacking/containing contexts -- e.g. a navbar with a
	// backdrop-filter, which would otherwise trap this position:fixed child
	// inside the bar instead of letting it cover the viewport.
	$effect(() => {
		if (!portalEl || typeof document === 'undefined') return;
		document.body.appendChild(portalEl);
		return () => {
			portalEl?.remove();
		};
	});

	$effect(() => {
		if (uiState.open !== lastOpen) {
			lastOpen = uiState.open;

			if (uiState.open) {
				scrollY = window.scrollY;
				document.body.style.overflow = 'hidden';
				void tick().then(() => {
					if (!element) return;
					cleanup?.();
					cleanup = trapFocus(element);
					const focusTarget =
						element.querySelector<HTMLInputElement>('input, textarea') ??
						element.querySelector<HTMLElement>('button, [tabindex]:not([tabindex="-1"])');
					focusTarget?.focus();
				});
			} else {
				document.body.style.overflow = '';
				window.scrollTo(0, scrollY);
				cleanup?.();
				cleanup = undefined;
			}
		}
	});
</script>

{#if presence.mounted}
	<div bind:this={portalEl} class="contents">
		<div
			data-silk-anim="overlay"
			data-state={presence.state}
			class="fixed inset-0 z-40 bg-[var(--silk-neutral-50)]/40 backdrop-blur-[2px] [backface-visibility:hidden] [transform:translateZ(0)]"
		></div>
		<div
			bind:this={element}
			data-silk-anim="panel"
			data-state={presence.state}
			onanimationend={presence.end}
			id={`${String(key)}-content`}
			data-ui="command-content"
			role="dialog"
			aria-modal="true"
			aria-labelledby={`${String(key)}-controls`}
			tabindex="-1"
			class={cn(
				className,
				'text-[var(--color-foreground)] shadow-[var(--panel-shadow)] fixed top-[47%] left-1/2 z-50 m-auto flex max-h-[min(var(--command-dialog-max-height),calc(100dvh-2rem))] min-h-[5rem] w-[calc(100%-2*var(--command-dialog-width-margin))] max-w-[var(--command-dialog-max-width)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden duration-200 transition-[opacity,transform]', // token-lint-disable-line no-literal-length
				PANEL_FRAME,
				'panel-root'
			)}
			use:clickOutside={() => {
				if (allowClickOutside) {
					uiState.open = false;
				}
			}}
			{...rest}
		>
			<!-- Inset surface: the command input + list live here, on the panel fill. -->
			<div
				class={cn(
					'flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--color-panel)]',
					PANEL_SURFACE
				)}
			>
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}
