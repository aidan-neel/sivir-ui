<script lang="ts">
    import Check from '@lucide/svelte/icons/check';
    import Copy from '@lucide/svelte/icons/copy';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Tooltip from '@sivir-ui/svelte/components/tooltip';
    import { cn } from '@sivir-ui/svelte/utils';
    import { onDestroy } from 'svelte';
    import type { CopyButtonProps } from '.';

    let {
        text,
        label = 'Copy',
        copiedLabel = 'Copied',
        duration = 2000,
        tooltipDelay = 125,
        variant = 'ghost',
        size = 'icon',
        class: className,
        children,
        oncopy,
        ...rest
    }: CopyButtonProps = $props();

    const iconClass =
        'col-start-1 row-start-1 transition-[opacity,filter,scale,rotate,translate] [transition-duration:var(--motion-duration-swap)] ease-[var(--ease-out)]';
    const shownIconClass = 'rotate-0 scale-100 opacity-100 blur-[0]';
    const hiddenIconClass =
        'scale-[var(--motion-swap-scale)] opacity-0 blur-[var(--motion-swap-blur)]';

    let copied = $state(false);
    let timer: ReturnType<typeof setTimeout> | undefined;

    function fallbackCopy() {
        if (typeof document === 'undefined' || typeof document.execCommand !== 'function') {
            return false;
        }

        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand('copy');
        textarea.remove();
        return copied;
    }

    async function copy() {
        let didCopy = false;
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(text);
                didCopy = true;
            } catch {
                didCopy = fallbackCopy();
            }
        } else {
            didCopy = fallbackCopy();
        }
        if (!didCopy) {
            return;
        }

        copied = true;
        oncopy?.(text);
        timer = setTimeout(() => {
            copied = false;
        }, duration);
    }

    onDestroy(() => {
        clearTimeout(timer);
    });
</script>

<Tooltip.Root placement="top" delay={tooltipDelay} closeDelay={80}>
    <!-- Positioning/layout lives on the trigger wrapper so the tooltip anchors to
	     the same box the button actually renders in (e.g. an absolutely-placed
	     copy button in a code block). -->
    <Tooltip.Trigger showOnClick class={cn(className, '[&_button]:w-full')}>
        <Button
            {...rest}
            type="button"
            {variant}
            {size}
            aria-label={copied ? copiedLabel : label}
            onclick={copy}
        >
            <span class="relative grid size-4 place-items-center">
                <Copy
                    size={15}
                    class={cn(
                        iconClass,
                        copied
                            ? [hiddenIconClass, '-rotate-[var(--motion-swap-rotate)]']
                            : shownIconClass
                    )}
                />
                <Check
                    size={15}
                    class={cn(
                        iconClass,
                        'text-[var(--color-success)]',
                        copied
                            ? shownIconClass
                            : [hiddenIconClass, 'rotate-[var(--motion-swap-rotate)]']
                    )}
                />
            </span>
            {#if children}
                {@render children()}
            {/if}
        </Button>
    </Tooltip.Trigger>
    <Tooltip.Content>{copied ? copiedLabel : label}</Tooltip.Content>
</Tooltip.Root>
