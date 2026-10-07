import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

export const manifest: Manifest = {
    name: 'source',
    version: '1.0.0',
    visibility: 'public',
    description:
        'Compact link chip for a page a model searched, read, or cited: a favicon with a letter or globe fallback and a truncated label. External links open in a new tab. Add Content to preview the cited pages in a hover card, with Count showing how many sources sit beyond the first. Inside a paragraph the chip tightens to sit on the text line, and Content renders after mount so it is safe there.',
    files: [
        'components/source/source.svelte',
        'components/source/source-chip.svelte',
        'components/source/source-icon.svelte',
        'components/source/source-label.svelte',
        'components/source/source-count.svelte',
        'components/source/source-content.svelte',
        'components/source/source-item.svelte',
        'components/source/source-title.svelte',
        'components/source/source-description.svelte',
        'components/source/context.svelte.ts',
        'components/source/index.ts',
        'components/source/manifest.ts'
    ],
    components: ['hover-card', 'popover'],
    shared: ['utils.cn', 'utils.createContext'],
    peerDependencies: {
        '@lucide/svelte': '^1.0.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};
