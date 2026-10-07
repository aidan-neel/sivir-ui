<script lang="ts">
    import { Checkbox } from '@sivir-ui/svelte/components/checkbox';

    let {
        variant = 'default',
        checked = $bindable(false),
        description = false,
        disabled = false
    }: {
        variant?: 'default' | 'primary';
        checked?: boolean;
        description?: boolean;
        disabled?: boolean;
    } = $props();
</script>

<Checkbox
    {variant}
    bind:checked
    label="Accept terms of service"
    description={description ? 'Required to create an account.' : undefined}
    {disabled}
/>
