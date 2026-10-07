import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

/**
 * Version history:
 *   3.0.0:
 *           - Drop the dot grid. Trigger takes an optional `icon` snippet,
 *             and `Orb` is a filling orb to pass to it.
 *           - Trigger takes `status` for the live activity label and `summary`
 *             for the settled label, replacing `title`. The default settled
 *             label reads Worked for and the elapsed time.
 *           - Root measures elapsed seconds while streaming; `duration` is now
 *             a number of seconds that overrides the measurement.
 *           - Root opens when streaming starts and stays open after it ends.
 *           - Add Steps and Step for a railed trace of titled, optionally
 *             collapsible steps. Content drops its left rail.
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
    version: '3.0.0',
    visibility: 'public',
    description:
        'Expandable model reasoning status and trace for AI responses. Opens while streaming with a live activity label and elapsed timer, then settles into a Worked for summary. The trigger takes an optional icon, such as the filling Orb. Steps lay out a railed trace of titled, optionally collapsible steps. Its trigger uses the Button quiet variant for a low-emphasis, no-hover-fill control.',
    files: [
        'components/reasoning/reasoning.svelte',
        'components/reasoning/reasoning-trigger.svelte',
        'components/reasoning/reasoning-content.svelte',
        'components/reasoning/reasoning-steps.svelte',
        'components/reasoning/reasoning-step.svelte',
        'components/reasoning/reasoning-label.svelte',
        'components/reasoning/reasoning-orb.svelte',
        'components/reasoning/context.svelte.ts',
        'components/reasoning/index.ts',
        'components/reasoning/manifest.ts'
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
