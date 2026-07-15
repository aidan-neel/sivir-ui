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
		toastInDuration: '520ms',
		toastOutDuration: '360ms',
		panelY: 10,
		panelScaleStart: 0.96
	}
};
