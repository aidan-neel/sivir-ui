import type { Animation } from './types';

/** The panel rises and its children stagger in one after another. */
export const animation: Animation = {
	slug: 'cascade',
	name: 'Cascade',
	description: 'The panel rises and its children stagger in one by one.',
	cascade: true,
	keyframes: {
		panelIn: 'silk-panel-rise-in',
		panelOut: 'silk-panel-rise-out',
		overlayIn: 'silk-fade-in',
		overlayOut: 'silk-fade-out',
		sheetIn: 'silk-sheet-in',
		sheetOut: 'silk-sheet-out'
	}
};
