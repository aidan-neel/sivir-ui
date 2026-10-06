<script lang="ts">
    import { Label } from '@sivir-ui/svelte/components/label';
    import type { Snippet } from 'svelte';

    let {
        label,
        for: forId,
        children
    }: {
        label: string;
        for?: string;
        children: Snippet;
    } = $props();
</script>

<div class="flex min-h-8 items-center justify-between gap-3">
    {#if forId}
        <Label
            for={forId}
            class="flex-1 self-stretch content-center leading-normal hover:cursor-[var(--ui-cursor-interactive)]"
        >
            {label}
        </Label>
    {:else}
        <span
            class="[font-size:var(--font-size-label)] [font-weight:var(--font-weight-label)] leading-normal text-foreground"
        >
            {label}
        </span>
    {/if}
    {@render children()}
</div>
