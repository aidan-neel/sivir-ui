<script lang="ts">
	import { getContext, tick, type Snippet } from 'svelte';
	import { states } from '$lib/silk/internals/state.svelte.ts';
	import type { CommandState } from '.';
	import { flyAndScale, themedFade } from '$lib/silk/internals/transition';
	import { clickOutside, cn, trapFocus } from '$lib/silk/utils';

	const key = getContext('key') as string;
	const uiState = states[key].data as CommandState;

	type Props = {
		children?: Snippet;
		class?: string;
		allowClickOutside?: boolean;
	};

	let element = $state<HTMLDivElement | undefined>();
	let cleanup: (() => void) | undefined;
	let lastOpen = $state<boolean>(uiState.open);
	let scrollY = $state(0);
	const { children, class: className, allowClickOutside = true, ...rest }: Props = $props();

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

{#if uiState.open}
	<div
		transition:themedFade={{ durationVar: '--motion-duration-overlay', fallback: 150 }}
		class="fixed inset-0 z-40 bg-[var(--color-overlay)]"
	></div>
	<div
		bind:this={element}
		transition:flyAndScale={{ durationVar: '--motion-duration-panel' }}
		id={`${String(key)}-content`}
		data-ui="command-content"
		role="dialog"
		aria-modal="true"
		aria-labelledby={`${String(key)}-controls`}
		tabindex="-1"
		class={cn(
			className,
			'bg-[var(--color-overlay-bg)] text-[var(--color-panel-foreground)] border border-border rounded-[var(--radius-lg)] shadow-[inset_0_1px_0_var(--panel-highlight),var(--panel-shadow)] fixed top-[47%] left-1/2 z-50 m-auto flex max-h-[min(28rem,calc(100dvh-2rem))] min-h-[5rem] w-[calc(100%-1.5rem)] max-w-[35rem] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden duration-200 transition-all'
		)}
		use:clickOutside={() => {
			if (allowClickOutside) {
				uiState.open = false;
			}
		}}
		{...rest}
	>
		{@render children?.()}
	</div>
{/if}
