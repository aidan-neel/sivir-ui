<script lang="ts">
    import X from '@lucide/svelte/icons/x';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { AttachmentRemoveProps } from '.';
    import { getAttachmentItemContext } from './context.svelte';

    let {
        class: className,
        'aria-label': ariaLabel,
        onclick,
        ...rest
    }: AttachmentRemoveProps = $props();

    const item = getAttachmentItemContext();

    function nextFocusTarget(button: HTMLElement) {
        const list = button.closest('[data-ui="attachment-list"]');
        const peers = Array.from(
            list?.querySelectorAll<HTMLElement>('[data-ui="attachment-remove"]') ?? []
        ).filter((peer) => {
            return !peer.closest('[inert]');
        });
        const index = peers.indexOf(button);
        const neighbor = index === -1 ? undefined : (peers[index + 1] ?? peers[index - 1]);

        if (neighbor) {
            return neighbor;
        }

        return button
            .closest('[data-ui="attachment"]')
            ?.querySelector<HTMLElement>('[data-ui="attachment-trigger"]:not(:disabled)');
    }

    function handleClick(event: MouseEvent) {
        onclick?.(event);
        if (event.defaultPrevented || !(event.currentTarget instanceof HTMLElement)) {
            return;
        }

        const button = event.currentTarget;
        const focused = document.activeElement === button;
        const target = focused ? nextFocusTarget(button) : undefined;

        item.remove();
        target?.focus();
    }
</script>

{#if item.removable}
    <Button
        {...rest}
        type="button"
        variant="ghost"
        size="icon"
        data-ui="attachment-remove"
        aria-label={ariaLabel ?? `Remove ${item.file.name}`}
        onclick={handleClick}
        class={cn(
            className,
            "relative row-span-2 row-start-1 size-7 min-w-7 shrink-0 rounded-full text-foreground-muted after:absolute after:-inset-1 after:content-[''] hover:text-foreground"
        )}
    >
        <X size={14} strokeWidth={2} aria-hidden="true" />
    </Button>
{/if}
