import { getContext, hasContext, setContext } from 'svelte';

import type { CollapsibleState } from '.';

const COLLAPSIBLE_CONTEXT = Symbol('sivir.collapsible');

export type CollapsibleContext = {
	id: string;
	state: CollapsibleState;
};

export function setCollapsibleContext(context: CollapsibleContext) {
	setContext(COLLAPSIBLE_CONTEXT, context);
	return context;
}

export function getCollapsibleContext() {
	if (!hasContext(COLLAPSIBLE_CONTEXT)) {
		throw new Error('Collapsible components must be used within <Collapsible.Root>.');
	}

	return getContext<CollapsibleContext>(COLLAPSIBLE_CONTEXT);
}
