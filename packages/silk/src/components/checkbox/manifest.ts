import type { Manifest } from '@silk/ui/_manifest/types';

export const manifest: Manifest = {
	name: 'checkbox',
	version: '1.0.0',
	visibility: 'public',
	description: 'Custom-styled checkbox with bindable checked. Default and primary variants.',
	files: [
		'components/checkbox/checkbox.svelte',
		'components/checkbox/index.ts',
		'components/checkbox/manifest.ts'
	],
	components: [],
	shared: ['utils.cn', 'internals/transition'],
	peerDependencies: {
		'@lucide/svelte': '^1.0.0',
		clsx: '^2.0.0',
		'tailwind-merge': '^3.0.0',
		svelte: '^5.0.0'
	}
};
