<script lang="ts">
    import * as ToggleGroup from '@sivir-ui/svelte/components/toggle-group';
</script>

<ToggleGroup.Root type="multiple" value={['bold']}>
    <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
    <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
    <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
</ToggleGroup.Root>
