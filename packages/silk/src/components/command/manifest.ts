import type { Manifest } from '@silk/ui/_manifest/types';

export const manifest: Manifest = {
	name: 'command',
	version: '1.0.0',
	visibility: 'public',
	description: 'Command palette popover with search, grouped items, and separators.',
	files: [
		'components/command/command.svelte',
		'components/command/command-trigger.svelte',
		'components/command/command-content.svelte',
		'components/command/command-results.svelte',
		'components/command/command-search.svelte',
		'components/command/command-item.svelte',
		'components/command/command-group.svelte',
		'components/command/command-separator.svelte',
		'components/command/index.ts',
		'components/command/manifest.ts'
	],
	components: ['popover', 'button'],
	shared: ['utils.cn', 'internals/state', 'internals/presence'],
	peerDependencies: {
		'@lucide/svelte': '^1.0.0',
		clsx: '^2.0.0',
		'tailwind-merge': '^3.0.0',
		svelte: '^5.0.0'
	}
};
