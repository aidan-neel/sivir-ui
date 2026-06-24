import type { Manifest } from '@silk/ui/_manifest/types';

export const manifest: Manifest = {
	name: 'badge',
	version: '1.0.0',
	visibility: 'public',
	description:
		'Inline status pill. 9 variants (5 intents + 4 statuses). Optionally renders as anchor when href is provided.',
	files: [
		'components/badge/badge.svelte',
		'components/badge/variants.ts',
		'components/badge/index.ts',
		'components/badge/manifest.ts'
	],
	components: [],
	shared: ['utils.cn'],
	peerDependencies: {
		clsx: '^2.0.0',
		'tailwind-merge': '^3.0.0',
		'tailwind-variants': '^3.0.0',
		svelte: '^5.0.0'
	}
};
