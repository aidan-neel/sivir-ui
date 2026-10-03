<script lang="ts">
    import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { Snippet } from 'svelte';

    let {
        title,
        description,
        href,
        class: className,
        stageClass,
        children
    }: {
        title: string;
        description: string;
        href: string;
        class?: string;
        stageClass?: string;
        children: Snippet;
    } = $props();
</script>

<figure class={cn(className, 'm-0 flex min-w-0 flex-col gap-3')}>
    <figcaption class="px-1">
        <a
            {href}
            class="group flex min-w-0 items-baseline gap-3 rounded-[var(--radius-sm)] no-underline outline-none focus-visible:shadow-[var(--focus-ring)]"
        >
            <span
                class="shrink-0 [font-size:var(--font-size-body)] [font-weight:var(--font-weight-label)] text-foreground"
            >
                {title}
            </span>
            <span
                class="min-w-0 truncate [font-size:var(--font-size-label)] text-foreground-muted max-sm:hidden"
            >
                {description}
            </span>
            <ArrowUpRight
                size={14}
                aria-hidden="true"
                class="ms-auto shrink-0 self-center text-foreground-muted transition-[translate,color] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] group-hover:translate-x-px group-hover:-translate-y-px group-hover:text-foreground motion-reduce:transition-none"
            />
        </a>
    </figcaption>
    <div
        class={cn(
            stageClass,
            'flex min-w-0 flex-1 items-center justify-center rounded-[calc(var(--radius-xl)+0.5rem)] bg-background p-4 text-foreground shadow-[inset_0_0_0_var(--border-size)_var(--color-border)] sm:p-10'
        )}
    >
        {@render children()}
    </div>
</figure>
