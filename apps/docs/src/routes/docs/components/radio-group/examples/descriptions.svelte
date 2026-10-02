<script lang="ts">
    import * as RadioGroup from '@sivir-ui/svelte/components/radio-group';

    let value = $state<string | undefined>('internal');
</script>

<RadioGroup.Root bind:value name="visibility">
    <RadioGroup.Item value="private" label="Private" description="Only you can open it." />
    <RadioGroup.Item
        value="internal"
        label="Internal"
        description="Anyone in your workspace can view it."
    />
    <RadioGroup.Item
        value="public"
        label="Public"
        description="Anyone with the link can view it."
    />
</RadioGroup.Root>
