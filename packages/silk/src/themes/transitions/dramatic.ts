import type { ThemeTransitionPreset } from './types';

export const preset: ThemeTransitionPreset = {
	slug: 'dramatic',
	name: 'Dramatic',
	description: 'Longer movements with more lift -- emphatic, editorial pacing.',
	motion: {
		hoverDuration: '320ms',
		menuDuration: '200ms',
		panelDuration: '360ms',
		sheetDuration: '460ms',
		overlayDuration: '200ms',
		tooltipDuration: '180ms',
		toastInDuration: '560ms',
		toastOutDuration: '440ms',
		panelX: 0,
		panelY: 12,
		panelBlur: 2,
		panelScaleStart: 0.97,
		sheetOffset: 160,
		overlayBlur: 2
	}
};
