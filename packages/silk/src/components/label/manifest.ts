import type { Manifest } from '@silk/ui/_manifest/types';

export const manifest: Manifest = {
	name: 'label',
	version: '1.0.0',
	visibility: 'public',
	description: 'Thin wrapper around native <label> with silk styling defaults.',
	files: [
		'components/label/label.svelte',
		'components/label/index.ts',
		'components/label/manifest.ts'
	],
	components: [],
	shared: ['utils.cn'],
	peerDependencies: {
		clsx: '^2.0.0',
		'tailwind-merge': '^3.0.0',
		svelte: '^5.0.0'
	}
};
