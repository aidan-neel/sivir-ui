import { getContext, hasContext, setContext } from 'svelte';

import type { ContextMenuState } from '.';

const CONTEXT_MENU_CONTEXT = Symbol('sivir.context-menu');

export type ContextMenuContext = {
	state: ContextMenuState;
	/** Open menu layers from root → immediate parent (submenu cone ancestors). */
	ancestors: ContextMenuState[];
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

/** Close the current layer and every ancestor (full cone collapse). */
export function dismissContextMenu(current: ContextMenuState, ancestors: ContextMenuState[]) {
	current.open = false;
	for (let i = ancestors.length - 1; i >= 0; i -= 1) {
		ancestors[i]!.open = false;
	}
}
