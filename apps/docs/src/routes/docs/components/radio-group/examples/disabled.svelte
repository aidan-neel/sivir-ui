<script lang="ts">
    import * as RadioGroup from '@sivir-ui/svelte/components/radio-group';
</script>

<RadioGroup.Root disabled name="billing">
    <RadioGroup.Item value="monthly" label="Monthly billing" />
    <RadioGroup.Item value="annual" label="Annual billing" />
</RadioGroup.Root>
