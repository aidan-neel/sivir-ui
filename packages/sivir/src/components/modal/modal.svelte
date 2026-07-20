<script lang="ts">
	import type { ModalProps, ModalState } from '.';
	import { setModalContext } from './context.svelte';

	let { open = $bindable(false), children }: ModalProps = $props();
	const id = $props.id();

	const modalState = $state<ModalState>({ open });
	const modalContext = $state({
		id,
		contentId: `modal-${id}`,
		returnFocusEl: undefined as HTMLElement | undefined,
		state: modalState
	});
	let syncedOpen = $state(open);
	let wasOpen = $state(false);
	setModalContext(modalContext);

	$effect.pre(() => {
		if (
			modalState.open &&
			!wasOpen &&
			typeof document !== 'undefined' &&
			document.activeElement instanceof HTMLElement &&
			document.activeElement !== document.body
		) {
			modalContext.returnFocusEl = document.activeElement;
		}
		wasOpen = modalState.open;
	});

	$effect(() => {
		if (open !== syncedOpen) {
			syncedOpen = open;
			modalState.open = open;
		}
	});

	$effect(() => {
		if (modalState.open !== syncedOpen) {
			syncedOpen = modalState.open;
			open = modalState.open;
		}
	});
</script>

{@render children?.()}
