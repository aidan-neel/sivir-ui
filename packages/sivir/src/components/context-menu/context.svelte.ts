import { getContext, hasContext, setContext } from 'svelte';

import type { ContextMenuState } from '.';

const CONTEXT_MENU_CONTEXT = Symbol('sivir.context-menu');

export type ContextMenuContext = {
	state: ContextMenuState;
	parentState?: ContextMenuState;
};

export function setContextMenuContext(context: ContextMenuContext) {
	setContext(CONTEXT_MENU_CONTEXT, context);
	return context;
}

export function getContextMenuContext() {
	if (!hasContext(CONTEXT_MENU_CONTEXT)) {
		throw new Error('ContextMenu components must be used within <ContextMenu.Root>.');
	}

	return getContext<ContextMenuContext>(CONTEXT_MENU_CONTEXT);
}
