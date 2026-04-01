import { UIState } from '$lib/silk/internals/state.svelte.ts';
import { setContext, getContext } from 'svelte';

export const STATE_KEY = Symbol('TOAST');

const toastTimeouts = new Map<number, ReturnType<typeof setTimeout>>();
const TOAST_EXIT_DURATION = 340;

export interface ToastUIState {
	toasts: Toast[];
}

export interface ToastAction {
	label: string;
	variant?: 'primary' | 'secondary' | 'ghost' | 'outlined';
	callback: () => any;
}

export interface Toast {
	title: string;
	duration?: number;
	description?: string;
	type?: 'success' | 'error' | 'warning' | 'info' | 'loading' | 'default';
	actions?: ToastAction[];
	id?: number;
	persistent?: boolean;
	exitable?: boolean;
	exit?: () => void;
	update?: (updates: Partial<Toast>) => void;
	createdAt?: number;
	remaining?: number;
	paused?: boolean;
	leaving?: boolean;
}

type ToastInput = Omit<
	Toast,
	'id' | 'exit' | 'update' | 'createdAt' | 'remaining' | 'paused' | 'leaving'
>;

interface PromiseMessages<T> {
	loading: string;
	success: string | ((data: T) => string);
	error: string | ((err: any) => string);
	loadingDescription?: string;
	successDescription?: string | ((data: T) => string);
	errorDescription?: string | ((err: any) => string);
}

export interface ToastFn {
	(data: ToastInput): Toast;
	promise<T>(promise: Promise<T>, messages: PromiseMessages<T>): Toast;
	success(title: string, opts?: Partial<ToastInput>): Toast;
	error(title: string, opts?: Partial<ToastInput>): Toast;
	warning(title: string, opts?: Partial<ToastInput>): Toast;
	info(title: string, opts?: Partial<ToastInput>): Toast;
	loading(title: string, opts?: Partial<ToastInput>): Toast;
	dismiss(id?: number): void;
}

const toastUIState = new UIState<ToastUIState>({ toasts: [] }, 'toast');

function clearToastTimeout(id: number) {
	const timeout = toastTimeouts.get(id);
	if (!timeout) return;
	clearTimeout(timeout);
	toastTimeouts.delete(id);
}

function dismissToast(id: number) {
	if (!toastUIState.data) return;
	const current = toastUIState.data.toasts.find((t) => t.id === id);
	if (!current) return;
	if (current.leaving) return;
	current.leaving = true;
	clearToastTimeout(id);
	toastTimeouts.set(
		id,
		setTimeout(() => {
			if (!toastUIState.data) return;
			toastUIState.data.toasts = toastUIState.data.toasts.filter((t) => t.id !== id);
			toastTimeouts.delete(id);
		}, TOAST_EXIT_DURATION)
	);
}

function scheduleToastRemoval(id: number, duration: number) {
	clearToastTimeout(id);
	toastTimeouts.set(
		id,
		setTimeout(() => dismissToast(id), duration)
	);
}

function pauseToast(id: number) {
	if (!toastUIState.data) return;
	const current = toastUIState.data.toasts.find((t) => t.id === id);
	if (!current || current.persistent || current.paused || current.leaving) return;
	current.paused = true;
	const elapsed = Date.now() - (current.createdAt ?? Date.now());
	current.remaining = Math.max((current.remaining ?? current.duration ?? 5600) - elapsed, 0);
	clearToastTimeout(id);
}

function resumeToast(id: number) {
	if (!toastUIState.data) return;
	const current = toastUIState.data.toasts.find((t) => t.id === id);
	if (!current || current.persistent || !current.paused || current.leaving) return;
	current.paused = false;
	current.createdAt = Date.now();
	scheduleToastRemoval(id, current.remaining ?? current.duration ?? 4200);
}

