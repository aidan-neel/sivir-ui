<script lang="ts">
    import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger size="md">Edit</DropdownMenu.Trigger>
    <DropdownMenu.Content>
        <DropdownMenu.Item>Rename</DropdownMenu.Item>
        <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
    </DropdownMenu.Content>
</DropdownMenu.Root>
