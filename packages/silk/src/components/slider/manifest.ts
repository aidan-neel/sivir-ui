import type { Manifest } from '@silk/ui/_manifest/types';

export const manifest: Manifest = {
	name: 'slider',
	version: '1.0.0',
	visibility: 'public',
	description: 'Range input slider with bindable value, min/max/step, and ARIA value attributes.',
	role: 'slider',
	files: [
		'components/slider/slider.svelte',
		'components/slider/index.ts',
		'components/slider/manifest.ts'
	],
	components: [],
	shared: ['utils.cn'],
	peerDependencies: {
		clsx: '^2.0.0',
		'tailwind-merge': '^3.0.0',
		svelte: '^5.0.0'
	}
};
