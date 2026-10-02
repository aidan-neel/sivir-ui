import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

export const manifest: Manifest = {
    name: 'gauge',
    version: '1.0.0',
    visibility: 'public',
    description:
        'Circular meter for a value out of a maximum, with five tones and an optional center label.',
    role: 'meter',
    files: [
        'components/gauge/gauge.svelte',
        'components/gauge/index.ts',
        'components/gauge/manifest.ts'
    ],
    components: [],
    shared: ['utils.cn'],
    peerDependencies: {
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};
