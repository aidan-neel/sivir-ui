import type { Animation } from './types';

/** No motion. Surfaces appear and disappear instantly. */
export const animation: Animation = {
	slug: 'none',
	name: 'None',
	description: 'No motion. Surfaces appear and disappear instantly.',
	keyframes: {
		panelIn: 'none',
		panelOut: 'none',
		overlayIn: 'none',
		overlayOut: 'none',
		sheetIn: 'none',
		sheetOut: 'none'
	}
};
