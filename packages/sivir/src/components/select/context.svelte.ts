import { getContext, hasContext, setContext } from 'svelte';

import type { SelectState } from '.';

const SELECT_CONTEXT = Symbol('sivir.select');

export type SelectContext = {
	id: string;
	state: SelectState;
	/** Plain registries — never put these inside $state. */
	labels: Map<string, string>;
	values: Set<string>;
};

export function setSelectContext(context: SelectContext) {
	setContext(SELECT_CONTEXT, context);
	return context;
}

export function getSelectContext() {
	if (!hasContext(SELECT_CONTEXT)) {
		throw new Error('Select components must be used within <Select.Root>.');
	}

	return getContext<SelectContext>(SELECT_CONTEXT);
}
