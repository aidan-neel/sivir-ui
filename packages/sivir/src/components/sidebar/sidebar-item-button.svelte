<script lang="ts">
    import * as Tooltip from '@sivir-ui/svelte/components/tooltip';
    import { cn, pressable } from '@sivir-ui/svelte/utils';
    import type { SidebarItemButtonProps } from '.';
    import { getSidebarContext } from './context.svelte';

    let {
        active = false,
        tooltip,
        class: className,
        children,
        onclick: userOnclick,
        ...rest
    }: SidebarItemButtonProps = $props();

    const sidebar = getSidebarContext();
    const isLink = $derived(rest.href !== undefined);

    function handleClick(event: MouseEvent & { currentTarget: EventTarget & HTMLElement }) {
        (userOnclick as ((event: MouseEvent) => void) | null | undefined)?.(event);
        if (event.defaultPrevented) {
            return;
        }
        if (isLink && sidebar.isMobile) {
            sidebar.openMobile = false;
        }
    }
</script>

{#snippet row()}
    <svelte:element
        this={isLink ? 'a' : 'button'}
        use:pressable
        type={isLink ? undefined : 'button'}
        data-ui="sidebar-item-button"
        data-collection-item
        data-active={active ? '' : undefined}
        aria-current={active && isLink ? 'page' : undefined}
        class={cn(
            className,
            active && 'bg-secondary [&>svg]:text-foreground',
            'sivir-menu-item sivir-press justify-start gap-2 no-underline [&>svg]:text-foreground-muted'
        )}
        onclick={handleClick}
        {...rest}
    >
        {@render children?.()}
    </svelte:element>
{/snippet}

{#if tooltip}
    <Tooltip.Root placement="right">
        <Tooltip.Trigger class="w-full"> {@render row()} </Tooltip.Trigger>
        <Tooltip.Content>{sidebar.rail ? tooltip : ''}</Tooltip.Content>
    </Tooltip.Root>
{:else}
    {@render row()}
{/if}
