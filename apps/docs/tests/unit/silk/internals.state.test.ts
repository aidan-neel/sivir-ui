import { describe, expect, it, beforeEach } from 'vitest';
import {
	useState,
	UIState,
	states
} from '@silk/ui/internals/state.svelte.ts';

/*
 * `states` is a module-level singleton. Tests reset it before each case
 * to avoid cross-test contamination. The reset uses delete loops rather
 * than reassignment because `states` is a const reactive Proxy.
 */
function resetStates() {
	for (const key of Object.keys(states)) {
		delete states[key];
	}
}

describe('UIState constructor', () => {
	beforeEach(resetStates);

	it('stores the default value as data', () => {
		const ui = new UIState({ foo: 1 }, 'my-key');
		expect(ui.data).toEqual({ foo: 1 });
	});

	it('stores the key', () => {
		const ui = new UIState({}, 'some-key');
		expect(ui.key).toBe('some-key');
	});
});

describe('UIState.destroy', () => {
	beforeEach(resetStates);

	it('removes the entry from the global states registry', () => {
		const ui = useState({ x: 1 }, 'destructible');
		expect(states['destructible']).toBe(ui);
		ui.destroy();
		expect(states['destructible']).toBeUndefined();
	});

	it('sets data to undefined after destroy', () => {
		const ui = useState({ x: 1 }, 'cleared');
		ui.destroy();
		expect(ui.data).toBeUndefined();
	});
});

describe('useState', () => {
	beforeEach(resetStates);

	it('returns a UIState instance', () => {
		const ui = useState({ count: 0 }, 'counter');
		expect(ui).toBeInstanceOf(UIState);
	});

	it('uses the provided key', () => {
		const ui = useState({ x: 1 }, 'explicit-key');
		expect(ui.key).toBe('explicit-key');
	});

	it('generates a key when none is provided', () => {
		const ui = useState({});
		expect(typeof ui.key).toBe('string');
		expect(ui.key.length).toBeGreaterThan(0);
	});

	it('returns the same instance for the same key (does not overwrite existing state)', () => {
		const first = useState({ count: 5 }, 'shared');
		const second = useState({ count: 999 }, 'shared');
		expect(second).toBe(first);
		expect(second.data.count).toBe(5);
	});

	it('registers the instance in the global states map', () => {
		const ui = useState({ a: 'b' }, 'registered');
		expect(states['registered']).toBe(ui);
	});

	it('returns different instances for different keys', () => {
		const a = useState({}, 'key-a');
		const b = useState({}, 'key-b');
		expect(a).not.toBe(b);
	});

	it('keeps state mutations visible across calls with the same key', () => {
		const ui = useState({ count: 0 }, 'mutable');
		ui.data.count = 42;
		const sameUi = useState({ count: 0 }, 'mutable');
		expect(sameUi.data.count).toBe(42);
	});

	it('persists data after redefinition with the same key', () => {
		const ui = useState({ open: false }, 'persisted');
		ui.data.open = true;
		const re = useState({ open: false }, 'persisted');
		expect(re.data.open).toBe(true);
	});
});

describe('states registry', () => {
	beforeEach(resetStates);

	it('is empty after reset', () => {
		expect(Object.keys(states)).toHaveLength(0);
	});

	it('grows as states are registered', () => {
		useState({}, 'k1');
		useState({}, 'k2');
		useState({}, 'k3');
		expect(Object.keys(states)).toHaveLength(3);
	});

	it('shrinks on destroy', () => {
		const a = useState({}, 'a');
		const b = useState({}, 'b');
		expect(Object.keys(states)).toHaveLength(2);
		a.destroy();
		expect(Object.keys(states)).toHaveLength(1);
		expect(states['a']).toBeUndefined();
		expect(states['b']).toBe(b);
	});
});

describe('useState -- auto-generated keys', () => {
	beforeEach(resetStates);

	it('generates unique keys for separate calls without explicit key', () => {
		const a = useState({});
		const b = useState({});
		const c = useState({});
		expect(a.key).not.toBe(b.key);
		expect(b.key).not.toBe(c.key);
		expect(a.key).not.toBe(c.key);
	});

	it('auto-generated key registers in the global states map', () => {
		const ui = useState({ x: 1 });
		expect(states[ui.key]).toBe(ui);
	});
});
