import type { UIState } from './state.svelte';
import { Button } from '$lib/ui/components/button';

export function bindTriggerToButton(
	button: HTMLButtonElement | undefined,
	state: UIState<any>,
	callback: () => void
) {
	if (state.data && button) {
		button.onclick = () => {
			state.data.open = !state.data.open;
			callback();
		};
	}
}
