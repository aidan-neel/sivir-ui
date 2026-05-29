import type { ThemeTransitionPreset } from './types';

export const preset: ThemeTransitionPreset = {
	slug: 'default',
	name: 'Balanced',
	description: 'Matches the current Silk feel with polished but unhurried motion.',
	motion: {
		hoverDuration: '0ms',
		menuDuration: '150ms',
		panelDuration: '240ms',
		sheetDuration: '320ms',
		overlayDuration: '150ms',
		tooltipDuration: '140ms',
		toastInDuration: '440ms',
		toastOutDuration: '340ms',
		panelX: 0,
		panelY: 5,
		panelBlur: 0,
		panelScaleStart: 0.99,
		sheetOffset: 132,
		overlayBlur: 0
	}
};
