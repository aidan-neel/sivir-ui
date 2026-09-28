<script lang="ts">
    import Moon from '@lucide/svelte/icons/moon';
    import Sun from '@lucide/svelte/icons/sun';
    import { Button, type ButtonVariant } from '@sivir-ui/svelte/components/button';
    import { mode, toggleMode } from 'mode-watcher';

    let {
        class: className = '',
        variant = 'outline',
        iconSize = 16
    }: {
        class?: string;
        variant?: ButtonVariant;
        iconSize?: number;
    } = $props();

    const dark = $derived(mode.current === 'dark');
    const iconBase =
        'absolute inset-0 transition-[filter,opacity,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none';
    const iconHidden = 'scale-[0.25] opacity-0 blur-[4px]';
</script>

<Button
    class={className}
    {variant}
    size="icon"
    onclick={() => {
        toggleMode();
    }}
    aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
>
    <span
        class="relative block"
        style:width="{iconSize}px"
        style:height="{iconSize}px"
        aria-hidden="true"
    >
        <Sun size={iconSize} class={dark ? `${iconBase} ${iconHidden}` : iconBase} />
        <Moon size={iconSize} class={dark ? iconBase : `${iconBase} ${iconHidden}`} />
    </span>
</Button>
