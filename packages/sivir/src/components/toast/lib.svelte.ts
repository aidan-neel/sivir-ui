import { UIState } from '@sivir/ui/internals/state.svelte.ts';
import { setContext, getContext, onDestroy } from 'svelte';

export const STATE_KEY = Symbol('TOAST');

const toastTimeouts = new Map<number, ReturnType<typeof setTimeout>>();
const TOAST_EXIT_DURATION = 340;

/**
 * Per-Toaster-mount state. The most recently mounted Toaster registers
 * here for free-function toast(...) calls. On SSR there is no Toaster
 * mount, so activeState stays undefined and all toast functions become
 * no-ops -- eliminating the cross-request bleed bug (P3-F12).
 */
let activeState: UIState<ToastUIState> | undefined;

export interface ToastUIState {
	toasts: Toast[];
}

export interface ToastAction {
	label: string;
	variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
	callback: () => void;
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
	error: string | ((error: unknown) => string);
	loadingDescription?: string;
	successDescription?: string | ((data: T) => string);
	errorDescription?: string | ((error: unknown) => string);
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

/** Clears the pending timeout for a toast when one exists. */
function clearToastTimeout(id: number) {
	const timeout = toastTimeouts.get(id);
	if (!timeout) return;
	clearTimeout(timeout);
	toastTimeouts.delete(id);
}

/** Starts the exit lifecycle for a toast and removes it after the exit duration. */
function dismissToast(id: number) {
	const state = activeState;
	if (!state?.data) return;
	const current = state.data.toasts.find((t) => t.id === id);
	if (!current) return;
	if (current.leaving) return;
	current.leaving = true;
	clearToastTimeout(id);
	toastTimeouts.set(
		id,
		setTimeout(() => {
			const s = activeState;
			if (!s?.data) return;
			s.data.toasts = s.data.toasts.filter((t) => t.id !== id);
			toastTimeouts.delete(id);
		}, TOAST_EXIT_DURATION)
	);
}

/** Schedules automatic dismissal for a toast after the provided duration. */
function scheduleToastRemoval(id: number, duration: number) {
	clearToastTimeout(id);
	toastTimeouts.set(
		id,
		setTimeout(() => dismissToast(id), duration)
	);
}

/** Pauses a toast timer while the user is interacting with it. */
function pauseToast(id: number) {
	const state = activeState;
	if (!state?.data) return;
	const current = state.data.toasts.find((t) => t.id === id);
	if (!current || current.persistent || current.paused || current.leaving) return;
	current.paused = true;
	const elapsed = Date.now() - (current.createdAt ?? Date.now());
	current.remaining = Math.max((current.remaining ?? current.duration ?? 5600) - elapsed, 0);
	clearToastTimeout(id);
}

/** Resumes a paused toast timer using its remaining duration. */
function resumeToast(id: number) {
	const state = activeState;
	if (!state?.data) return;
	const current = state.data.toasts.find((t) => t.id === id);
	if (!current || current.persistent || !current.paused || current.leaving) return;
	current.paused = false;
	current.createdAt = Date.now();
	scheduleToastRemoval(id, current.remaining ?? current.duration ?? 4200);
}

/** Updates a toast in place and reschedules dismissal when needed. */
function updateToast(id: number, updates: Partial<Toast>) {
	const state = activeState;
	if (!state?.data) return;
	const current = state.data.toasts.find((t) => t.id === id);
	if (!current) return;
	Object.assign(current, updates);
	if (updates.leaving === false) {
		current.leaving = false;
	}
	if (!updates.persistent && updates.duration !== undefined) {
		scheduleToastRemoval(id, updates.duration);
	}
}

/** Creates a toast instance, registers its actions, and returns the live object. */
function createToast(toastData: ToastInput): Toast {
	const state = activeState;
	if (!state?.data) return toastData as Toast;

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

	if (state.data.toasts.length >= 5) {
		const oldest = state.data.toasts[0];
		if (oldest?.id !== undefined) dismissToast(oldest.id);
	}

	state.data.toasts = [...state.data.toasts, nextToast];

	if (!nextToast.persistent) {
		scheduleToastRemoval(toastId, duration);
	}

	return nextToast;
}

/** Wraps a promise with loading, success, and error toast states. */
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
		return;
	}
	const state = activeState;
	if (!state?.data) return;
	[...state.data.toasts].forEach((t) => {
		if (t.id !== undefined) dismissToast(t.id);
	});
};

function getToastUIState(): UIState<ToastUIState> | undefined {
	return getContext(STATE_KEY);
}

/**
 * Per-mount state. Each <Toaster /> instance gets its own UIState and
 * registers as the active state for free-function toast(...) calls.
 * On the server there is no Toaster mount, so activeState stays
 * undefined and toast(...) is a no-op -- eliminating the cross-request
 * bleed bug (P3-F12).
 */
function setToastUIState(): UIState<ToastUIState> {
	const state = new UIState<ToastUIState>(
		{ toasts: [] },
		`toast-${Math.random().toString(36).slice(2)}`
	);
	setContext(STATE_KEY, state);
	activeState = state;
	onDestroy(() => {
		if (activeState === state) activeState = undefined;
	});
	return state;
}

/**
 * Test-only escape hatch. Lets unit tests drive toast functions without
 * mounting a Toaster component. Production code uses setToastUIState
 * via the Toaster.
 */
function __setActiveToastStateForTests(state: UIState<ToastUIState> | undefined) {
	activeState = state;
}

/**
 * Test-only accessor. Lets unit tests read the currently active toast
 * state without going through Svelte context.
 */
function __getActiveToastStateForTests(): UIState<ToastUIState> | undefined {
	return activeState;
}

export {
	toast,
	dismissToast,
	pauseToast,
	resumeToast,
	updateToast,
	getToastUIState,
	setToastUIState,
	__setActiveToastStateForTests,
	__getActiveToastStateForTests
};
