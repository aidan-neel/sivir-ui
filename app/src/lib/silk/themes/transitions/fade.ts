import type { ThemeTransitionPreset } from './types';

export const preset: ThemeTransitionPreset = {
	slug: 'fade',
	name: 'Fade',
	description: 'Opacity-driven — minimal movement, maximum quiet.',
	motion: {
		hoverDuration: '180ms',
		menuDuration: '150ms',
		panelDuration: '220ms',
		sheetDuration: '300ms',
		overlayDuration: '180ms',
		tooltipDuration: '130ms',
		toastInDuration: '380ms',
		toastOutDuration: '280ms',
		panelX: 0,
		panelY: 0,
		panelBlur: 0,
		panelScaleStart: 1,
		sheetOffset: 120,
		overlayBlur: 0
	}
};
