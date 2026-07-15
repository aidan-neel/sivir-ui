export type UIStateShape = object;

export class UIState<T extends UIStateShape> {
	data = $state<T>({} as T);
	key = $state<string>('');

	constructor(defaultValue: T, key: string) {
		this.data = defaultValue;
		this.key = key;
	}

	/** Removes the registered state instance from the shared registry. */
	destroy() {
		delete states[this.key];
		this.data = undefined as unknown as T;
	}
}

/** Returns a shared state bucket for a given key, creating it on first access. */
export function useState<T extends UIStateShape>(
	defaultValue: T,
	key: string = Math.random().toString(36).substring(2)
) {
	if (!states[key]) {
		states[key] = new UIState(defaultValue, key);
	}
	return states[key] as UIState<T>;
}

export const states = $state<Record<string, UIState<UIStateShape>>>({});
