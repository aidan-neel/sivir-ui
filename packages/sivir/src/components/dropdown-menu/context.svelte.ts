import { getContext, hasContext, setContext } from 'svelte';

import type { PopoverState } from '@sivir/ui/components/popover';

const DROPDOWN_MENU_CONTEXT = Symbol('sivir.dropdown-menu');

export type DropdownMenuContext = {
	inverted: boolean;
	parentState?: PopoverState;
};

export function setDropdownMenuContext(context: DropdownMenuContext) {
	setContext(DROPDOWN_MENU_CONTEXT, context);
	return context;
}

export function getDropdownMenuContext() {
	if (!hasContext(DROPDOWN_MENU_CONTEXT)) {
		throw new Error('DropdownMenu components must be used within <DropdownMenu.Root>.');
	}

	return getContext<DropdownMenuContext>(DROPDOWN_MENU_CONTEXT);
}
