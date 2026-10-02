<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { QuestionTitleProps } from '.';

    let { class: className, children, ...rest }: QuestionTitleProps = $props();
</script>

<legend
    {...rest}
    data-ui="question-title"
    class={cn(
        className,
        'float-none flex w-full items-center px-3 pt-3 [font-family:var(--font-header)] [font-size:var(--font-size-header)] [font-weight:var(--font-weight-header)] [letter-spacing:var(--tracking-header)] leading-snug text-foreground'
    )}
>
    <span class="min-w-0 flex-1">{@render children?.()}</span>
</legend>
