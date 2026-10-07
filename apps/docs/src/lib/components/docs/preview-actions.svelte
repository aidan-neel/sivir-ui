<script lang="ts">
    import type { Snippet } from 'svelte';

    let {
        children
    }: {
        children: Snippet;
    } = $props();
</script>

<div class="flex max-w-full items-center gap-0.5">
    {@render children()}
</div>
