import type { Manifest } from '@silk/ui/_manifest/types';

export const manifest: Manifest = {
	name: 'shortcut',
	version: '1.0.0',
	visibility: 'public',
	description:
		'Keyboard shortcut indicator. When nested in a Button, wires a global keydown listener to the parent button onclick.',
	files: [
		'components/shortcut/shortcut.svelte',
		'components/shortcut/index.ts',
		'components/shortcut/manifest.ts'
	],
	components: [],
	shared: ['utils.cn', 'internals/state'],
	peerDependencies: {
		clsx: '^2.0.0',
		'tailwind-merge': '^3.0.0',
		svelte: '^5.0.0'
	}
};
