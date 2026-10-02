import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

/**
 * Version history:
 *   2.1.0:
 *           - Ease the surface height between tabs of different lengths and blur
 *             the outgoing panel as it slides away.
 */
export const manifest: Manifest = {
    name: 'code-block',
    version: '2.1.0',
    visibility: 'public',
    description:
        'Syntax-highlighted code block with language tabs, a copy button, and an actions slot, built on highlight.js. theme="custom" leaves token colors to a highlight.js stylesheet.',
    role: 'tablist',
    files: [
        'components/code-block/code-block.svelte',
        'components/code-block/code-block-header.svelte',
        'components/code-block/code-block-list.svelte',
        'components/code-block/code-block-trigger.svelte',
        'components/code-block/code-block-actions.svelte',
        'components/code-block/code-block-copy.svelte',
        'components/code-block/code-block-content.svelte',
        'components/code-block/highlight.ts',
        'components/code-block/index.ts',
        'components/code-block/manifest.ts'
    ],
    components: ['tabs', 'copy-button', 'card', '_internal/highlight'],
    shared: ['utils.cn', 'transition'],
    peerDependencies: {
        'highlight.js': '^11.0.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};
