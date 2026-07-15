import { getContext, hasContext, setContext } from 'svelte';

import type { SheetState } from '.';

const SHEET_CONTEXT = Symbol('sivir.sheet');

export type SheetContext = {
	id: string;
	state: SheetState;
};

export function setSheetContext(context: SheetContext) {
	setContext(SHEET_CONTEXT, context);
	return context;
}

export function getSheetContext() {
	if (!hasContext(SHEET_CONTEXT)) {
		throw new Error('Sheet components must be used within <Sheet.Root>.');
	}

	return getContext<SheetContext>(SHEET_CONTEXT);
}
