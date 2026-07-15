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
		toastInDuration: '520ms',
		toastOutDuration: '400ms',
		panelY: 8,
		panelScaleStart: 0.98
	}
};
