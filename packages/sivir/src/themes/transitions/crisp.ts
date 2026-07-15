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
		toastInDuration: '400ms',
		toastOutDuration: '300ms',
		panelY: 4,
		panelScaleStart: 0.995
	}
};
