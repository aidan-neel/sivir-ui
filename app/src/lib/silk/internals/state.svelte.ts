interface DefaultState {}

export class UIState<T extends DefaultState> {
	data = $state<T>({} as T);
	key = $state<string>('');

	constructor(defaultValue: T, key: string) {
		this.data = defaultValue;
		this.key = key;
	}

	destroy() {
		delete states[this.key];
		this.data = undefined as unknown as T;
	}
}

export function useState<T extends DefaultState>(
	defaultValue: T,
	key: string = Math.random().toString(36).substring(2)
) {
	if (!states[key]) {
		states[key] = new UIState(defaultValue, key);
	}
	return states[key] as UIState<T>;
}

export const states = $state<Record<string, UIState<any>>>({});
