import { setContext, getContext, onDestroy } from 'svelte';

export const STATE_KEY = Symbol('TOAST');

const toastTimeouts = new Map<
	number,
	{ timeout: ReturnType<typeof setTimeout>; state: ToastState }
>();
const TOAST_EXIT_DURATION = 340;
let nextToastId = 0;

/**
 * Per-Toaster-mount state. The most recently mounted Toaster registers
 * here for free-function toast(...) calls. On SSR there is no Toaster
 * mount, so activeState stays undefined and all toast functions become
 * no-ops -- eliminating the cross-request bleed bug (P3-F12).
 */
let activeState: ToastState | undefined;

export interface ToastUIState {
	toasts: Toast[];
}

export interface ToastState {
	data: ToastUIState;
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
	const entry = toastTimeouts.get(id);
	if (!entry) return;
	clearTimeout(entry.timeout);
	toastTimeouts.delete(id);
}

/** Starts the exit lifecycle for a toast and removes it after the exit duration. */
function dismissToastForState(state: ToastState | undefined, id: number) {
	if (!state?.data) return;
	const current = state.data.toasts.find((t) => t.id === id);
	if (!current) return;
	if (current.leaving) return;
	current.leaving = true;
	clearToastTimeout(id);
	toastTimeouts.set(id, {
		state,
		timeout: setTimeout(() => {
			state.data.toasts = state.data.toasts.filter((t) => t.id !== id);
			toastTimeouts.delete(id);
		}, TOAST_EXIT_DURATION)
	});
}

function dismissToast(id: number) {
	dismissToastForState(activeState, id);
}

/** Schedules automatic dismissal for a toast after the provided duration. */
function scheduleToastRemoval(id: number, duration: number, state = activeState) {
	if (!state) return;
	clearToastTimeout(id);
	toastTimeouts.set(id, {
		state,
		timeout: setTimeout(() => dismissToastForState(state, id), duration)
	});
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
function updateToastForState(state: ToastState | undefined, id: number, updates: Partial<Toast>) {
	if (!state?.data) return;
	const current = state.data.toasts.find((t) => t.id === id);
	if (!current) return;
	Object.assign(current, updates);
	if (updates.leaving === false) {
		current.leaving = false;
	}
	if (!updates.persistent && updates.duration !== undefined) {
		scheduleToastRemoval(id, updates.duration, state);
	}
}

function updateToast(id: number, updates: Partial<Toast>) {
	updateToastForState(activeState, id, updates);
}

/** Creates a toast instance, registers its actions, and returns the live object. */
function createToast(toastData: ToastInput, state = activeState): Toast {
	if (!state?.data) return toastData as Toast;

	const toastId = (nextToastId += 1);
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

	nextToast.exit = () => dismissToastForState(state, toastId);
	nextToast.update = (updates: Partial<Toast>) => updateToastForState(state, toastId, updates);

	if (state.data.toasts.length >= 5) {
		const oldest = state.data.toasts[0];
		if (oldest?.id !== undefined) dismissToastForState(state, oldest.id);
	}

	state.data.toasts = [...state.data.toasts, nextToast];

	if (!nextToast.persistent) {
		scheduleToastRemoval(toastId, duration, state);
	}

	return nextToast;
}

/** Wraps a promise with loading, success, and error toast states. */
function toastPromise<T>(promise: Promise<T>, messages: PromiseMessages<T>): Toast {
	const state = activeState;
	const t = createToast(
		{
			title: messages.loading,
			description: messages.loadingDescription,
			type: 'loading',
			persistent: true,
			exitable: false
		},
		state
	);

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
			updateToastForState(state, t.id, {
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
			scheduleToastRemoval(t.id, 4200, state);
		})
		.catch((err) => {
			if (t.id === undefined) return;
			const title = typeof messages.error === 'function' ? messages.error(err) : messages.error;
			const description = messages.errorDescription
				? typeof messages.errorDescription === 'function'
					? messages.errorDescription(err)
					: messages.errorDescription
				: undefined;
			updateToastForState(state, t.id, {
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
			scheduleToastRemoval(t.id, 4200, state);
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

function getToastUIState(): ToastState | undefined {
	return getContext(STATE_KEY);
}

/**
 * Per-mount state. Each <Toaster /> instance gets its own scoped state and
 * registers as the active state for free-function toast(...) calls.
 * On the server there is no Toaster mount, so activeState stays
 * undefined and toast(...) is a no-op -- eliminating the cross-request
 * bleed bug (P3-F12).
 */
function setToastUIState(): ToastState {
	const state = $state<ToastState>({ data: { toasts: [] } });
	setContext(STATE_KEY, state);
	activeState = state;
	onDestroy(() => {
		for (const [id, entry] of toastTimeouts) {
			if (entry.state !== state) continue;
			clearTimeout(entry.timeout);
			toastTimeouts.delete(id);
		}
		if (activeState === state) activeState = undefined;
	});
	return state;
}

/**
 * Test-only escape hatch. Lets unit tests drive toast functions without
 * mounting a Toaster component. Production code uses setToastUIState
 * via the Toaster.
 */
function __setActiveToastStateForTests(state: ToastState | undefined) {
	activeState = state;
}

/**
 * Test-only accessor. Lets unit tests read the currently active toast
 * state without going through Svelte context.
 */
function __getActiveToastStateForTests(): ToastState | undefined {
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
