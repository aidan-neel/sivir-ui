import type { ThemeTransitionPreset } from './types';

export const preset: ThemeTransitionPreset = {
	slug: 'default',
	name: 'Balanced',
	description: 'Matches the current Sivir feel with polished but unhurried motion.',
	motion: {
		hoverDuration: '0ms',
		menuDuration: '150ms',
		panelDuration: '240ms',
		sheetDuration: '320ms',
		overlayDuration: '150ms',
		toastInDuration: '440ms',
		toastOutDuration: '340ms',
		panelY: 5,
		panelScaleStart: 0.99
	}
};
