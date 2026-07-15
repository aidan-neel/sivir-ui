import { getContext, hasContext, setContext } from 'svelte';

import type { CommandState } from '.';

const COMMAND_CONTEXT = Symbol('sivir.command');

export function setCommandContext(state: CommandState) {
	setContext(COMMAND_CONTEXT, state);
	return state;
}

export function getCommandContext() {
	if (!hasContext(COMMAND_CONTEXT)) {
		throw new Error('Command components must be used within <Command.Root>.');
	}

	return getContext<CommandState>(COMMAND_CONTEXT);
}

export function getCommandResults(state: CommandState) {
	const source = state.searchContent.trim() === '' ? state.items : state.results;
	return source.filter((item) => !item.disabled);
}

export function resetCommand(state: CommandState) {
	state.searchContent = '';
	state.results = [...state.items];
	state.activeId = getCommandResults(state)[0]?.id;
}
