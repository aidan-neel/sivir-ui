import type { Manifest } from '@silk/ui/_manifest/types';

export const manifest: Manifest = {
	name: 'pagination',
	version: '1.0.0',
	visibility: 'public',
	description: 'Numbered pagination with prev/next buttons, ellipses, and configurable siblings.',
	files: [
		'components/pagination/pagination.svelte',
		'components/pagination/index.ts',
		'components/pagination/manifest.ts'
	],
	components: [],
	shared: ['utils.cn'],
	peerDependencies: {
		'@lucide/svelte': '^1.0.0',
		clsx: '^2.0.0',
		'tailwind-merge': '^3.0.0',
		svelte: '^5.0.0'
	}
};
