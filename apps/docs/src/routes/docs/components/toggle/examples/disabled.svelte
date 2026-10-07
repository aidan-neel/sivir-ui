<script lang="ts">
    import Edit from '@lucide/svelte/icons/edit';
    import { Toggle } from '@sivir-ui/svelte/components/toggle';
</script>

<div class="flex items-center gap-2">
    <Toggle aria-label="Edit">
        <Edit size={14} />
    </Toggle>
    <Toggle disabled aria-label="More options (upgrade required)">
        <Edit size={14} />
    </Toggle>
</div>
