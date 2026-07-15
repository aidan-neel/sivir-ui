import type { Manifest } from '@sivir/ui/_manifest/types';

export const manifest: Manifest = {
	name: 'panel',
	version: '1.0.0',
	visibility: 'internal',
	description: 'Surface container framed by a concentric double-line border.',
	files: [
		'components/panel/panel.svelte',
		'components/panel/index.ts',
		'components/panel/manifest.ts'
	],
	components: [],
	shared: ['utils.cn'],
	peerDependencies: {
		cnfast: '^0.0.8',
		svelte: '^5.0.0'
	}
};
