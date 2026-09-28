import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

/**
 * Version history:
 *   3.0.0:
 *           - Replace the Scritto roller and height easing with a single
 *             frame loop that reveals characters at a steady pace, catches up
 *             with live backlog, and fades in the newest characters.
 *           - Drop the `@scritto/core` and `@scritto/svelte` peers.
 */
export const manifest: Manifest = {
    name: 'response-stream',
    version: '3.0.0',
    visibility: 'public',
    description:
        'Animated AI response text revealed at a steady, backlog-aware pace with the newest characters fading in.',
    role: 'status',
    files: [
        'components/response-stream/response-stream.svelte',
        'components/response-stream/index.ts',
        'components/response-stream/manifest.ts'
    ],
    components: [],
    shared: ['utils.cn'],
    peerDependencies: {
        cnfast: '^0.0.8',
        svelte: '^5.0.0',
        'tailwind-merge': '^3.0.0'
    }
};
