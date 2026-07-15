import type { Manifest } from '@sivir/ui/_manifest/types';

export const manifest: Manifest = {
	name: 'marquee',
	version: '1.0.0',
	visibility: 'public',
	description:
		'CSS-animated scrolling content. Horizontal or vertical, with pause-on-hover and reverse options.',
	files: [
		'components/marquee/marquee.svelte',
		'components/marquee/index.ts',
		'components/marquee/manifest.ts'
	],
	components: [],
	shared: ['utils.cn'],
	peerDependencies: {
		cnfast: '^0.0.8',
		svelte: '^5.0.0'
	}
};
