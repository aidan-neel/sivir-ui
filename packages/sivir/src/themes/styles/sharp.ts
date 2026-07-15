import type { StylePreset } from './types';

/** Crisp, technical, near-zero radius. Edges read as precise and dense. */
export const style: StylePreset = {
	slug: 'sharp',
	name: 'Sharp',
	description: 'Crisp corners and tight elevation -- a precise, technical feel.',
	tokens: {
		'--radius-sm': '0px',
		'--radius-md': '1px',
		'--radius-lg': '2px',
		'--radius-xl': '3px',
		'--card-shadow': '0 1px 2px rgb(15 15 16 / 0.08)',
		'--panel-shadow': '0 6px 16px -8px rgb(15 15 16 / 0.18)',
		'--tooltip-shadow': '0 4px 10px rgb(16 24 40 / 0.16)'
	}
};
