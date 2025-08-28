interface DefaultState {}

export class UIState<T extends DefaultState> {
	data = $state<T>();

	constructor(defaultValue: T) {
		this.data = defaultValue;
	}

	destroy() {
		this.data = undefined;
	}
}

export function getState<T extends DefaultState>(key: string, defaultValue: T) {
	if (!states[key]) {
		states[key] = new UIState(defaultValue);
	}
	return states[key] as UIState<T>;
}

export const states = $state<Record<string, UIState<any>>>({});
