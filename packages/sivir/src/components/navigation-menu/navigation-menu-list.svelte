<script lang="ts">
    import { cn, travelingHighlight } from '@sivir-ui/svelte/utils';
    import type { NavigationMenuListProps } from '.';

    let { class: className, children, ...rest }: NavigationMenuListProps = $props();

    let listEl = $state<HTMLUListElement>();

    const topLevelSelector =
        ':scope > li > :is([data-ui="navigation-menu-trigger"], [data-ui="navigation-menu-link"])';

    $effect(() => {
        if (!listEl) {
            return;
        }
        const list = listEl;

        function handleKeydown(event: KeyboardEvent) {
            const items = Array.from(list.querySelectorAll<HTMLElement>(topLevelSelector));
            const index = items.findIndex((item) => {
                return item === event.target;
            });
            if (index === -1) {
                return;
            }

            let next: HTMLElement | undefined;
            if (event.key === 'ArrowRight') {
                next = items[(index + 1) % items.length];
            } else if (event.key === 'ArrowLeft') {
                next = items[(index - 1 + items.length) % items.length];
            } else if (event.key === 'Home') {
                next = items[0];
            } else if (event.key === 'End') {
                next = items[items.length - 1];
            }
            if (!next) {
                return;
            }
            event.preventDefault();
            next.focus();
        }

        list.addEventListener('keydown', handleKeydown);

        return () => {
            list.removeEventListener('keydown', handleKeydown);
        };
    });
</script>

<div use:travelingHighlight class="relative isolate flex">
    <ul
        bind:this={listEl}
        data-ui="navigation-menu-list"
        class={cn(className, 'm-0 flex list-none items-center gap-0.5 p-0')}
        {...rest}
    >
        {@render children?.()}
    </ul>
</div>
