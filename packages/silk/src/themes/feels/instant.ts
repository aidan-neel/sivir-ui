import type { Feel } from './types';

/** Near-immediate. Motion is over almost before you notice it. */
export const feel: Feel = {
	slug: 'instant',
	name: 'Instant',
	description: 'Snappy to the point of immediate -- the fastest timings.',
	durations: {
		hover: '100ms',
		menu: '90ms',
		panel: '110ms',
		sheet: '140ms',
		overlay: '90ms',
		tooltip: '80ms',
		toastIn: '160ms',
		toastOut: '120ms'
	},
	easing: 'cubic-bezier(0.3, 0, 0.2, 1)',
	easingHover: 'cubic-bezier(0.3, 0, 0.2, 1)'
};
