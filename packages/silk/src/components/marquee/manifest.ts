import type { Manifest } from '@silk/ui/_manifest/types';

export const manifest: Manifest = {
	name: 'marquee',
	version: '1.0.0',
	visibility: 'public',
	description: 'CSS-animated scrolling content. Horizontal or vertical, with pause-on-hover and reverse options.',
	files: [
		'components/marquee/marquee.svelte',
		'components/marquee/index.ts',
		'components/marquee/manifest.ts'
	],
	components: [],
	shared: ['utils.cn'],
	peerDependencies: {
		clsx: '^2.0.0',
		'tailwind-merge': '^3.0.0',
		svelte: '^5.0.0'
	}
};
