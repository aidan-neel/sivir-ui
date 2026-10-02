import { travelingHighlight } from '@sivir-ui/svelte/utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

function rect(left: number, top: number, width = 100, height = 32): DOMRect {
    return {
        left,
        top,
        width,
        height,
        right: left + width,
        bottom: top + height,
        x: left,
        y: top,
        toJSON: () => ({})
    };
}

async function settle() {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

afterEach(() => {
    document.body.replaceChildren();
    document.documentElement.style.removeProperty('--sivir-traveling-highlight');
    vi.unstubAllGlobals();
});

describe('travelingHighlight', () => {
    it('prefers the transient active item over an earlier selected item', async () => {
        const surface = document.createElement('div');
        const selected = document.createElement('button');
        const active = document.createElement('button');
        selected.dataset.collectionItem = '';
        selected.setAttribute('aria-selected', 'true');
        active.dataset.collectionItem = '';
        active.dataset.collectionActive = 'true';
        Object.defineProperty(surface, 'getBoundingClientRect', { value: () => rect(0, 0) });
        Object.defineProperty(selected, 'getBoundingClientRect', { value: () => rect(0, 0) });
        Object.defineProperty(active, 'getBoundingClientRect', { value: () => rect(0, 40) });
        surface.append(selected, active);
        document.body.append(surface);
        const action = travelingHighlight(surface);
        await settle();
        expect(
            surface.querySelector<HTMLElement>('.sivir-item-highlight')?.style.transform
        ).toContain('40px');
        action.destroy?.();
    });

    it('still mounts on a coarse-pointer device', async () => {
        // Skipping the action on touch would drop the highlight entirely on a
        // hybrid machine, including for keyboard focus.
        vi.stubGlobal(
            'matchMedia',
            (query: string) => ({ matches: true, media: query }) as MediaQueryList
        );
        const surface = document.createElement('div');
        const active = document.createElement('button');
        active.dataset.collectionItem = '';
        active.dataset.collectionActive = 'true';
        Object.defineProperty(surface, 'getBoundingClientRect', { value: () => rect(0, 0) });
        Object.defineProperty(active, 'getBoundingClientRect', { value: () => rect(0, 0) });
        surface.append(active);
        document.body.append(surface);

        const action = travelingHighlight(surface);
        await settle();

        expect(surface.querySelector('.sivir-item-highlight')).not.toBeNull();
        expect(surface.classList.contains('sivir-collection-surface')).toBe(true);
        action.destroy?.();
    });

    it('follows keyboard focus but not touch pointers', async () => {
        const surface = document.createElement('div');
        const first = document.createElement('button');
        const second = document.createElement('button');
        first.dataset.collectionItem = '';
        first.dataset.collectionActive = 'true';
        second.dataset.collectionItem = '';
        Object.defineProperty(surface, 'getBoundingClientRect', { value: () => rect(0, 0) });
        Object.defineProperty(first, 'getBoundingClientRect', { value: () => rect(0, 0) });
        Object.defineProperty(second, 'getBoundingClientRect', { value: () => rect(0, 60) });
        surface.append(first, second);
        document.body.append(surface);

        const action = travelingHighlight(surface);
        await settle();

        second.dispatchEvent(
            new PointerEvent('pointerover', { bubbles: true, pointerType: 'touch' })
        );
        await settle();
        expect(
            surface.querySelector<HTMLElement>('.sivir-item-highlight')?.style.transform
        ).toContain('0px');

        second.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
        await settle();
        expect(
            surface.querySelector<HTMLElement>('.sivir-item-highlight')?.style.transform
        ).toContain('60px');
        action.destroy?.();
    });

    it('keeps a nested collection from moving its parent highlight', async () => {
        const parent = document.createElement('div');
        const parentItem = document.createElement('button');
        const nested = document.createElement('div');
        const nestedItem = document.createElement('button');
        parentItem.dataset.collectionItem = '';
        parentItem.dataset.collectionActive = 'true';
        nestedItem.dataset.collectionItem = '';
        Object.defineProperty(parent, 'getBoundingClientRect', { value: () => rect(0, 0) });
        Object.defineProperty(parentItem, 'getBoundingClientRect', { value: () => rect(0, 10) });
        Object.defineProperty(nested, 'getBoundingClientRect', { value: () => rect(0, 40) });
        Object.defineProperty(nestedItem, 'getBoundingClientRect', { value: () => rect(0, 80) });
        nested.append(nestedItem);
        parent.append(parentItem, nested);
        document.body.append(parent);
        const parentAction = travelingHighlight(parent);
        const nestedAction = travelingHighlight(nested);
        await settle();
        nestedItem.dispatchEvent(new Event('pointermove', { bubbles: true }));
        await settle();
        expect(
            parent.querySelector<HTMLElement>(':scope > .sivir-item-highlight')?.style.transform
        ).toContain('10px');
        parentAction.destroy?.();
        nestedAction.destroy?.();
    });

    it('does not re-observe elements after each resize notification', async () => {
        let observeCalls = 0;
        class NotifyingResizeObserver {
            constructor(private callback: ResizeObserverCallback) {}

            observe() {
                observeCalls += 1;
                if (observeCalls < 6) {
                    queueMicrotask(() => this.callback([], this as unknown as ResizeObserver));
                }
            }

            unobserve() {}
            disconnect() {}
        }
        vi.stubGlobal('ResizeObserver', NotifyingResizeObserver);

        const surface = document.createElement('div');
        const active = document.createElement('button');
        active.dataset.collectionItem = '';
        active.dataset.collectionActive = 'true';
        Object.defineProperty(surface, 'getBoundingClientRect', { value: () => rect(0, 0) });
        Object.defineProperty(active, 'getBoundingClientRect', { value: () => rect(0, 0) });
        surface.append(active);
        document.body.append(surface);

        const action = travelingHighlight(surface);
        await settle();

        expect(observeCalls).toBe(2);
        action.destroy?.();
    });

    it('still highlights the active item when traveling is off', async () => {
        document.documentElement.style.setProperty('--sivir-traveling-highlight', 'none');
        const surface = document.createElement('div');
        const selected = document.createElement('button');
        const active = document.createElement('button');
        selected.dataset.collectionItem = '';
        selected.setAttribute('aria-selected', 'true');
        active.dataset.collectionItem = '';
        active.dataset.collectionActive = 'true';
        Object.defineProperty(surface, 'getBoundingClientRect', { value: () => rect(0, 0) });
        Object.defineProperty(selected, 'getBoundingClientRect', { value: () => rect(0, 0) });
        Object.defineProperty(active, 'getBoundingClientRect', { value: () => rect(0, 40) });
        surface.append(selected, active);
        document.body.append(surface);
        const action = travelingHighlight(surface);
        await settle();
        const highlight = surface.querySelector<HTMLElement>('.sivir-item-highlight');
        expect(highlight).toBeTruthy();
        expect(highlight?.style.opacity).not.toBe('1');
        expect(highlight?.getAttribute('data-ready')).toBeNull();
        expect(active.getAttribute('data-item-highlighted')).toBe('true');
        expect(selected.hasAttribute('data-item-highlighted')).toBe(false);
        action.destroy?.();
        document.documentElement.style.removeProperty('--sivir-traveling-highlight');
    });
});
