import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

/**
 * Version history:
 *   2.0.0:
 *           - Default `open` to `false` so reasoning stays collapsed until a user
 *             inspects it.
 *           - Keep content mounted after its first open and animate it with a
 *             grid-rows transition instead of unmounting and re-measuring height.
 *           - Crossfade the trigger from Thinking to Thought for, show `duration`
 *             while streaming, and drop the `Draft` title default.
 */
export const manifest: Manifest = {
    name: 'reasoning',
    version: '2.0.0',
    visibility: 'public',
    description:
        'Expandable model reasoning status and trace for AI responses. Collapsed by default; content stays mounted after its first open so streamed traces grow in place. Its trigger uses the Button quiet variant for a low-emphasis, no-hover-fill control.',
    files: [
        'components/reasoning/reasoning.svelte',
        'components/reasoning/reasoning-trigger.svelte',
        'components/reasoning/reasoning-content.svelte',
        'components/reasoning/context.svelte.ts',
        'components/reasoning/index.ts',
        'components/reasoning/manifest.ts'
    ],
    components: ['button'],
    shared: ['utils.cn', 'utils.createContext'],
    peerDependencies: {
        '@lucide/svelte': '^1.0.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0',
        'tailwind-merge': '^3.0.0'
    }
};
