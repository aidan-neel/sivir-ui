import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

/**
 * Version history:
 *   2.0.0:
 *           - Split into Root, Track, Indicator, and Value parts. Root renders all
 *             three by default.
 *           - Draw an open 270° arc instead of a closed ring.
 *           - Replace pixel `size` and `strokeWidth` with `sm`, `md`, and `lg` sizes.
 *           - Sweep the arc and count the value together on change, timed by
 *             `--motion-duration-gauge`.
 */
export const manifest: Manifest = {
    name: 'gauge',
    version: '2.0.0',
    visibility: 'public',
    description:
        'Open-arc meter for a value out of a maximum, with Track, Indicator, and Value parts, three sizes, and five tones. The arc and value animate together when the value changes.',
    role: 'meter',
    files: [
        'components/gauge/gauge.svelte',
        'components/gauge/gauge-track.svelte',
        'components/gauge/gauge-indicator.svelte',
        'components/gauge/gauge-value.svelte',
        'components/gauge/context.svelte.ts',
        'components/gauge/index.ts',
        'components/gauge/manifest.ts'
    ],
    components: [],
    shared: ['utils.cn', 'utils.createContext'],
    peerDependencies: {
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};
