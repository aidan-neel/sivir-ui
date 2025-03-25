import { UIState } from '$lib/ui/internals/state.svelte';
import { setContext, getContext } from 'svelte';

export const STATE_KEY = Symbol('ALERT-DIALOG');

interface AlertDialogUIState {
	open: boolean;
	trigger: HTMLButtonElement | null;
	focusedElement: HTMLButtonElement | null;
}

const alertDialogUIState = new UIState<AlertDialogUIState>({
	open: false,
	trigger: null,
	focusedElement: null
});

function getAlertDialogUIState(): UIState<AlertDialogUIState> {
	return getContext(STATE_KEY);
}

function setAlertDialogUIState(): UIState<AlertDialogUIState> {
	return setContext(STATE_KEY, alertDialogUIState);
}

export {
	type AlertDialogUIState,
	alertDialogUIState,
	getAlertDialogUIState,
	setAlertDialogUIState
};
