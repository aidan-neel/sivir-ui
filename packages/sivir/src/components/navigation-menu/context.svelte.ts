import { createContext } from '@sivir-ui/svelte/utils';
import { getContext, hasContext, type Snippet, setContext } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type NavigationMenuOpenReason = 'hover' | 'click' | 'keyboard';

export type NavigationMenuPanel = {
    readonly class: string | undefined;
    readonly children: Snippet | undefined;
    readonly attributes: Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'children'>;
};

export type NavigationMenuContext = {
    readonly id: string;
    readonly value: string;
    readonly reason: NavigationMenuOpenReason | null;
    readonly direction: 1 | -1;
    readonly rootEl: HTMLElement | undefined;
    panel: (value: string) => NavigationMenuPanel | undefined;
    trigger: (value: string) => HTMLElement | undefined;
    registerPanel: (value: string, panel: NavigationMenuPanel) => () => void;
    registerTrigger: (value: string, element: HTMLElement) => () => void;
    registerViewport: (element: HTMLElement) => () => void;
    contains: (target: EventTarget | null) => boolean;
    hoverTrigger: (value: string) => void;
    leave: () => void;
    enterViewport: () => void;
    clickTrigger: (value: string) => void;
    open: (value: string, reason: NavigationMenuOpenReason) => void;
    close: () => void;
    contentId: (value: string) => string;
    triggerId: (value: string) => string;
};

export type NavigationMenuItemContext = {
    readonly value: string;
};

const { set: setNavigationMenuContext, get: getNavigationMenuContext } =
    createContext<NavigationMenuContext>('navigation-menu');

const itemKey = Symbol('sivir.navigation-menu-item');
const panelKey = Symbol('sivir.navigation-menu-panel');

function setNavigationMenuItemContext(value: NavigationMenuItemContext) {
    setContext(itemKey, value);
}

function getNavigationMenuItemContext(): NavigationMenuItemContext {
    if (!hasContext(itemKey)) {
        throw new Error(
            'NavigationMenu.Trigger and Content must be used within <NavigationMenu.Item>.'
        );
    }

    return getContext<NavigationMenuItemContext>(itemKey);
}

function markNavigationMenuPanel() {
    setContext(panelKey, true);
}

function isInsideNavigationMenuPanel() {
    return hasContext(panelKey);
}

export {
    getNavigationMenuContext,
    getNavigationMenuItemContext,
    isInsideNavigationMenuPanel,
    markNavigationMenuPanel,
    setNavigationMenuContext,
    setNavigationMenuItemContext
};
