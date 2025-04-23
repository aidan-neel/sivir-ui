interface DefaultState {
	open: boolean;
}

export class UIState<T extends DefaultState> {
	data = $state<T>();

	constructor(defaultValue: T) {
		this.data = defaultValue;
	}

	destroy() {
		this.data = undefined;
	}
}
