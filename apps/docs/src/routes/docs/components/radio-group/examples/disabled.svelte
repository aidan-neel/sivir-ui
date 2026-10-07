<script lang="ts">
    import * as RadioGroup from '@sivir-ui/svelte/components/radio-group';
</script>

<div class="flex flex-col gap-3">
    <RadioGroup.Root disabled name="plan">
        <RadioGroup.Item
            value="starter"
            label="Starter"
            description="Read and write access. $29/month per seat."
        />
        <RadioGroup.Item
            value="pro"
            label="Professional"
            description="Admin access and audit logs. $99/month per seat."
        />
        <RadioGroup.Item
            value="enterprise"
            label="Enterprise"
            description="Custom features, dedicated support. Contact sales."
        />
    </RadioGroup.Root>
    <p class="text-xs text-foreground-muted">
        Plan selection is locked while billing information is processing.
    </p>
</div>
