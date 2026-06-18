import type { Feel } from './types';

/** Slow and cinematic, with a long, settling follow-through. */
export const feel: Feel = {
	slug: 'relaxed',
	name: 'Relaxed',
	description: 'Slow and cinematic, with a long settling follow-through.',
	durations: {
		hover: '320ms',
		menu: '280ms',
		panel: '380ms',
		sheet: '480ms',
		overlay: '240ms',
		tooltip: '200ms',
		toastIn: '600ms',
		toastOut: '440ms'
	},
	easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
	easingHover: 'cubic-bezier(0.16, 1, 0.3, 1)'
};
