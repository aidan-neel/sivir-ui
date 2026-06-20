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
		tooltipDuration: '110ms',
		toastInDuration: '360ms',
		toastOutDuration: '280ms',
		panelX: 0,
		panelY: 5,
		panelBlur: 0,
		panelScaleStart: 0.99,
		sheetOffset: 132,
		overlayBlur: 0
	}
};
