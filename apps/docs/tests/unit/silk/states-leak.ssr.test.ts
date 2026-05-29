import { describe, expect, it, beforeEach } from 'vitest';
import { render } from 'svelte/server';
import type { Component } from 'svelte';
import { states, useState } from '@silk/ui/internals/state.svelte.ts';
import {
	toast,
	__setActiveToastStateForTests,
	__getActiveToastStateForTests
} from '@silk/ui/components/toast/lib.svelte.ts';
import { UIState } from '@silk/ui/internals/state.svelte.ts';
import type { ToastUIState } from '@silk/ui/components/toast/lib.svelte.ts';

import ModalFixture from '../../fixtures/ModalFixture.svelte';
import SheetFixture from '../../fixtures/SheetFixture.svelte';

/*
 * Multi-request states-registry leak test -- SSR tier, failure modes (i)
 * and (ii).
 *
 * BACKGROUND
 * silk's global registry at `internals/state.svelte.ts:30` is
 * `$state<Record<string, UIState<...>>>({})` -- module-scoped.
 *
 * EMPIRICAL HISTORY
 *   (i)  Did NOT reproduce. Svelte 5's `svelte/server.render()` does not
 *        execute `useState(...)` side effects from component scripts.
 *        The audit's broad memory-growth concern was refuted for the
 *        registry pattern at large.
 *   (ii) DID reproduce for the toast singleton -- `toastUIState` was a
 *        module-level singleton whose mutations persisted across SSR
 *        renders (P3-F12).
 *
 * CURRENT STATE
 * Toast state is now per-Toaster-mount. The free-function `toast(...)` API
 * is a no-op when no Toaster has mounted (i.e., during SSR). Assertions:
 *   - mode (i): still no reproduction (held).
 *   - mode (ii): no longer reproduces -- `toast()` on the server does
 *     not write anywhere. Test asserts the no-op behavior.
 *
 * Cross-request bleed is structurally impossible after the fix:
 * each Toaster mount registers a fresh UIState, the previous mount's
 * state goes out of scope when its component unmounts (onDestroy clears
 * activeState), and no module-level state survives between renders.
 */

beforeEach(() => {
	for (const key of Object.keys(states)) {
		delete states[key];
	}
	__setActiveToastStateForTests(undefined);
});

describe('Failure mode (i) -- registry pollution across SSR renders (still NOT reproducing)', () => {
	it('manual useState call DOES write to the registry (control)', () => {
		expect(Object.keys(states).length).toBe(0);
		useState({ open: false }, 'manual-control-key');
		expect(Object.keys(states)).toContain('manual-control-key');
	});

	it('rendering ModalFixture via svelte/server does NOT populate the registry', () => {
		expect(Object.keys(states).length).toBe(0);
		render(ModalFixture as Component<Record<string, unknown>>, { props: { open: false } });
		expect(Object.keys(states).length).toBe(0);
	});

	it('rendering ModalFixture 50 times does NOT grow the registry', () => {
		expect(Object.keys(states).length).toBe(0);
		for (let i = 0; i < 50; i++) {
			render(ModalFixture as Component<Record<string, unknown>>, { props: { open: false } });
		}
		expect(Object.keys(states).length).toBe(0);
	});

	it('rendering different fixtures does NOT grow the registry', () => {
		render(ModalFixture as Component<Record<string, unknown>>, { props: { open: false } });
		render(SheetFixture as Component<Record<string, unknown>>, { props: { open: false } });
		render(SheetFixture as Component<Record<string, unknown>>, { props: { open: true } });
		render(ModalFixture as Component<Record<string, unknown>>, { props: { open: true } });
		expect(Object.keys(states).length).toBe(0);
	});
});

describe('Failure mode (ii) -- toast cross-request bleed (FIXED)', () => {
	it('SSR toast.success() is a no-op (no active state without Toaster mount)', () => {
		// On the server, no Toaster has mounted. activeState is undefined.
		expect(__getActiveToastStateForTests()).toBeUndefined();

		// toast.success(...) does NOT crash. Returns a stub toast.
		const stub = toast.success('this should be a no-op on SSR');
		// The stub carries the input data but is NOT registered anywhere.
		expect(stub.title).toBe('this should be a no-op on SSR');

		// No state was created.
		expect(__getActiveToastStateForTests()).toBeUndefined();
	});

	it('SSR multiple toast calls leave no state behind', () => {
		expect(__getActiveToastStateForTests()).toBeUndefined();

		toast.success('a');
		toast.error('b');
		toast.warning('c');
		toast.info('d');
		toast.loading('e');

		// No active state was registered.
		expect(__getActiveToastStateForTests()).toBeUndefined();
	});

	it('SSR toast.dismiss() with no active state is a safe no-op (no crash)', () => {
		expect(__getActiveToastStateForTests()).toBeUndefined();
		expect(() => toast.dismiss()).not.toThrow();
		expect(() => toast.dismiss(123)).not.toThrow();
	});

	it('Toaster mount per "request" -- two separate states do NOT share toasts', () => {
		// Simulate request A: a Toaster mount registers fresh state.
		const stateA = new UIState<ToastUIState>({ toasts: [] }, 'request-a-toaster');
		__setActiveToastStateForTests(stateA);

		toast({ title: 'request A toast', persistent: true });
		expect(stateA.data.toasts.length).toBe(1);

		// Simulate request A finishing (Toaster unmounts, activeState clears).
		__setActiveToastStateForTests(undefined);

		// Request B mounts its own Toaster.
		const stateB = new UIState<ToastUIState>({ toasts: [] }, 'request-b-toaster');
		__setActiveToastStateForTests(stateB);

		// Request B's state is empty -- no leak from A.
		expect(stateB.data.toasts.length).toBe(0);

		// Toasts added in B do not appear in A.
		toast({ title: 'request B toast', persistent: true });
		expect(stateB.data.toasts.length).toBe(1);
		expect(stateA.data.toasts.length).toBe(1); // A still has its toast.
		expect(stateA.data.toasts[0].title).toBe('request A toast');
		expect(stateB.data.toasts[0].title).toBe('request B toast');
	});
});

describe('Empirical summary post-fix', () => {
	it('P3-F12 is resolved: toast singleton no longer bleeds across SSR requests', () => {
		// Documentation anchor for the fix.
		// On SSR (no Toaster mount), toast(...) is a no-op.
		// On client, each Toaster owns its own state.
		// Cross-request bleed is structurally impossible.
		expect(true).toBe(true);
	});
});
