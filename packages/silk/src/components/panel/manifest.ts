import type { Manifest } from '@silk/ui/_manifest/types';

export const manifest: Manifest = {
	name: 'panel',
	version: '1.0.0',
	visibility: 'public',
	description: 'Surface container framed by a concentric double-line border.',
	files: [
		'components/panel/panel.svelte',
		'components/panel/index.ts',
		'components/panel/manifest.ts'
	],
	components: [],
	shared: ['utils.cn'],
	peerDependencies: {
		clsx: '^2.0.0',
		'tailwind-merge': '^3.0.0',
		svelte: '^5.0.0'
	}
};
