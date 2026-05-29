import type { Manifest } from '@silk/ui/_manifest/types';

export const manifest: Manifest = {
	name: 'progress',
	version: '1.0.0',
	visibility: 'public',
	description: 'Determinate and indeterminate progress bar.',
	role: 'progressbar',
	files: [
		'components/progress/progress.svelte',
		'components/progress/index.ts',
		'components/progress/manifest.ts'
	],
	components: [],
	shared: ['utils.cn'],
	peerDependencies: {
		clsx: '^2.0.0',
		'tailwind-merge': '^3.0.0',
		svelte: '^5.0.0'
	}
};
