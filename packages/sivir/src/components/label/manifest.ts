import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

export const manifest: Manifest = {
    name: 'label',
    version: '1.0.0',
    visibility: 'public',
    description:
        'Native <label> with label type styles. Dims when it follows a disabled control that has the peer class.',
    files: [
        'components/label/label.svelte',
        'components/label/index.ts',
        'components/label/manifest.ts'
    ],
    components: [],
    shared: ['utils.cn'],
    peerDependencies: {
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};
