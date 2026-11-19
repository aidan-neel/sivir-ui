const MENU_ITEM = '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]';

function menuItems(panel: Element) {
    return Array.from(panel.querySelectorAll<HTMLElement>(MENU_ITEM)).filter((item) => {
        return !item.matches(':disabled, [aria-disabled="true"]');
    });
}

/** Focuses the first or last enabled item of a menu panel. */
export function focusMenuItem(panel: Element, which: 'first' | 'last') {
    const items = menuItems(panel);
    const item = which === 'first' ? items[0] : items[items.length - 1];
    item?.focus();
}

function focusSubmenu(trigger: HTMLElement, frames: number) {
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
 * either end, and moves into a submenu with the right arrow. Returns whether
 * the key moved focus.
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
    if (event.key === 'ArrowRight' && target.getAttribute('aria-haspopup') === 'menu') {
        focusSubmenu(target, 10);
        return true;
    }
    return false;
}
