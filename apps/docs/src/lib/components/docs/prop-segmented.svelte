<script lang="ts" generics="T extends string">
    import { cn } from '@sivir-ui/svelte/utils';

    let {
        label,
        options,
        value = $bindable(),
        size = 'md',
        class: classProp
    }: {
        label: string;
        options: readonly { value: T; label: string }[];
        value: T;
        size?: 'sm' | 'md';
        class?: string;
    } = $props();

    let group = $state<HTMLDivElement>();

    function select(index: number) {
        value = options[index].value;
        group?.querySelectorAll<HTMLElement>('[role="radio"]')[index]?.focus();
    }

    function handleKeydown(event: KeyboardEvent) {
        const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
        const backward = event.key === 'ArrowLeft' || event.key === 'ArrowUp';

        if (!forward && !backward) {
            return;
        }
        event.preventDefault();

        const index = options.findIndex((option) => {
            return option.value === value;
        });
        const step = forward ? 1 : -1;

        select((index + step + options.length) % options.length);
    }
</script>

<div
    bind:this={group}
    role="radiogroup"
    aria-label={label}
    tabindex="-1"
    onkeydown={handleKeydown}
    class={cn(
        classProp,
        'inline-flex shrink-0 items-center gap-0.5'
    )}
>
    {#each options as option, index (option.value)}
        {@const checked = option.value === value}
        <button
            type="button"
            role="radio"
            aria-checked={checked}
            tabindex={checked ? 0 : -1}
            onclick={() => {
                select(index);
            }}
            class={cn(
                'inline-flex items-center justify-center rounded-[var(--radius-md)] font-medium whitespace-nowrap select-none transition-[background-color,color] [transition-duration:var(--motion-duration-hover)] hover:cursor-[var(--ui-cursor-interactive)] focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none motion-reduce:transition-none',
                size === 'sm' ? 'h-6 px-2 text-xs' : 'h-7 px-2.5 text-[0.8125rem]',
                checked
                    ? 'bg-secondary text-foreground'
                    : 'text-foreground-muted hover:bg-secondary/50 hover:text-foreground'
            )}
        >
            {option.label}
        </button>
    {/each}
</div>
