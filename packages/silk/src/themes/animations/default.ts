import type { Animation } from './types';

/** Fly up a touch while scaling in -- the classic flyAndScale. The default. */
export const animation: Animation = {
	slug: 'default',
	name: 'Default',
	description: 'Panels fly up a touch while scaling in (flyAndScale).',
	keyframes: {
		panelIn: 'silk-panel-default-in',
		panelOut: 'silk-panel-default-out',
		overlayIn: 'silk-fade-in',
		overlayOut: 'silk-fade-out',
		sheetIn: 'silk-sheet-in',
		sheetOut: 'silk-sheet-out'
	}
};
