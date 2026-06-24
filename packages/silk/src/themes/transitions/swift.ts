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
		tooltipDuration: '100ms',
		toastInDuration: '320ms',
		toastOutDuration: '240ms',
		panelX: 0,
		panelY: 4,
		panelBlur: 0,
		panelScaleStart: 0.995,
		sheetOffset: 120,
		overlayBlur: 0
	}
};
