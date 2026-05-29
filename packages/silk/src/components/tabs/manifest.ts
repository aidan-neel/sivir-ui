import type { Manifest } from '@silk/ui/_manifest/types';

export const manifest: Manifest = {
	name: 'tabs',
	version: '1.0.0',
	visibility: 'public',
	description: 'Tabbed interface with List, Trigger, and Content subparts. Bindable active value.',
	role: 'tablist',
	files: [
		'components/tabs/tabs.svelte',
		'components/tabs/tabs-list.svelte',
		'components/tabs/tabs-trigger.svelte',
		'components/tabs/tabs-content.svelte',
		'components/tabs/index.ts',
		'components/tabs/manifest.ts'
	],
	components: [],
	shared: ['utils.cn'],
	peerDependencies: {
		clsx: '^2.0.0',
		'tailwind-merge': '^3.0.0',
		svelte: '^5.0.0'
	}
};
