import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

export const manifest: Manifest = {
    name: 'badge',
    version: '1.0.0',
    visibility: 'public',
    description:
        'Status label with nine variants, an optional dot or leading icon, and an anchor form when href is set.',
    files: [
        'components/badge/badge.svelte',
        'components/badge/variants.ts',
        'components/badge/index.ts',
        'components/badge/manifest.ts'
    ],
    components: [],
    shared: ['utils.cn'],
    peerDependencies: {
        cnfast: '^0.0.8',
        'tailwind-merge': '^3.0.0',
        'tailwind-variants': '^3.0.0',
        svelte: '^5.0.0'
    }
};
