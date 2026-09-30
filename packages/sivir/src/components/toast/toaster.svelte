<script lang="ts">
    import { cn, visualViewportBounds } from '@sivir-ui/svelte/utils';
    import type { Attachment } from 'svelte/attachments';
    import type { Toast as ToastData } from './lib.svelte';
    import { getToastPrimaryHostId, setToastUIState } from './lib.svelte';
    import Toast from './toast.svelte';

    const { state: toastState, hostId } = setToastUIState();
    const isPrimary = $derived(getToastPrimaryHostId() === hostId);

    let expanded = $state(false);
    let heights = $state<Record<number, number>>({} as Record<number, number>);
    let entered = $state<Record<number, boolean>>({} as Record<number, boolean>);
    let portalEl = $state<HTMLDivElement>();

    /**
     * Portal to `<body>` so `position: fixed` stays viewport-relative even when a
     * Toaster is mounted under transformed or overflow-clipped ancestors, as in
     * docs previews and nested page hosts.
     */
    $effect(() => {
        if (!portalEl || typeof document === 'undefined') {
            return;
        }
        document.body.appendChild(portalEl);
        return () => {
            portalEl?.remove();
        };
    });

    const COLLAPSED_OFFSET = 14;
    const COLLAPSED_SCALE_STEP = 0.05;
    const COLLAPSED_OPACITY_STEP = 0.16;
    const MAX_VISIBLE = 3;
    const EXPANDED_GAP = 10;
    const FALLBACK_HEIGHT = 72;
    const OPEN_CLIP = 'inset(-48px -48px -48px -48px round var(--radius-lg))';

    const reversedToasts = $derived([...toastState.data.toasts].reverse());
    const activeToasts = $derived(reversedToasts.filter((toast) => !toast.leaving));
    const frontHeight = $derived(heightOf(activeToasts[0]));

    const slots = $derived.by(() => {
        const result: Record<number, number> = {};
        let active = 0;

        for (const toast of reversedToasts) {
            if (toast.id === undefined) {
                continue;
            }
            result[toast.id] = active;
            if (!toast.leaving) {
                active += 1;
            }
        }

        return result;
    });

    const viewportClass =
        // token-lint-disable-next-line no-literal-length: safe-area fallbacks
        'pointer-events-none fixed inset-x-0 top-[var(--sivir-viewport-top)] z-200 flex h-[var(--sivir-viewport-height)] items-end justify-center px-[max(1rem,env(safe-area-inset-right))] pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:justify-end sm:p-6';
    const stackClass =
        // token-lint-disable-next-line no-literal-length: toast stack max width
        'pointer-events-auto relative w-full max-w-[min(100%,26rem)] transition-[height] [transition-duration:var(--motion-duration-toast-in)] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none sm:max-w-90';

    function heightOf(toast: ToastData | undefined): number {
        if (toast?.id === undefined) {
            return FALLBACK_HEIGHT;
        }

        return heights[toast.id] ?? FALLBACK_HEIGHT;
    }

    function slotOf(toast: ToastData): number {
        if (toast.id === undefined) {
            return 0;
        }

        return slots[toast.id] ?? 0;
    }

    function getExpandedY(slot: number): number {
        let y = 0;

        for (let i = 0; i < slot; i++) {
            y += heightOf(activeToasts[i]) + EXPANDED_GAP;
        }

        return y;
    }

    function isCollapsedBack(toast: ToastData): boolean {
        return !expanded && slotOf(toast) > 0;
    }

    function getTransform(toast: ToastData): string {
        const slot = slotOf(toast);
        const isEntering = toast.id === undefined || !entered[toast.id];

        if (isEntering || (toast.leaving && slot === 0 && !expanded)) {
            return 'translateY(100%)';
        }

        if (expanded) {
            const y = getExpandedY(slot);

            return toast.leaving ? `translateY(-${y}px) scale(0.96)` : `translateY(-${y}px)`;
        }

        const lift = heightOf(toast) - frontHeight - slot * COLLAPSED_OFFSET;
        const scale = Math.max(1 - slot * COLLAPSED_SCALE_STEP, 0.8);
        const leavingScale = toast.leaving ? scale - 0.04 : scale;

        return `translateY(${lift}px) scale(${leavingScale})`;
    }

    function getOpacity(toast: ToastData): number {
        const slot = slotOf(toast);
        const isEntering = toast.id === undefined || !entered[toast.id];

        if (isEntering || toast.leaving) {
            return 0;
        }
        if (expanded) {
            return 1;
        }
        if (slot >= MAX_VISIBLE) {
            return 0;
        }

        return Math.max(1 - slot * COLLAPSED_OPACITY_STEP, 0);
    }

    function getClipPath(toast: ToastData): string {
        if (!isCollapsedBack(toast)) {
            return OPEN_CLIP;
        }

        const hidden = Math.max(heightOf(toast) - frontHeight, 0);

        return `inset(0 0 ${hidden}px 0 round var(--radius-lg))`;
    }

    function enter(id: number): Attachment<HTMLElement> {
        return (node) => {
            void node.offsetHeight;
            const frame = requestAnimationFrame(() => {
                entered[id] = true;
            });

            return () => {
                cancelAnimationFrame(frame);
                delete entered[id];
                delete heights[id];
            };
        };
    }

    const containerHeight = $derived.by(() => {
        const n = activeToasts.length;
        if (n === 0) {
            return 0;
        }
        if (expanded) {
            return activeToasts.reduce((sum, toast, i) => {
                return sum + heightOf(toast) + (i < n - 1 ? EXPANDED_GAP : 0);
            }, 0);
        }

        return frontHeight + (Math.min(n, MAX_VISIBLE) - 1) * COLLAPSED_OFFSET;
    });
</script>

{#if isPrimary && toastState.data}
    <div bind:this={portalEl} use:visualViewportBounds class={viewportClass}>
        <div
            role="region"
            aria-label="Notifications"
            class={stackClass}
            style:height={`${containerHeight}px`}
            onmouseenter={() => (expanded = true)}
            onmouseleave={() => (expanded = false)}
        >
            {#each reversedToasts as toast, i (toast.id)}
                <div
                    {@attach enter(toast.id ?? -1)}
                    data-leaving={toast.leaving || undefined}
                    data-collapsed-back={isCollapsedBack(toast) || undefined}
                    class={cn(
                        'absolute bottom-0 w-full origin-top transition-[transform,opacity,clip-path] ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform motion-reduce:transition-none',
                        '[&_[data-ui=toast]>*]:transition-opacity [&_[data-ui=toast]>*]:[transition-duration:var(--motion-duration-toast-in)] [&_[data-ui=toast]>*]:ease-[cubic-bezier(0.32,0.72,0,1)]',
                        'data-[collapsed-back]:[&_[data-ui=toast]>*]:opacity-0',
                        toast.leaving
                            ? '[transition-duration:var(--motion-duration-toast-out)]'
                            : '[transition-duration:var(--motion-duration-toast-in)]'
                    )}
                    style:transform={getTransform(toast)}
                    style:opacity={getOpacity(toast)}
                    style:clip-path={getClipPath(toast)}
                    style:z-index={reversedToasts.length - i}
                    style:pointer-events={!toast.leaving && (slotOf(toast) < MAX_VISIBLE || expanded)
                        ? 'auto'
                        : 'none'}
                    bind:clientHeight={heights[toast.id ?? -1]}
                >
                    <Toast {toast} />
                </div>
            {/each}
        </div>
    </div>
{/if}
