import { UIState } from '$lib/ui/internals/state.svelte';
import { setContext, getContext } from 'svelte';

export const STATE_KEY = Symbol('POPOVER');

interface PopoverUIState {
	open: boolean;
	trigger: HTMLButtonElement | null;
	focusedElement: HTMLButtonElement | null;
	buttonRef: HTMLButtonElement;
	popoverRef: HTMLDivElement;
	placement: 'top' | 'left' | 'right' | 'bottom';
	onclick?: () => any;
}

const popoverUIState = new UIState<PopoverUIState>({
	open: false,
	trigger: null,
	focusedElement: null,
	buttonRef: null,
	popoverRef: null,
	placement: 'bottom',
	onclick: undefined
});

function getPopoverUIState(): UIState<PopoverUIState> {
	return getContext(STATE_KEY);
}

function setPopoverUIState(): UIState<PopoverUIState> {
	return setContext(STATE_KEY, popoverUIState);
}

export { type PopoverUIState, popoverUIState, getPopoverUIState, setPopoverUIState };
