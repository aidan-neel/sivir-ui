import type { ThemeTransitionPreset } from './types';

export const preset: ThemeTransitionPreset = {
	slug: 'bounce',
	name: 'Bounce',
	description: 'Springy entrances with a touch of overshoot -- playful but still quick.',
	motion: {
		hoverDuration: '220ms',
		menuDuration: '180ms',
		panelDuration: '320ms',
		sheetDuration: '380ms',
		overlayDuration: '160ms',
		toastInDuration: '480ms',
		toastOutDuration: '320ms',
		panelY: 14,
		panelScaleStart: 0.94
	}
};
