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
		tooltipDuration: '0ms',
		toastInDuration: '0ms',
		toastOutDuration: '0ms',
		panelX: 0,
		panelY: 0,
		panelBlur: 0,
		panelScaleStart: 1,
		sheetOffset: 0,
		overlayBlur: 0
	}
};
