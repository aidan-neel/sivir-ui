<script lang="ts">
    import Bold from '@lucide/svelte/icons/bold';
    import { Toggle } from '@sivir-ui/svelte/components/toggle';
</script>

<div class="flex gap-2">
    <Toggle size="sm" aria-label="Bold">
        <Bold size={12} />
    </Toggle>
    <Toggle aria-label="Bold">
        <Bold size={14} />
    </Toggle>
    <Toggle size="lg" aria-label="Bold">
        <Bold size={16} />
    </Toggle>
</div>
