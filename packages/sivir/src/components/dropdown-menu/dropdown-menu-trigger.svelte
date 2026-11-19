<script lang="ts">
    import type { ButtonVariant } from '@sivir-ui/svelte/components/button';
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import { type Snippet, tick } from 'svelte';
    import { getPopoverContext } from '../popover/context.svelte';
    import { focusMenuItem } from './focus';

    type Props = {
        children: Snippet;
        class?: string;
        variant?: ButtonVariant;
    } & Omit<Popover.PopoverTriggerProps, 'children' | 'class' | 'variant'>;

    let { children, class: className, variant, ...rest }: Props = $props();

    const { state: popoverState } = getPopoverContext();

    let focusOnOpen = $state(false);

    /**
     * A menu opened from the keyboard moves focus to its first item, so Enter
     * or Space opens it and the arrows walk it, as the ARIA menu button
     * pattern expects. ArrowDown opens it too. A pointer open leaves focus on
     * the trigger.
     */
    $effect(() => {
        const trigger = popoverState.buttonRef;
        if (!trigger) {
            return;
        }

        const handleKeydown = (event: KeyboardEvent) => {
            if (event.defaultPrevented || popoverState.open) {
                return;
            }
            if (event.key === 'Enter' || event.key === ' ') {
                focusOnOpen = true;
                return;
            }
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                focusOnOpen = true;
                trigger.click();
            }
        };
        const handlePointerdown = () => {
            focusOnOpen = false;
        };

        trigger.addEventListener('keydown', handleKeydown);
        trigger.addEventListener('pointerdown', handlePointerdown);
        return () => {
            trigger.removeEventListener('keydown', handleKeydown);
            trigger.removeEventListener('pointerdown', handlePointerdown);
        };
    });

    $effect(() => {
        if (!popoverState.open || !focusOnOpen) {
            return;
        }
        focusOnOpen = false;
        void tick().then(() => {
            const panel = popoverState.popoverRef;
            if (panel) {
                focusMenuItem(panel, 'first');
            }
        });
    });
</script>

<Popover.Trigger aria-haspopup="menu" class={className} {variant} {...rest}>
    {@render children?.()}
</Popover.Trigger>
