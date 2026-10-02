<script lang="ts">
    type Box = {
        top: number;
        left: number;
        width: number;
        height: number;
        radius: string;
    };

    let {
        container,
        elements,
        focus = null,
        focusLabel = '',
        selected = false
    }: {
        container: HTMLElement;
        elements: readonly Element[];
        focus?: Element | null;
        focusLabel?: string;
        selected?: boolean;
    } = $props();

    let frame = $state<Box | null>(null);
    let boxes = $state<Box[]>([]);
    let focusBox = $state<Box | null>(null);

    function boxFor(element: Element, bounds: DOMRect): Box {
        const rect = element.getBoundingClientRect();

        return {
            top: rect.top - bounds.top,
            left: rect.left - bounds.left,
            width: rect.width,
            height: rect.height,
            radius: getComputedStyle(element).borderRadius
        };
    }

    function measure() {
        const bounds = container.getBoundingClientRect();

        frame = {
            top: bounds.top,
            left: bounds.left,
            width: bounds.width,
            height: bounds.height,
            radius: '0px'
        };
        boxes = elements.map((element) => {
            return boxFor(element, bounds);
        });
        focusBox = focus ? boxFor(focus, bounds) : null;
    }

    $effect(() => {
        void elements;
        void focus;

        let pending = 0;

        function schedule() {
            cancelAnimationFrame(pending);
            pending = requestAnimationFrame(measure);
        }

        const observer = new ResizeObserver(schedule);

        observer.observe(container);

        for (const element of elements) {
            observer.observe(element);
        }

        if (focus) {
            observer.observe(focus);
        }

        measure();
        window.addEventListener('scroll', schedule, true);
        window.addEventListener('resize', schedule);

        return () => {
            cancelAnimationFrame(pending);
            observer.disconnect();
            window.removeEventListener('scroll', schedule, true);
            window.removeEventListener('resize', schedule);
        };
    });
</script>

{#if frame && (boxes.length > 0 || focusBox)}
    <div
        class="pointer-events-none fixed z-40 overflow-hidden"
        style:top={`${frame.top}px`}
        style:left={`${frame.left}px`}
        style:width={`${frame.width}px`}
        style:height={`${frame.height}px`}
        aria-hidden="true"
    >
        {#each boxes as box, index (index)}
            <div
                class="absolute outline-1 outline-[var(--color-ring)] outline-solid"
                style:top={`${box.top}px`}
                style:left={`${box.left}px`}
                style:width={`${box.width}px`}
                style:height={`${box.height}px`}
                style:border-radius={box.radius}
            ></div>
        {/each}
        {#if focusBox}
            <div
                class={`absolute outline-solid outline-primary ${selected ? 'outline-2 outline-offset-2' : 'outline-1 outline-offset-1'}`}
                style:top={`${focusBox.top}px`}
                style:left={`${focusBox.left}px`}
                style:width={`${focusBox.width}px`}
                style:height={`${focusBox.height}px`}
                style:border-radius={focusBox.radius}
            >
                {#if focusLabel}
                    <span
                        class={`absolute left-[-2px] rounded-[var(--radius-sm)] bg-primary px-1.5 text-xs leading-5 font-medium whitespace-nowrap text-[var(--color-on-primary)] ${focusBox.top < 30 ? 'top-[calc(100%+6px)]' : 'bottom-[calc(100%+6px)]'}`}
                    >
                        {focusLabel}
                    </span>
                {/if}
            </div>
        {/if}
    </div>
{/if}
