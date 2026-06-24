import type { ThemeTransitionPreset } from './types';

export const preset: ThemeTransitionPreset = {
	slug: 'spring',
	name: 'Spring',
	description: 'Spring-physics-ish -- generous durations with soft easing.',
	motion: {
		hoverDuration: '260ms',
		menuDuration: '210ms',
		panelDuration: '380ms',
		sheetDuration: '460ms',
		overlayDuration: '200ms',
		tooltipDuration: '180ms',
		toastInDuration: '520ms',
		toastOutDuration: '360ms',
		panelX: 0,
		panelY: 10,
		panelBlur: 1,
		panelScaleStart: 0.96,
		sheetOffset: 148,
		overlayBlur: 0
	}
};
