import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

export const manifest: Manifest = {
    name: 'attachment',
    version: '1.1.0',
    visibility: 'public',
    description:
        'Local file picker that accepts drops and pastes, validates each file, and lists files with upload status.',
    files: [
        'components/attachment/attachment.svelte',
        'components/attachment/attachment-trigger.svelte',
        'components/attachment/attachment-list.svelte',
        'components/attachment/attachment-item.svelte',
        'components/attachment/attachment-preview.svelte',
        'components/attachment/attachment-name.svelte',
        'components/attachment/attachment-status.svelte',
        'components/attachment/attachment-remove.svelte',
        'components/attachment/format.ts',
        'components/attachment/context.svelte.ts',
        'components/attachment/index.ts',
        'components/attachment/manifest.ts'
    ],
    components: ['button', 'spinner'],
    shared: ['utils.cn', 'transition'],
    peerDependencies: {
        '@lucide/svelte': '^1.7.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0',
        'tailwind-merge': '^3.0.0'
    }
};
