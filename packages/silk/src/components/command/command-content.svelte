<script lang="ts">
	import { getContext, tick, type Snippet } from 'svelte';
	import { states } from '@silk/ui/internals/state.svelte.ts';
	import type { CommandState } from '.';
	import { usePresence } from '@silk/ui/internals/presence.svelte.ts';
	import { clickOutside, cn, trapFocus } from '@silk/ui/utils';

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

	// Keep the palette mounted through its CSS exit animation.
	const presence = usePresence(
		() => uiState.open,
		() => element
	);

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

{#if presence.present}
	<div
		data-ui="overlay-backdrop"
		data-state={presence.status}
		class="fixed inset-0 z-40 bg-[var(--color-overlay)]"
	></div>
	<!-- Flex centering wrapper so the panel animates its own transform. -->
	<div class="pointer-events-none fixed inset-0 z-50 flex items-start justify-center p-3 pt-[12vh]">
		<div
			bind:this={element}
			data-ui="command-content"
			data-state={presence.status}
			id={`${String(key)}-content`}
			role="dialog"
			aria-modal="true"
			aria-labelledby={`${String(key)}-controls`}
			tabindex="-1"
			class={cn(
				className,
				'pointer-events-auto bg-[var(--color-overlay-bg)] text-[var(--color-panel-foreground)] border border-border rounded-[var(--radius-lg)] shadow-[inset_0_1px_0_var(--panel-highlight),var(--panel-shadow)] flex max-h-[min(28rem,calc(100dvh-2rem))] min-h-[5rem] w-full max-w-[35rem] flex-col overflow-hidden'
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
	</div>
{/if}
