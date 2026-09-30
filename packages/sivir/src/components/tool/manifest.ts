import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

/**
 * Version history:
 *   2.0.0:
 *           - Compose from Root, Trigger, Content, and Call instead of Root props
 *             and Item. Root drops `name`, `duration`, `variant`, and `trigger`.
 *           - Default `open` to `false`, keep content mounted after its first open,
 *             and animate it with a grid-rows transition behind a left rail.
 *           - Replace Item with Call rows that align actions and targets in shared
 *             columns and can expand to show Input and Output.
 */
export const manifest: Manifest = {
    name: 'tool',
    version: '2.0.0',
    visibility: 'public',
    description:
        'Collapsible AI tool-call groups for chat transcripts. A quiet trigger shows a status glyph, summary, and duration; content lists aligned Call rows that can expand to show Input and Output. Collapsed by default; content stays mounted after its first open.',
    files: [
        'components/tool/tool.svelte',
        'components/tool/tool-trigger.svelte',
        'components/tool/tool-content.svelte',
        'components/tool/tool-call.svelte',
        'components/tool/tool-panel.svelte',
        'components/tool/tool-input.svelte',
        'components/tool/tool-output.svelte',
        'components/tool/context.svelte.ts',
        'components/tool/index.ts',
        'components/tool/manifest.ts'
    ],
    components: ['button', 'spinner'],
    shared: ['utils.cn', 'utils.createContext'],
    peerDependencies: {
        '@lucide/svelte': '^1.0.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0',
        'tailwind-merge': '^3.0.0'
    }
};
