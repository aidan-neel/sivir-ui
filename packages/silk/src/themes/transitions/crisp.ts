import type { ThemeTransitionPreset } from './types';

export const preset: ThemeTransitionPreset = {
	slug: 'crisp',
	name: 'Crisp',
	description: 'Just a touch quicker than balanced -- clean, professional feedback.',
	motion: {
		hoverDuration: '210ms',
		menuDuration: '130ms',
		panelDuration: '220ms',
		sheetDuration: '280ms',
		overlayDuration: '130ms',
		tooltipDuration: '120ms',
		toastInDuration: '400ms',
		toastOutDuration: '300ms',
		panelX: 0,
		panelY: 4,
		panelBlur: 0,
		panelScaleStart: 0.995,
		sheetOffset: 128,
		overlayBlur: 0
	}
};
