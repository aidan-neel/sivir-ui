import type { StylePreset } from './types';

/** Rounded, airy, and elevated -- a friendly, approachable feel. */
export const style: StylePreset = {
	slug: 'soft',
	name: 'Soft',
	description: 'Generous radius, roomy padding, and soft elevation.',
	components: ['button', 'card', 'modal', 'dropdown-menu', 'tooltip'],
	tokens: {
		'--radius-sm': '8px',
		'--radius-md': '12px',
		'--radius-lg': '16px',
		'--radius-xl': '22px',
		'--card-padding': '28px',
		'--panel-padding': '16px',
		'--card-shadow': '0 10px 30px -12px rgb(15 15 16 / 0.16), 0 2px 6px rgb(15 15 16 / 0.06)',
		'--panel-shadow':
			'0 24px 48px -16px rgb(15 15 16 / 0.22), 0 8px 18px -10px rgb(15 15 16 / 0.12)',
		'--tooltip-shadow': '0 14px 30px rgb(16 24 40 / 0.22)'
	}
};
