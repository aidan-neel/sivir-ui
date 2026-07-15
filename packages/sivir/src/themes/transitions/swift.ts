import type { ThemeTransitionPreset } from './types';

export const preset: ThemeTransitionPreset = {
	slug: 'swift',
	name: 'Swift',
	description: 'Between snappy and instant -- fast tools without being abrupt.',
	motion: {
		hoverDuration: '150ms',
		menuDuration: '100ms',
		panelDuration: '180ms',
		sheetDuration: '230ms',
		overlayDuration: '110ms',
		toastInDuration: '320ms',
		toastOutDuration: '240ms',
		panelY: 4,
		panelScaleStart: 0.995
	}
};
