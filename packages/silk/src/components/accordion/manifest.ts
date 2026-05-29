import type { Manifest } from '@silk/ui/_manifest/types';

export const manifest: Manifest = {
	name: 'accordion',
	version: '1.0.0',
	visibility: 'public',
	description: 'Vertically stacked disclosure panels. Single or multiple expanded items.',
	files: [
		'components/accordion/accordion.svelte',
		'components/accordion/accordion-item.svelte',
		'components/accordion/accordion-trigger.svelte',
		'components/accordion/accordion-content.svelte',
		'components/accordion/index.ts',
		'components/accordion/manifest.ts'
	],
	components: [],
	shared: ['utils.cn', 'internals/transition'],
	peerDependencies: {
		'@lucide/svelte': '^1.0.0',
		clsx: '^2.0.0',
		'tailwind-merge': '^3.0.0',
		svelte: '^5.0.0'
	}
};
