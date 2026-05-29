import type { Manifest } from '@silk/ui/_manifest/types';

export const manifest: Manifest = {
	name: 'textarea',
	version: '1.0.0',
	visibility: 'public',
	description: 'Multi-line text input wrapping native <textarea>. Shares variants with input.',
	files: [
		'components/textarea/textarea.svelte',
		'components/textarea/index.ts',
		'components/textarea/manifest.ts'
	],
	components: ['input'],
	shared: ['utils.cn'],
	peerDependencies: {
		clsx: '^2.0.0',
		'tailwind-merge': '^3.0.0',
		svelte: '^5.0.0'
	}
};
