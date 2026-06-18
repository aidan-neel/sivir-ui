import type { Animation } from './types';

/** Scale up from slightly small with a fade. No travel. */
export const animation: Animation = {
	slug: 'scale',
	name: 'Scale',
	description: 'Panels scale up from slightly small with a fade.',
	keyframes: {
		panelIn: 'silk-panel-scale-in',
		panelOut: 'silk-panel-scale-out',
		overlayIn: 'silk-fade-in',
		overlayOut: 'silk-fade-out',
		sheetIn: 'silk-sheet-in',
		sheetOut: 'silk-sheet-out'
	}
};
