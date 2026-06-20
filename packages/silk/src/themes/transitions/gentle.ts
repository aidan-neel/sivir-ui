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
		tooltipDuration: '150ms',
		toastInDuration: '470ms',
		toastOutDuration: '360ms',
		panelX: 0,
		panelY: 6,
		panelBlur: 0,
		panelScaleStart: 0.985,
		sheetOffset: 140,
		overlayBlur: 0
	}
};
