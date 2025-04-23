import { UIState } from '$lib/ui/internals/state.svelte';
import { setContext, getContext } from 'svelte';

export const STATE_KEY = Symbol('MODAL');

interface ModalUIState {
	open: boolean;
	trigger: HTMLButtonElement | null;
	focusedElement: HTMLButtonElement | null;
}

const modalUIState = new UIState<ModalUIState>({
	open: false,
	trigger: null,
	focusedElement: null
});

function getModalUIState(): UIState<ModalUIState> {
	return getContext(STATE_KEY);
}

function setModalUIState(): UIState<ModalUIState> {
	return setContext(STATE_KEY, modalUIState);
}

export { type ModalUIState, modalUIState, getModalUIState, setModalUIState };
