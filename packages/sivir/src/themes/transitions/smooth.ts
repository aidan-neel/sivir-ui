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
		toastInDuration: '500ms',
		toastOutDuration: '380ms',
		panelY: 5,
		panelScaleStart: 0.99
	}
};
