<script lang="ts">
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import { cn, dynamicWidth, travelingHighlight } from '@sivir-ui/svelte/utils';
    import type { Snippet } from 'svelte';
    import { getPopoverContext } from '../popover/context.svelte';
    import { moveMenuFocus } from './focus';

    type Props = {
        children: Snippet;
        class?: string;
        dynamic?: boolean;
    };

    let props: Props = $props();
    const { state } = getPopoverContext();

    function handleKeydown(event: KeyboardEvent & { currentTarget: EventTarget & HTMLElement }) {
        if (event.key === 'ArrowLeft' && state.buttonRef) {
            event.preventDefault();
            event.stopPropagation();
            state.buttonRef.focus();
            setTimeout(() => {
                if (state.hoverTimeout) {
                    clearTimeout(state.hoverTimeout);
                    state.hoverTimeout = undefined;
                }
                state.open = false;
            });
            return;
        }
        if (moveMenuFocus(event, event.currentTarget)) {
            event.preventDefault();
        }
    }
</script>

<Popover.Content
    role="menu"
    tabindex={-1}
    onkeydown={handleKeydown}
    data-ui="dropdown-submenu-content"
    class={cn(props.class, 'sivir-menu-panel')}
    surfaceClass="p-0"
>
    <div
        use:travelingHighlight
        use:dynamicWidth={{ enabled: props.dynamic ?? false }}
        class="flex flex-col gap-0 p-1"
    >
        {@render props.children?.()}
    </div>
</Popover.Content>
