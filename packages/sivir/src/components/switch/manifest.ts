import type { Manifest } from '@sivir/ui/_manifest/types';

export const manifest: Manifest = {
	name: 'switch',
	version: '1.0.0',
	visibility: 'public',
	description:
		'Toggle switch with role="switch", bindable switched state, optional label and description.',
	role: 'switch',
	files: [
		'components/switch/switch.svelte',
		'components/switch/index.ts',
		'components/switch/manifest.ts'
	],
	components: [],
	shared: ['utils.cn', 'internals/state'],
	peerDependencies: {
		cnfast: '^0.0.8',
		svelte: '^5.0.0'
	}
};
