import type { ThemeTransitionPreset } from './types';

export const preset: ThemeTransitionPreset = {
	slug: 'none',
	name: 'None',
	description: 'No motion at all -- accessibility-first or static product surfaces.',
	motion: {
		hoverDuration: '0ms',
		menuDuration: '0ms',
		panelDuration: '0ms',
		sheetDuration: '0ms',
		overlayDuration: '0ms',
		toastInDuration: '0ms',
		toastOutDuration: '0ms',
		panelY: 0,
		panelScaleStart: 1
	}
};
