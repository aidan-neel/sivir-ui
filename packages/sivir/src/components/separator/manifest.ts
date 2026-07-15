import type { Manifest } from '@sivir/ui/_manifest/types';

export const manifest: Manifest = {
	name: 'separator',
	version: '1.0.0',
	visibility: 'public',
	description: 'Horizontal or vertical divider with role="separator".',
	role: 'separator',
	files: [
		'components/separator/separator.svelte',
		'components/separator/index.ts',
		'components/separator/manifest.ts'
	],
	components: [],
	shared: ['utils.cn'],
	peerDependencies: {
		cnfast: '^0.0.8',
		svelte: '^5.0.0'
	}
};
