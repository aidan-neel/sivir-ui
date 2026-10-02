<script lang="ts">
    type Box = {
        top: number;
        left: number;
        width: number;
        height: number;
    };

    let {
        container,
        elements
    }: {
        container: HTMLElement;
        elements: readonly Element[];
    } = $props();

    let frame = $state<Box | null>(null);
    let boxes = $state<Box[]>([]);

    function measure() {
        const bounds = container.getBoundingClientRect();

        frame = {
            top: bounds.top,
            left: bounds.left,
            width: bounds.width,
            height: bounds.height
        };
        boxes = elements.map((element) => {
            const rect = element.getBoundingClientRect();

            return {
                top: rect.top - bounds.top,
                left: rect.left - bounds.left,
                width: rect.width,
                height: rect.height
            };
        });
    }

    $effect(() => {
        void elements;

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

{#if frame && boxes.length > 0}
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
                class="absolute rounded-[2px] outline-1 outline-[var(--color-ring)] outline-solid"
                style:top={`${box.top}px`}
                style:left={`${box.left}px`}
                style:width={`${box.width}px`}
                style:height={`${box.height}px`}
            ></div>
        {/each}
    </div>
{/if}
