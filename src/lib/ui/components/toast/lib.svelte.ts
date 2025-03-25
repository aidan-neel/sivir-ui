import { UIState } from '$lib/ui/internals/state.svelte';
import { setContext, getContext } from 'svelte';

export const STATE_KEY = Symbol('TOAST');

interface ToastUIState {
	open: boolean;
	trigger: HTMLButtonElement | null;
	toasts: Toast[];
}

interface ToastAction {
	label: string;
	callback: () => any;
}

interface Toast {
	title: string;
	duration: number;
	description?: string;
	horizontal?: 'left' | 'right';
	vertical?: 'top' | 'bottom';
	type?: 'success' | 'error' | 'warning' | 'info';
	actions?: ToastAction[];
	id?: number;
	persistent?: boolean;
	exitable?: boolean;
	exit?: () => any;
}

const toastUIState = new UIState<ToastUIState>({
	open: false,
	trigger: null,
	toasts: []
});

function toast(toastData: Toast) {
	if (toastUIState.data) {
		const toastId = Math.floor(Math.random() * 10623962836);
		toastData.id = toastId;
		toastUIState.data.toasts = [...toastUIState.data.toasts, toastData];

		toastData.exit = () => {
			if (toastUIState.data) {
				toastUIState.data.toasts = toastUIState.data.toasts.filter((toast) => toast.id !== toastId);
			}
		};

		if (toastData.type === undefined) {
			toastData.type = 'info';
		}

		if (toastData.horizontal === undefined) {
			toastData.horizontal = 'right';
		}

		if (toastData.vertical === undefined) {
			toastData.vertical = 'top';
		}

		setTimeout(() => {
			if (toastUIState.data) {
				toastUIState.data.toasts = toastUIState.data.toasts.filter((toast) => toast.id !== toastId);
			}
		}, toastData.duration);
	}
}

function getToastUIState(): UIState<ToastUIState> {
	return getContext(STATE_KEY);
}

function setToastUIState(): UIState<ToastUIState> {
	return setContext(STATE_KEY, toastUIState);
}

export {
	type Toast,
	type ToastAction,
	type ToastUIState,
	toast,
	toastUIState,
	getToastUIState,
	setToastUIState
};
