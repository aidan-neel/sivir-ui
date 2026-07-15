import type { ThemeTransitionPreset } from './types';

export const preset: ThemeTransitionPreset = {
	slug: 'snappy',
	name: 'Snappy',
	description: 'A little quicker across hovers, menus, and modal surfaces.',
	motion: {
		hoverDuration: '190ms',
		menuDuration: '120ms',
		panelDuration: '210ms',
		sheetDuration: '260ms',
		overlayDuration: '120ms',
		toastInDuration: '360ms',
		toastOutDuration: '280ms',
		panelY: 5,
		panelScaleStart: 0.99
	}
};