function updateToast(id: number, updates: Partial<Toast>) {
	if (!toastUIState.data) return;
	const current = toastUIState.data.toasts.find((t) => t.id === id);
	if (!current) return;
	Object.assign(current, updates);
	if (updates.leaving === false) {
		current.leaving = false;
	}
	if (!updates.persistent && updates.duration !== undefined) {
		scheduleToastRemoval(id, updates.duration);
	}
}

function createToast(toastData: ToastInput): Toast {
	if (!toastUIState.data) return toastData as Toast;

	const toastId = Math.floor(Math.random() * 10623962836);
	const duration = toastData.duration ?? 5600;

	const nextToast: Toast = {
		...toastData,
		id: toastId,
		duration,
		type: toastData.type ?? 'default',
		exitable: toastData.exitable ?? true,
		createdAt: Date.now(),
		remaining: duration,
		paused: false,
		leaving: false
	};

	nextToast.exit = () => dismissToast(toastId);
	nextToast.update = (updates: Partial<Toast>) => updateToast(toastId, updates);

	if (toastUIState.data.toasts.length >= 5) {
		const oldest = toastUIState.data.toasts[0];
		if (oldest?.id !== undefined) dismissToast(oldest.id);
	}

	toastUIState.data.toasts = [...toastUIState.data.toasts, nextToast];

	if (!nextToast.persistent) {
		scheduleToastRemoval(toastId, duration);
	}

	return nextToast;
}

function toastPromise<T>(promise: Promise<T>, messages: PromiseMessages<T>): Toast {
	const t = createToast({
		title: messages.loading,
		description: messages.loadingDescription,
		type: 'loading',
		persistent: true,
		exitable: false
	});

	promise
		.then((data) => {
			if (t.id === undefined) return;
			const title =
				typeof messages.success === 'function' ? messages.success(data) : messages.success;
			const description = messages.successDescription
				? typeof messages.successDescription === 'function'
					? messages.successDescription(data)
					: messages.successDescription
				: undefined;
			updateToast(t.id, {
				title,
				description,
				type: 'success',
				persistent: false,
				duration: 4200,
				exitable: true,
				createdAt: Date.now(),
				remaining: 4200,
				paused: false,
				leaving: false
			});
			scheduleToastRemoval(t.id, 4200);
		})
		.catch((err) => {
			if (t.id === undefined) return;
			const title = typeof messages.error === 'function' ? messages.error(err) : messages.error;
			const description = messages.errorDescription
				? typeof messages.errorDescription === 'function'
					? messages.errorDescription(err)
					: messages.errorDescription
				: undefined;
			updateToast(t.id, {
				title,
				description,
				type: 'error',
				persistent: false,
				duration: 4200,
				exitable: true,
				createdAt: Date.now(),
				remaining: 4200,
				paused: false,
				leaving: false
			});
			scheduleToastRemoval(t.id, 4200);
		});

	return t;
}

const toast = createToast as ToastFn;
toast.promise = toastPromise;
toast.success = (title, opts) => createToast({ ...opts, title, type: 'success' });
toast.error = (title, opts) => createToast({ ...opts, title, type: 'error' });
toast.warning = (title, opts) => createToast({ ...opts, title, type: 'warning' });
toast.info = (title, opts) => createToast({ ...opts, title, type: 'info' });
toast.loading = (title, opts) =>
	createToast({ ...opts, title, type: 'loading', persistent: true, exitable: false });
toast.dismiss = (id?: number) => {
	if (id !== undefined) {
		dismissToast(id);
	} else {
		[...toastUIState.data.toasts].forEach((t) => {
			if (t.id !== undefined) dismissToast(t.id);
		});
	}
};

function getToastUIState(): UIState<ToastUIState> {
	return getContext(STATE_KEY);
}

function setToastUIState(): UIState<ToastUIState> {
	return setContext(STATE_KEY, toastUIState);
}

export { toast, dismissToast, pauseToast, resumeToast, updateToast, toastUIState, getToastUIState, setToastUIState };
