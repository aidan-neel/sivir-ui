import type { Manifest } from '@silk/ui/_manifest/types';

/**
 * Input.
 *
 * 1.0.0 -- initial.
 * 2.0.0: removed `bind:value` from the type="checkbox" branch (Svelte 5
 *        throws when both bind:value and bind:checked are present).
 *        Consumers using type="checkbox" must read state via
 *        bind:checked only.
 * 3.0.0: removed the `primary` variant (it duplicated the base field look).
 *        Default variant is now `outlined`.
 */
export const manifest: Manifest = {
	name: 'input',
	version: '3.0.0',
	visibility: 'public',
	description:
		'Text input wrapping a native <input>. 2 variants. Forwards file/checkbox/text/number/etc. types.',
	files: [
		'components/input/input.svelte',
		'components/input/variants.ts',
		'components/input/index.ts',
		'components/input/manifest.ts'
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
