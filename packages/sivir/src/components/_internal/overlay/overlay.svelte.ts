import { clickOutside, getFocusableElements, trapFocus } from '@sivir/ui/utils';

/**
 * Shared overlay primitive for modal-content and sheet-content.
 *
 * Owns the cross-cutting overlay concerns:
 *   - Focus trap (initial focus on first focusable, Tab cycling).
 *   - Click-outside detection (panel boundary; respects allowClickOutside).
 *   - Escape key handler (panel-scoped, fires onClose).
 *   - Body scroll lock while open.
 *
 * Consumer owns:
 *   - The panel DOM element (bind via `panelEl` getter).
 *   - The portal/positioning decision (the wrapper around the panel).
 *   - The animation surface (transitions on the consumer's own elements).
 *
 * Internal primitive per pattern guide Sec.2.5 -- not consumer-installable.
 * Modal and sheet auto-pull this; consumers cannot `npx sivir add overlay`.
 */
export type OverlayOptions = {
	/** Reactive getter for the open state. */
	isOpen: () => boolean;
	/** Reactive getter for the panel element to trap focus inside. */
	panelEl: () => HTMLElement | undefined;
	/** Fires when the user dismisses (Escape or click-outside). */
	onClose: () => void;
	/** Reactive getter -- when false, click-outside does not call onClose. */
	allowClickOutside?: () => boolean;
	/** Element that receives focus again after the overlay closes. */
	returnFocus?: () => HTMLElement | undefined;
	/** Lock body scroll while open. Defaults to true. */
	lockScroll?: boolean;
};

export function useOverlay(opts: OverlayOptions) {
	$effect(() => {
		if (!opts.isOpen()) return;
		const panel = opts.panelEl();
		if (!panel) return;
		if (typeof document === 'undefined') return;

		const lockScroll = opts.lockScroll !== false;

		const cleanupTrap = trapFocus(panel, {
			initialFocus: getFocusableElements(panel)[0] ?? null,
			returnFocus: opts.returnFocus?.()
		});

		if (lockScroll) {
			document.body.style.overflow = 'hidden';
		}

		const co = clickOutside(panel, () => {
			if (opts.allowClickOutside?.() ?? true) {
				opts.onClose();
			}
		});

		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				event.preventDefault();
				opts.onClose();
			}
		};
		panel.addEventListener('keydown', handleKeydown);

		return () => {
			cleanupTrap?.();
			co.destroy();
			panel.removeEventListener('keydown', handleKeydown);
			if (lockScroll) {
				document.body.style.overflow = '';
			}
		};
	});
}
