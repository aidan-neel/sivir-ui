import type { ThemeTransitionPreset } from './types';

export const preset: ThemeTransitionPreset = {
	slug: 'bounce',
	name: 'Bounce',
	description: 'Springy entrances with a touch of overshoot — playful but still quick.',
	motion: {
		hoverDuration: '220ms',
		menuDuration: '180ms',
		panelDuration: '320ms',
		sheetDuration: '380ms',
		overlayDuration: '160ms',
		tooltipDuration: '160ms',
		toastInDuration: '480ms',
		toastOutDuration: '320ms',
		panelX: 0,
		panelY: 14,
		panelBlur: 0,
		panelScaleStart: 0.94,
		sheetOffset: 140,
		overlayBlur: 0
	}
};
