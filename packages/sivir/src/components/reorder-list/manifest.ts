import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

export const manifest: Manifest = {
    name: 'reorder-list',
    version: '1.0.0',
    visibility: 'public',
    description:
        'List of rows reordered by dragging or with Space and the arrow keys, with position changes announced to screen readers.',
    files: [
        'components/reorder-list/reorder-list.svelte',
        'components/reorder-list/index.ts',
        'components/reorder-list/manifest.ts'
    ],
    components: [],
    shared: ['utils.cn'],
    peerDependencies: {
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};
