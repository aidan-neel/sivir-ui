import { getContext, hasContext, setContext } from 'svelte';

import type { PopoverState } from '.';

const POPOVER_CONTEXT = Symbol('sivir.popover');

export type PopoverContext = {
	id: string;
	state: PopoverState;
};

export function setPopoverContext(context: PopoverContext) {
	setContext(POPOVER_CONTEXT, context);
	return context;
}

export function getPopoverContext() {
	if (!hasContext(POPOVER_CONTEXT)) {
		throw new Error('Popover components must be used within <Popover.Root>.');
	}

	return getContext<PopoverContext>(POPOVER_CONTEXT);
}
