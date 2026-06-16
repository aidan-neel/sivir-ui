import type { Animation } from './types';

/** Slide in from below with a longer travel and a fade. */
export const animation: Animation = {
	slug: 'slide',
	name: 'Slide',
	description: 'Panels slide in from below with a longer travel.',
	keyframes: {
		panelIn: 'silk-panel-slide-in',
		panelOut: 'silk-panel-slide-out',
		overlayIn: 'silk-fade-in',
		overlayOut: 'silk-fade-out',
		sheetIn: 'silk-sheet-in',
		sheetOut: 'silk-sheet-out'
	}
};
