import type { Manifest } from '@silk/ui/_manifest/types';

export const manifest: Manifest = {
	name: 'scroll-area',
	version: '1.0.0',
	visibility: 'public',
	description: 'Themed scroll container with vertical or horizontal overflow.',
	files: [
		'components/scroll-area/scroll-area.svelte',
		'components/scroll-area/index.ts',
		'components/scroll-area/manifest.ts'
	],
	components: [],
	shared: ['utils.cn'],
	peerDependencies: {
		clsx: '^2.0.0',
		'tailwind-merge': '^3.0.0',
		svelte: '^5.0.0'
	}
};
