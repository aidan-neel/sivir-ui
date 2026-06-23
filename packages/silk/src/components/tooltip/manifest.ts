import type { Manifest } from '@silk/ui/_manifest/types';

/**
 * Tooltip -- thin popover wrapper for hover-revealed inline guidance.
 * Hardcodes `hoverable: true`, defaults to a 600ms open / 100ms close
 * delay, applies `role="tooltip"` to the content, and ships a minimal
 * Tooltip.Content styled with tooltip-specific tokens.
 *
 * Version history:
 *   1.0.0 -- initial standalone implementation.
 *   2.0.0 (F-29 collapse): rewritten as a popover wrapper. The public
 *         Root/Trigger/Content API and the `delay`/`closeDelay`/
 *         `placement` props on Root are preserved. The trigger is a
 *         `<span>` (was `<span>` before; the DOM shape is unchanged).
 *         The Content's `role="tooltip"` commitment is preserved.
 *
 *         Breaking change: the deprecated TooltipContext context shape
 *         and id-generation are gone -- consumers that imported types
 *         from the old API will see compile errors.
 */
export const manifest: Manifest = {
	name: 'tooltip',
	version: '2.0.0',
	visibility: 'public',
	description:
		'Hover-revealed inline guidance. Thin popover wrapper with role="tooltip", small default delays, and inline-styled Content.',
	role: 'tooltip',
	files: [
		'components/tooltip/tooltip.svelte',
		'components/tooltip/tooltip-content.svelte',
		'components/tooltip/tooltip-trigger.svelte',
		'components/tooltip/shared-tooltip.ts',
		'components/tooltip/index.ts',
		'components/tooltip/manifest.ts'
	],
	components: [],
	shared: ['utils.cn'],
	peerDependencies: {
		'@floating-ui/dom': '^1.0.0',
		'slot-text': '^0.3.0',
		clsx: '^2.0.0',
		'tailwind-merge': '^3.0.0',
		svelte: '^5.0.0'
	}
};
