import type { Animation } from './types';

/** Travel in from below with a fade. No scale. */
export const animation: Animation = {
	slug: 'fly',
	name: 'Fly',
	description: 'Panels travel in from below with a fade.',
	keyframes: {
		panelIn: 'silk-panel-fly-in',
		panelOut: 'silk-panel-fly-out',
		overlayIn: 'silk-fade-in',
		overlayOut: 'silk-fade-out',
		sheetIn: 'silk-sheet-in',
		sheetOut: 'silk-sheet-out'
	}
};
