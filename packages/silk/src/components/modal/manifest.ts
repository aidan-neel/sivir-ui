import type { Manifest } from '@silk/ui/_manifest/types';

/**
 * Modal -- centered dialog overlay. Composes `_internal/overlay` for the
 * shared focus-trap / click-outside / Escape / body-scroll-lock concerns;
 * owns its own portal, CSS enter/exit animation, and centered positioning.
 *
 * Wrapped by `alert-dialog`.
 *
 * Version history:
 *   1.0.0 -- initial manifest. Modal-content consumes `_internal/overlay`
 *           (resolves F-30). The public component API (Root, Content,
 *           Trigger, Title, Description, Header, Body, Close, Footer,
 *           Confirm) is stable.
 */
export const manifest: Manifest = {
	name: 'modal',
	version: '1.0.0',
	visibility: 'public',
	description:
		'Centered dialog overlay with portal, focus trap, and click-outside. Composes _internal/overlay for shared mechanics; owns its own animation surface.',
	role: 'dialog',
	files: [
		'components/modal/modal.svelte',
		'components/modal/modal-content.svelte',
		'components/modal/modal-trigger.svelte',
		'components/modal/modal-title.svelte',
		'components/modal/modal-description.svelte',
		'components/modal/modal-header.svelte',
		'components/modal/modal-footer.svelte',
		'components/modal/modal-body.svelte',
		'components/modal/modal-close.svelte',
		'components/modal/modal-confirm.svelte',
		'components/modal/index.ts',
		'components/modal/manifest.ts'
	],
	components: ['button', '_internal/overlay'],
	shared: ['utils.cn', 'internals/state', 'internals/transition'],
	peerDependencies: {
		clsx: '^2.0.0',
		'tailwind-merge': '^3.0.0',
		svelte: '^5.0.0'
	}
};
