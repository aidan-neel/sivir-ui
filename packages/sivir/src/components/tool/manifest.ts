import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

/**
 * Version history:
 *   3.0.0:
 *           - Match Reasoning. Root takes `running` instead of `state`, measures
 *             elapsed time, opens when `running` turns on, and accepts a
 *             restored `duration` in seconds.
 *           - Trigger takes `status`, `summary`, and an optional `icon` snippet
 *             in place of `title` and the string `duration`. The label
 *             shimmers and crossfades like Reasoning's.
 *           - Calls sit on a rail with an optional `icon` snippet, shimmer
 *             their action while running, and blur in as they arrive. Calls
 *             drop the string `duration`.
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
    version: '3.0.0',
    visibility: 'public',
    description:
        'Collapsible AI tool-call groups for chat transcripts, styled to match Reasoning. While running, the trigger shows a shimmering live status and elapsed timer, then settles into a summary. The trigger takes an optional icon. Content lays out Call rows on a rail, each with an optional icon, and a Call can expand to show Input, Output, or any other detail. Opens when running starts; content stays mounted after its first open.',
    files: [
        'components/tool/tool.svelte',
        'components/tool/tool-trigger.svelte',
        'components/tool/tool-content.svelte',
        'components/tool/tool-call.svelte',
        'components/tool/tool-panel.svelte',
        'components/tool/tool-label.svelte',
        'components/tool/tool-input.svelte',
        'components/tool/tool-output.svelte',
        'components/tool/context.svelte.ts',
        'components/tool/index.ts',
        'components/tool/manifest.ts'
    ],
    components: ['button'],
    shared: ['utils.cn', 'utils.createContext', 'transition'],
    peerDependencies: {
        '@lucide/svelte': '^1.0.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0',
        'tailwind-merge': '^3.0.0'
    }
};
