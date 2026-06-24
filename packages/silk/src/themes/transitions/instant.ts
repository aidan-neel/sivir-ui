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
		tooltipDuration: '90ms',
		toastInDuration: '280ms',
		toastOutDuration: '220ms',
		panelX: 0,
		panelY: 5,
		panelBlur: 0,
		panelScaleStart: 0.99,
		sheetOffset: 132,
		overlayBlur: 0
	}
};
