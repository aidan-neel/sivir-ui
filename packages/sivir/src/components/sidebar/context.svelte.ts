import { createContext } from '@sivir-ui/svelte/utils';
import { getContext, hasContext, setContext } from 'svelte';

export type SidebarContext = {
    readonly id: string;
    open: boolean;
    openMobile: boolean;
    readonly isMobile: boolean;
    readonly variant: 'sidebar' | 'inset';
    readonly collapsible: 'offcanvas' | 'icon' | 'none';
    readonly rail: boolean;
    readonly hidden: boolean;
    triggerRef: HTMLElement | null;
    toggle: () => void;
};

export type SidebarGroupContext = {
    readonly id: string;
    readonly collapsible: boolean;
    open: boolean;
    labelled: boolean;
};

const { set: setSidebarContext, get: getSidebarContext } = createContext<SidebarContext>('sidebar');

const groupKey = Symbol('sivir.sidebar-group');
const itemKey = Symbol('sivir.sidebar-item');

function setSidebarGroupContext(value: SidebarGroupContext) {
    setContext(groupKey, value);
}

function getSidebarGroupContext(): SidebarGroupContext {
    if (!hasContext(groupKey)) {
        throw new Error('Sidebar group parts must be used within <Sidebar.Group>.');
    }

    return getContext<SidebarGroupContext>(groupKey);
}

function markSidebarItem() {
    setContext(itemKey, true);
}

function isInsideSidebarItem() {
    return hasContext(itemKey);
}

export {
    getSidebarContext,
    getSidebarGroupContext,
    isInsideSidebarItem,
    markSidebarItem,
    setSidebarContext,
    setSidebarGroupContext
};
