import type { Manifest } from '@silk/ui/_manifest/types';

export const manifest: Manifest = {
	name: 'breadcrumb',
	version: '1.0.0',
	visibility: 'public',
	description: 'Navigational breadcrumb trail with items and separators.',
	files: [
		'components/breadcrumb/breadcrumb.svelte',
		'components/breadcrumb/breadcrumb-item.svelte',
		'components/breadcrumb/breadcrumb-separator.svelte',
		'components/breadcrumb/index.ts',
		'components/breadcrumb/manifest.ts'
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
