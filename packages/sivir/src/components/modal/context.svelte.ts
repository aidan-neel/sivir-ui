import { getContext, hasContext, setContext } from 'svelte';

import type { ModalState } from '.';

const MODAL_CONTEXT = Symbol('sivir.modal');

export type ModalContext = {
	id: string;
	contentId: string;
	returnFocusEl: HTMLElement | undefined;
	state: ModalState;
};

export function setModalContext(context: ModalContext) {
	setContext(MODAL_CONTEXT, context);
	return context;
}

export function getModalContext() {
	if (!hasContext(MODAL_CONTEXT)) {
		throw new Error('Modal components must be used within <Modal.Root>.');
	}

	return getContext<ModalContext>(MODAL_CONTEXT);
}
