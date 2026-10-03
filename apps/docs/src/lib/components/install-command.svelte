<script lang="ts">
    import { CopyButton } from '@sivir-ui/svelte/components/copy-button';
    import { cn } from '@sivir-ui/svelte/utils';
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

    function copyCommand(event: MouseEvent & { currentTarget: HTMLElement }) {
        const target = event.target as HTMLElement;

        if (target.closest('button')) {
            return;
        }

        event.currentTarget.querySelector<HTMLButtonElement>('button')?.click();
    }
</script>

<div
    role="presentation"
    onclick={copyCommand}
    {style}
    class={cn(
        className,
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
    <CopyButton
        text={command}
        label="Copy command"
        copiedLabel="Copied"
        tooltipDelay={500}
        oncopy={() => {
            trackEvent('install_command_copied', {
                source
            });
        }}
    />
</div>
