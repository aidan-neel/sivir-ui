import type { ThemeTransitionPreset } from './types';

export const preset: ThemeTransitionPreset = {
	slug: 'gentle',
	name: 'Gentle',
	description: 'Slower than balanced but never feels sluggish -- softer overall.',
	motion: {
		hoverDuration: '250ms',
		menuDuration: '160ms',
		panelDuration: '270ms',
		sheetDuration: '340ms',
		overlayDuration: '160ms',
		toastInDuration: '470ms',
		toastOutDuration: '360ms',
		panelY: 6,
		panelScaleStart: 0.985
	}
};
