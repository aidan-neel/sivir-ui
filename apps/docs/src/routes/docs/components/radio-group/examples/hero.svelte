<script lang="ts">
    import * as RadioGroup from '@sivir-ui/svelte/components/radio-group';
    import { radioGroupOptions } from '../playground/playground';

    let {
        value = $bindable('default'),
        disabled = false,
        descriptions = false
    }: {
        value?: string;
        disabled?: boolean;
        descriptions?: boolean;
    } = $props();
</script>

<RadioGroup.Root bind:value name="option" {disabled}>
    {#each radioGroupOptions as option (option.value)}
        <RadioGroup.Item
            value={option.value}
            label={option.label}
            description={descriptions ? option.description : undefined}
        />
    {/each}
</RadioGroup.Root>
