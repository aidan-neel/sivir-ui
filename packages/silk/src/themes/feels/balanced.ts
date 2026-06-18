import type { Feel } from './types';

/** Even, neutral pacing -- the safe middle ground. */
export const feel: Feel = {
	slug: 'balanced',
	name: 'Balanced',
	description: 'Even, neutral pacing that suits most interfaces.',
	durations: {
		hover: '200ms',
		menu: '170ms',
		panel: '220ms',
		sheet: '300ms',
		overlay: '160ms',
		tooltip: '150ms',
		toastIn: '380ms',
		toastOut: '300ms'
	},
	easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
	easingHover: 'cubic-bezier(0.4, 0, 0.2, 1)'
};
