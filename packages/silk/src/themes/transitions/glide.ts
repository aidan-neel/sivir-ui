import type { ThemeTransitionPreset } from './types';

export const preset: ThemeTransitionPreset = {
	slug: 'glide',
	name: 'Glide',
	description: 'Long and graceful panel movement with a subtle backdrop blur.',
	motion: {
		hoverDuration: '260ms',
		menuDuration: '170ms',
		panelDuration: '320ms',
		sheetDuration: '400ms',
		overlayDuration: '200ms',
		tooltipDuration: '160ms',
		toastInDuration: '520ms',
		toastOutDuration: '400ms',
		panelX: 0,
		panelY: 8,
		panelBlur: 3,
		panelScaleStart: 0.98,
		sheetOffset: 150,
		overlayBlur: 3
	}
};
