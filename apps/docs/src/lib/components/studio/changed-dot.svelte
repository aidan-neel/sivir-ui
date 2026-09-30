<script lang="ts">
    let { changed }: { changed: boolean } = $props();
</script>

{#if changed}
    <span
        class="size-1.5 shrink-0 rounded-full bg-[var(--color-primary)]"
        aria-hidden="true"
    ></span>
    <span class="sr-only">(changed)</span>
{/if}
