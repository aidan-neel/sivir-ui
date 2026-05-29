import type { Manifest } from '@silk/ui/_manifest/types';

export const manifest: Manifest = {
	name: 'radio-group',
	version: '1.0.0',
	visibility: 'public',
	description: 'Single-select radio group with bindable value and per-item label/description.',
	role: 'radiogroup',
	files: [
		'components/radio-group/radio-group.svelte',
		'components/radio-group/radio-group-item.svelte',
		'components/radio-group/index.ts',
		'components/radio-group/manifest.ts'
	],
	components: [],
	shared: ['utils.cn'],
	peerDependencies: {
		clsx: '^2.0.0',
		'tailwind-merge': '^3.0.0',
		svelte: '^5.0.0'
	}
};
