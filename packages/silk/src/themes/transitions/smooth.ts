import type { ThemeTransitionPreset } from './types';

export const preset: ThemeTransitionPreset = {
	slug: 'smooth',
	name: 'Smooth',
	description: 'Softer, slower transitions for editorial or premium-feeling themes.',
	motion: {
		hoverDuration: '280ms',
		menuDuration: '180ms',
		panelDuration: '300ms',
		sheetDuration: '380ms',
		overlayDuration: '180ms',
		tooltipDuration: '160ms',
		toastInDuration: '500ms',
		toastOutDuration: '380ms',
		panelX: 0,
		panelY: 5,
		panelBlur: 0,
		panelScaleStart: 0.99,
		sheetOffset: 132,
		overlayBlur: 0
	}
};
