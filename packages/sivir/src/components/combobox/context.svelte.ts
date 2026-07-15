import { getContext, hasContext, setContext } from 'svelte';

import type { ComboboxState } from '.';

const COMBOBOX_CONTEXT = Symbol('sivir.combobox');

export type ComboboxContext = {
	id: string;
	placeholder: string;
	state: ComboboxState;
};

export function setComboboxContext(context: ComboboxContext) {
	setContext(COMBOBOX_CONTEXT, context);
	return context;
}

export function getComboboxContext() {
	if (!hasContext(COMBOBOX_CONTEXT)) {
		throw new Error('Combobox components must be used within <Combobox.Root>.');
	}

	return getContext<ComboboxContext>(COMBOBOX_CONTEXT);
}
