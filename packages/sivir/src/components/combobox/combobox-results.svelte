<script lang="ts">
    import { ScrollArea } from '@sivir-ui/svelte/components/scroll-area';
    import { onMount, type Snippet, tick } from 'svelte';
    import { getComboboxContext } from './context.svelte';

    const { id, state: comboboxState } = getComboboxContext();

    type Props = {
        children?: Snippet;
    };

    const { children }: Props = $props();
    let resultsElement = $state<HTMLElement>();
    let highlightStyle = $state('opacity: 0');
    let highlightReady = $state(false);
    let frame = 0;
    let traveling = true;
    let markedElement: HTMLElement | undefined;

    function markItem(element: HTMLElement | undefined) {
        if (markedElement === element) {
            return;
        }
        markedElement?.removeAttribute('data-item-highlighted');
        markedElement = element;
        markedElement?.setAttribute('data-item-highlighted', 'true');
    }

    function measureHighlight() {
        frame = 0;
        const activeElement = resultsElement?.querySelector<HTMLElement>(
            '[data-collection-item][data-collection-active="true"]'
        );
        if (!traveling) {
            highlightStyle = 'opacity: 0';
            markItem(activeElement && !activeElement.hidden ? activeElement : undefined);
            return;
        }
        if (!resultsElement || !activeElement || activeElement.hidden) {
            highlightStyle = 'opacity: 0';
            return;
        }

        const resultsBounds = resultsElement.getBoundingClientRect();
        const itemBounds = activeElement.getBoundingClientRect();
        const layoutWidth = resultsElement.offsetWidth;
        const transformed = layoutWidth > 0 && Math.abs(resultsBounds.width - layoutWidth) >= 1;
        const scale = transformed ? resultsBounds.width / layoutWidth : 1;
        const x = (itemBounds.left - resultsBounds.left) / scale - resultsElement.clientLeft;
        const y =
            (itemBounds.top - resultsBounds.top) / scale -
            resultsElement.clientTop +
            resultsElement.scrollTop;

        highlightStyle = [
            `width: ${itemBounds.width / scale}px`,
            `height: ${itemBounds.height / scale}px`,
            `transform: translate3d(${x}px, ${y}px, 0)`,
            'opacity: 1'
        ].join('; ');
    }

    function scheduleMeasure() {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(measureHighlight);
    }

    function activateHoveredItem(event: PointerEvent) {
        if (event.pointerType === 'touch') {
            return;
        }
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }

        const element = target.closest<HTMLElement>('[data-collection-item]');
        if (
            !element ||
            !resultsElement?.contains(element) ||
            element.matches(':disabled, [aria-disabled="true"]')
        ) {
            return;
        }

        const value = element.dataset.comboboxValue;
        if (value) {
            comboboxState.activeValue = value;
        }
    }

    $effect(() => {
        void comboboxState.searchContent;
        void comboboxState.activeValue;
        void tick().then(scheduleMeasure);
    });

    onMount(() => {
        const element = resultsElement;
        if (!element) {
            return;
        }

        traveling =
            getComputedStyle(element).getPropertyValue('--sivir-traveling-highlight').trim() !==
            'none';
        scheduleMeasure();

        const observer = new ResizeObserver(scheduleMeasure);
        observer.observe(element);
        window.addEventListener('resize', scheduleMeasure);

        const readyFrame = requestAnimationFrame(() => {
            highlightReady = true;
        });

        return () => {
            cancelAnimationFrame(frame);
            cancelAnimationFrame(readyFrame);
            observer.disconnect();
            window.removeEventListener('resize', scheduleMeasure);
            markItem(undefined);
        };
    });
</script>

<ScrollArea class="min-h-0 min-w-0 max-h-[inherit] flex-1" onscroll={scheduleMeasure}>
    <div
        bind:this={resultsElement}
        role="listbox"
        id={`combobox-${id}-listbox`}
        tabindex={-1}
        data-ui="combobox-results"
        onpointerover={activateHoveredItem}
        class="sivir-collection-surface flex flex-col gap-0 p-1"
    >
        <span
            class="sivir-item-highlight"
            data-ready={highlightReady}
            aria-hidden="true"
            style={highlightStyle}
        ></span>

        {@render children?.()}

        {#if comboboxState.searchContent !== '' && comboboxState.results.size === 0}
            <div class="flex w-full items-center justify-center p-3">
                <p
                    class="[font-size:var(--font-size-body)] [font-weight:var(--font-weight-body)] [letter-spacing:var(--tracking-body)] text-foreground-muted"
                >
                    No results found
                </p>
            </div>
        {/if}
    </div>
</ScrollArea>
