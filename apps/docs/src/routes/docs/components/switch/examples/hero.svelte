<script lang="ts">
    import { Switch } from '@sivir-ui/svelte/components/switch';
    import { switchContent } from '../playground/playground';

    let {
        label = true,
        description = false,
        disabled = false
    }: {
        label?: boolean;
        description?: boolean;
        disabled?: boolean;
    } = $props();

    let enabled = $state(true);
</script>

<Switch
    bind:checked={enabled}
    label={label ? switchContent.label : undefined}
    description={description ? switchContent.description : undefined}
    aria-label={label ? undefined : switchContent.label}
    {disabled}
/>
