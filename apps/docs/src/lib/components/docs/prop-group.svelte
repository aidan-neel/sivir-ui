<script lang="ts">
    import type { Snippet } from 'svelte';

    let {
        title,
        children
    }: {
        title: string;
        children: Snippet;
    } = $props();
</script>

<div role="group" aria-label={title} class="flex flex-col">
    <span class="pb-1 text-xs font-medium text-foreground-muted">{title}</span>
    {@render children()}
</div>
