import type { Feel } from './types';

/** Soft, gliding ease-out -- the library default feel. */
export const feel: Feel = {
	slug: 'smooth',
	name: 'Smooth',
	description: 'Soft, gliding ease-out. The default feel.',
	durations: {
		hover: '240ms',
		menu: '200ms',
		panel: '260ms',
		sheet: '340ms',
		overlay: '180ms',
		tooltip: '160ms',
		toastIn: '440ms',
		toastOut: '340ms'
	},
	easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
	easingHover: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
};
