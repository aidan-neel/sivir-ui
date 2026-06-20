import type { StylePreset } from './types';

/** Zero elevation, bordered surfaces -- a calm, document-like feel. */
export const style: StylePreset = {
	slug: 'flat',
	name: 'Flat',
	description: 'No shadows; surfaces read flat and bordered.',
	components: ['button', 'card', 'modal', 'dropdown-menu', 'tooltip'],
	tokens: {
		'--radius-sm': '4px',
		'--radius-md': '6px',
		'--radius-lg': '8px',
		'--radius-xl': '12px',
		'--card-shadow': 'none',
		'--panel-shadow': 'none',
		'--tooltip-shadow': 'none',
		'--toast-shadow': 'none',
		'--button-primary-shadow': 'none',
		'--button-success-shadow': 'none',
		'--button-warning-shadow': 'none',
		'--button-error-shadow': 'none',
		'--button-destructive-shadow': 'none'
	}
};
