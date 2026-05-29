import type { Manifest } from '@silk/ui/_manifest/types';

export const manifest: Manifest = {
	name: 'toggle-group',
	version: '1.0.0',
	visibility: 'public',
	description: 'Single or multiple-select toggle group with bindable value (string or string[]).',
	files: [
		'components/toggle-group/toggle-group.svelte',
		'components/toggle-group/toggle-group-item.svelte',
		'components/toggle-group/index.ts',
		'components/toggle-group/manifest.ts'
	],
	components: [],
	shared: ['utils.cn'],
	peerDependencies: {
		clsx: '^2.0.0',
		'tailwind-merge': '^3.0.0',
		svelte: '^5.0.0'
	}
};
