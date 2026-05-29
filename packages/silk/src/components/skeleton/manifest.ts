import type { Manifest } from '@silk/ui/_manifest/types';

export const manifest: Manifest = {
	name: 'skeleton',
	version: '1.0.0',
	visibility: 'public',
	description: 'Animated loading placeholder.',
	files: [
		'components/skeleton/skeleton.svelte',
		'components/skeleton/index.ts',
		'components/skeleton/manifest.ts'
	],
	components: [],
	shared: ['utils.cn'],
	peerDependencies: {
		clsx: '^2.0.0',
		'tailwind-merge': '^3.0.0',
		svelte: '^5.0.0'
	}
};
