import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

/**
 * Sidebar -- app-shell navigation column. Root owns the desktop collapse state
 * (offcanvas or icon rail) and the mobile drawer state; Panel renders an
 * `<aside>` on desktop and an `_internal/overlay` drawer below `md`.
 *
 * Version history:
 *   1.0.0 -- initial manifest.
 */
export const manifest: Manifest = {
    name: 'sidebar',
    version: '1.0.0',
    visibility: 'public',
    description:
        'Collapsible app-shell sidebar with an inset variant, icon rail, collapsible groups, item badges and actions, and a mobile drawer.',
    role: 'navigation',
    files: [
        'components/sidebar/sidebar.svelte',
        'components/sidebar/sidebar-panel.svelte',
        'components/sidebar/sidebar-inset.svelte',
        'components/sidebar/sidebar-trigger.svelte',
        'components/sidebar/sidebar-header.svelte',
        'components/sidebar/sidebar-content.svelte',
        'components/sidebar/sidebar-footer.svelte',
        'components/sidebar/sidebar-group.svelte',
        'components/sidebar/sidebar-group-label.svelte',
        'components/sidebar/sidebar-group-content.svelte',
        'components/sidebar/sidebar-menu.svelte',
        'components/sidebar/sidebar-item.svelte',
        'components/sidebar/sidebar-item-button.svelte',
        'components/sidebar/sidebar-item-label.svelte',
        'components/sidebar/sidebar-item-badge.svelte',
        'components/sidebar/sidebar-item-action.svelte',
        'components/sidebar/context.svelte.ts',
        'components/sidebar/index.ts',
        'components/sidebar/manifest.ts'
    ],
    components: ['button', 'tooltip', '_internal/overlay'],
    shared: [
        'utils.cn',
        'utils.createContext',
        'utils.pressable',
        'utils.travelingHighlight',
        'utils.visualViewportBounds',
        'transition'
    ],
    peerDependencies: {
        '@lucide/svelte': '^1.0.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};
