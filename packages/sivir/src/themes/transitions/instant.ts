import type { ThemeTransitionPreset } from './types';

export const preset: ThemeTransitionPreset = {
	slug: 'instant',
	name: 'Instant',
	description: 'Very tight feedback for utility-first interfaces and fast workflows.',
	motion: {
		hoverDuration: '120ms',
		menuDuration: '90ms',
		panelDuration: '170ms',
		sheetDuration: '210ms',
		overlayDuration: '100ms',
		toastInDuration: '280ms',
		toastOutDuration: '220ms',
		panelY: 5,
		panelScaleStart: 0.99
	}
};
