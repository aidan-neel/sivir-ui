import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

/**
 * NavigationMenu -- site header navigation. Root owns the open item and the
 * hover / click intent; each Item's Content registers its panel, and the
 * single Viewport renders the open panel in a frame that morphs between
 * panel sizes and travels under the open trigger.
 *
 * Version history:
 *   1.0.0 -- initial manifest.
 */
export const manifest: Manifest = {
    name: 'navigation-menu',
    version: '1.0.0',
    visibility: 'public',
    description:
        'Header navigation with hover and click triggers, rich link panels, and one shared viewport that morphs between panels.',
    role: 'navigation',
    files: [
        'components/navigation-menu/navigation-menu.svelte',
        'components/navigation-menu/navigation-menu-list.svelte',
        'components/navigation-menu/navigation-menu-item.svelte',
        'components/navigation-menu/navigation-menu-trigger.svelte',
        'components/navigation-menu/navigation-menu-content.svelte',
        'components/navigation-menu/navigation-menu-viewport.svelte',
        'components/navigation-menu/navigation-menu-link.svelte',
        'components/navigation-menu/navigation-menu-link-title.svelte',
        'components/navigation-menu/navigation-menu-link-description.svelte',
        'components/navigation-menu/context.svelte.ts',
        'components/navigation-menu/index.ts',
        'components/navigation-menu/manifest.ts'
    ],
    components: [],
    shared: ['utils.cn', 'utils.createContext', 'utils.travelingHighlight', 'transition'],
    peerDependencies: {
        '@lucide/svelte': '^1.0.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};
