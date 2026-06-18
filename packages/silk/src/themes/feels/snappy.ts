import type { Feel } from './types';

/** Quick and responsive with just enough follow-through to read as motion. */
export const feel: Feel = {
	slug: 'snappy',
	name: 'Snappy',
	description: 'Quick and responsive, with a light spring on the way out.',
	durations: {
		hover: '150ms',
		menu: '130ms',
		panel: '160ms',
		sheet: '200ms',
		overlay: '120ms',
		tooltip: '110ms',
		toastIn: '260ms',
		toastOut: '200ms'
	},
	easing: 'cubic-bezier(0.2, 0.9, 0.3, 1)',
	easingHover: 'cubic-bezier(0.2, 0.9, 0.3, 1)'
};
