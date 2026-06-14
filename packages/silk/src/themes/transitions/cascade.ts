import type { ThemeTransitionPreset } from './types';

export const preset: ThemeTransitionPreset = {
	slug: 'cascade',
	name: 'Cascade',
	description: 'Panels rise and unblur into place with the landing-page cascade easing.',
	motion: {
		hoverDuration: '240ms',
		menuDuration: '220ms',
		panelDuration: '360ms',
		sheetDuration: '460ms',
		overlayDuration: '200ms',
		tooltipDuration: '180ms',
		toastInDuration: '560ms',
		toastOutDuration: '420ms',
		panelX: 0,
		panelY: 16,
		panelBlur: 4,
		panelScaleStart: 0.96,
		sheetOffset: 150,
		overlayBlur: 2,
		panelEasing: 'cubic-bezier(0.16, 1, 0.3, 1)'
	}
};
