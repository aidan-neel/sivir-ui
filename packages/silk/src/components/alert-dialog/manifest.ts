import type { Manifest } from '@silk/ui/_manifest/types';

export const manifest: Manifest = {
	name: 'alert-dialog',
	version: '1.0.0',
	visibility: 'public',
	description:
		'Confirmation dialog with role="alertdialog", default allowClickOutside=false, and Exit/Confirm buttons (no Close).',
	role: 'alertdialog',
	files: [
		'components/alert-dialog/alert-dialog.svelte',
		'components/alert-dialog/alert-dialog-trigger.svelte',
		'components/alert-dialog/alert-dialog-content.svelte',
		'components/alert-dialog/alert-dialog-header.svelte',
		'components/alert-dialog/alert-dialog-title.svelte',
		'components/alert-dialog/alert-dialog-description.svelte',
		'components/alert-dialog/alert-dialog-footer.svelte',
		'components/alert-dialog/alert-dialog-exit.svelte',
		'components/alert-dialog/alert-dialog-confirm.svelte',
		'components/alert-dialog/index.ts',
		'components/alert-dialog/manifest.ts'
	],
	components: ['modal', 'button'],
	shared: ['utils.cn', 'internals/state'],
	peerDependencies: {
		clsx: '^2.0.0',
		'tailwind-merge': '^3.0.0',
		svelte: '^5.0.0'
	}
};
