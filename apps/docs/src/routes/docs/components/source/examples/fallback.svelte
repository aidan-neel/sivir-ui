<script lang="ts">
    import * as Source from '@sivir-ui/svelte/components/source';
</script>

<div class="flex max-w-xl flex-wrap gap-1.5">
    <Source.Root href="https://example.com/handbook">
        <Source.Icon fallback="Handbook" />
        <Source.Label>Handbook</Source.Label>
    </Source.Root>
    <Source.Root href="https://example.com/status">
        <Source.Icon />
        <Source.Label>status.example.com</Source.Label>
    </Source.Root>
</div>
