<script lang="ts">
    import Check from '@lucide/svelte/icons/check';
    import Copy from '@lucide/svelte/icons/copy';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Tooltip from '@sivir-ui/svelte/components/tooltip';
    import { cn } from '@sivir-ui/svelte/utils';
    import { onDestroy } from 'svelte';
    import { trackEvent } from '$lib/analytics';

    let {
        command,
        source,
        class: className,
        style
    }: {
        command: string;
        source: 'home' | 'skill';
        class?: string;
        style?: string;
    } = $props();

    const iconClass =
        'col-start-1 row-start-1 transition-[opacity,filter,scale,rotate,translate] [transition-duration:var(--motion-duration-swap)] ease-[var(--ease-out)]';
    const shownIconClass = 'rotate-0 scale-100 opacity-100 blur-[0]';
    const hiddenIconClass =
        'scale-[var(--motion-swap-scale)] opacity-0 blur-[var(--motion-swap-blur)]';

    let copied = $state(false);
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function copy() {
        try {
            await navigator.clipboard.writeText(command);
        } catch {
            return;
        }
        copied = true;
        trackEvent('install_command_copied', {
            source
        });
        clearTimeout(timer);
        timer = setTimeout(() => {
            copied = false;
        }, 2000);
    }

    onDestroy(() => {
        clearTimeout(timer);
    });

    function copyCommand(event: MouseEvent & { currentTarget: HTMLElement }) {
        const target = event.target as HTMLElement;

        if (target.closest('button')) {
            return;
        }

        event.currentTarget.querySelector<HTMLButtonElement>('button')?.click();
    }
</script>

<div class={cn(className, 'flex w-full')} {style}>
    <Tooltip.Root placement="top" delay={500} closeDelay={80}>
        <Tooltip.Trigger class="flex w-full">
            <div
                role="presentation"
                onclick={copyCommand}
                class={cn(
                'group flex h-[var(--size-control-md)] w-full cursor-pointer select-none items-center gap-2.5 rounded-[var(--radius-lg)] ps-3.5 pe-1 text-start font-mono [font-size:var(--font-size-label)] transition-[background-color,box-shadow] [transition-duration:var(--motion-duration-hover)] ease-[var(--ease-out)] hover:bg-card hover:shadow-[inset_0_0_0_var(--border-size)_var(--color-border)] motion-reduce:transition-none'
        )}
            >
                <span
                    aria-hidden="true"
                    class="select-none text-foreground-muted/60 transition-colors [transition-duration:var(--motion-duration-hover)] group-hover:text-primary"
                    >$</span
                >
                <code
                    class="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-foreground-muted transition-colors [transition-duration:var(--motion-duration-hover)] [scrollbar-width:none] group-hover:text-foreground"
                    >{command}</code
                >
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={copied ? 'Copied' : 'Copy command'}
                    onclick={copy}
                >
                    <span class="relative grid size-4 place-items-center">
                        <Copy
                            size={15}
                            class={cn(
                        iconClass,
                        copied ? [hiddenIconClass, '-rotate-[var(--motion-swap-rotate)]'] : shownIconClass
                    )}
                        />
                        <Check
                            size={15}
                            class={cn(
                        iconClass,
                        'text-[var(--color-success)]',
                        copied ? shownIconClass : [hiddenIconClass, 'rotate-[var(--motion-swap-rotate)]']
                    )}
                        />
                    </span>
                </Button>
            </div>
        </Tooltip.Trigger>
        <Tooltip.Content>{copied ? 'Copied' : 'Copy command'}</Tooltip.Content>
    </Tooltip.Root>
</div>
