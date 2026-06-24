import type { Manifest } from '@silk/ui/_manifest/types';

/**
 * Copy Button.
 *
 * 1.0.0 -- copies text to the clipboard with a Copy↔Check icon morph and a
 *          slot-text tooltip roll on the label.
 */
export const manifest: Manifest = {
	name: 'copy-button',
	version: '1.0.0',
	visibility: 'public',
	description:
		'One-tap clipboard button: a Copy↔Check icon morph plus a slot-text tooltip roll, reverting after a short hold.',
	files: [
		'components/copy-button/copy-button.svelte',
		'components/copy-button/index.ts',
		'components/copy-button/manifest.ts'
	],
	components: ['button', 'tooltip'],
	shared: ['utils.cn', 'internals/state'],
	peerDependencies: {
		'@lucide/svelte': '^1.0.0',
		clsx: '^2.0.0',
		'tailwind-merge': '^3.0.0',
		svelte: '^5.0.0'
	}
};
