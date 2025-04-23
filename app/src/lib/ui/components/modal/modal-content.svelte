<script lang="ts">
	import BackgroundBlur from '../internals/background-blur.svelte';
	import { onDestroy, onMount, type Snippet } from 'svelte';
	import { modalUIState, getModalUIState, type ModalUIState, STATE_KEY } from './lib.svelte';
	import type { UIState } from '$lib/ui/internals/state.svelte';
	import { clickOutside, cn } from '$lib/ui/utils';
	import { flyAndScale } from '$lib/ui/internals/transition';
	import X from '@lucide/svelte/icons/x';

	const {
		children,
		class: classProp,
		allowClickOutside = true,
		...rest
	}: {
		children: Snippet;
		class?: string;
		allowClickOutside?: boolean;
	} = $props();

	const state: UIState<ModalUIState> = getModalUIState();

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			state.data.open = false;
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);

		onDestroy(() => {
			document.removeEventListener('keydown', handleKeydown);
		});
	});
</script>

<BackgroundBlur open={state.data?.open}>
	<dialog
		transition:flyAndScale
		class={cn(
			classProp,
			`rounded-lg border m-auto shadow-sm bg-background min-w-[20rem] max-w-[35rem] min-h-[5rem] max-h-[30rem]`
		)}
		use:clickOutside={() => {
			if (allowClickOutside) {
				state.data.open = false;
			}
		}}
		open={state.data?.open}
		role="Modal"
		aria-labelledby={`${String(STATE_KEY)}-title`}
		aria-describedby={`${String(STATE_KEY)}-desc`}
		aria-controls={`${String(STATE_KEY)}-controls`}
		aria-modal="true"
	>
		<button
			onclick={() => {
				if (state.data) {
					state.data.open = false;
				}
			}}
			class="text-foreground/50 duration-150 absolute top-3 right-3 hover:text-foreground"
		>
			<X size="20" />
		</button>
		{@render children?.()}
	</dialog>
</BackgroundBlur>
