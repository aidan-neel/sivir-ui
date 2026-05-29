import type { Manifest } from '@silk/ui/_manifest/types';

export const manifest: Manifest = {
	name: 'collapsible',
	version: '1.0.0',
	visibility: 'public',
	description: 'Single-item disclosure panel with bindable open state.',
	files: [
		'components/collapsible/collapsible.svelte',
		'components/collapsible/collapsible-trigger.svelte',
		'components/collapsible/collapsible-content.svelte',
		'components/collapsible/index.ts',
		'components/collapsible/manifest.ts'
	],
	components: [],
	shared: ['utils.cn', 'internals/state', 'internals/transition'],
	peerDependencies: {
		clsx: '^2.0.0',
		'tailwind-merge': '^3.0.0',
		svelte: '^5.0.0'
	}
};
