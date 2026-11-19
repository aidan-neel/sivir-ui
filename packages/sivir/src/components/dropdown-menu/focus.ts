import type { PopoverState } from '@sivir-ui/svelte/components/popover';
import { closeMenuLayers } from '@sivir-ui/svelte/utils';

const MENU_ITEM = '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]';

function menuItems(panel: Element) {
    return Array.from(panel.querySelectorAll<HTMLElement>(MENU_ITEM)).filter((item) => {
        return (
            !item.matches(':disabled, [aria-disabled="true"]') && item.getClientRects().length > 0
        );
    });
}

/** Focuses the first or last enabled, rendered item of a menu panel. */
export function focusMenuItem(panel: Element, which: 'first' | 'last') {
    const items = menuItems(panel);
    const item = which === 'first' ? items[0] : items[items.length - 1];
    item?.focus();
}

function focusSubmenu(trigger: HTMLElement, frames: number) {
    if (document.activeElement !== trigger) {
        return;
    }
    if (trigger.getAttribute('aria-expanded') !== 'true') {
        trigger.click();
    }
    const panelId = trigger.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    if (panel) {
        focusMenuItem(panel, 'first');
        return;
    }
    if (frames > 0) {
        requestAnimationFrame(() => {
            focusSubmenu(trigger, frames - 1);
        });
    }
}

/**
 * Walks a menu panel's items with the arrow keys, Home, and End, wrapping at
 * either end. The right arrow, Enter, or Space on a submenu trigger opens the
 * submenu and focuses its first item. Returns whether the key moved focus.
 */
export function moveMenuFocus(event: KeyboardEvent, panel: Element) {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.matches(MENU_ITEM)) {
        return false;
    }
    const items = menuItems(panel);
    const index = items.indexOf(target);
    if (index === -1) {
        return false;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        const step = event.key === 'ArrowDown' ? 1 : -1;
        items[(index + step + items.length) % items.length]?.focus();
        return true;
    }
    if (event.key === 'Home' || event.key === 'End') {
        focusMenuItem(panel, event.key === 'Home' ? 'first' : 'last');
        return true;
    }
    const opensSubmenu = event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ';
    if (opensSubmenu && target.getAttribute('aria-haspopup') === 'menu') {
        focusSubmenu(target, 10);
        return true;
    }
    return false;
}

/**
 * Closes the picked item's menu and every ancestor layer. When focus is inside
 * the menu, it moves to the root trigger first, so picking from a submenu does
 * not leave focus on the document body once the submenu unmounts.
 */
export function closeMenuToTrigger(current: PopoverState, ancestors: PopoverState[]) {
    const trigger = (ancestors[0] ?? current).buttonRef;
    const focusInMenu = document.activeElement?.closest('[data-floating-content]') != null;
    if (focusInMenu && trigger?.isConnected) {
        trigger.focus({ preventScroll: true });
    }
    closeMenuLayers(current, ancestors);
}
