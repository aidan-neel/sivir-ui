<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SourceLabelProps } from '.';

    let { class: className, children, ...rest }: SourceLabelProps = $props();
</script>

<span {...rest} data-ui="source-label" class={cn(className, 'min-w-0 truncate')}>
    {@render children?.()}
</span>
