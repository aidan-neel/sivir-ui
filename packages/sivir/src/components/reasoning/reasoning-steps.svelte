<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ReasoningStepsProps } from '.';

    let { class: className, children, ...rest }: ReasoningStepsProps = $props();
</script>

<ol
    {...rest}
    data-ui="reasoning-steps"
    class={cn(className, 'm-0 flex list-none flex-col p-0 text-sm leading-body')}
>
    {@render children?.()}
</ol>
