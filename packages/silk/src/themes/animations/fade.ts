import type { Animation } from './types';

/** Opacity only -- everything cross-fades, nothing moves or scales. */
export const animation: Animation = {
	slug: 'fade',
	name: 'Fade',
	description: 'Opacity only. Surfaces cross-fade without moving.',
	keyframes: {
		panelIn: 'silk-fade-in',
		panelOut: 'silk-fade-out',
		overlayIn: 'silk-fade-in',
		overlayOut: 'silk-fade-out',
		sheetIn: 'silk-fade-in',
		sheetOut: 'silk-fade-out'
	}
};
