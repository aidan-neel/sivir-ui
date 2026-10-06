<script lang="ts">
    import { Checkbox } from '@sivir-ui/svelte/components/checkbox';

    let emailMarketing = $state(true);
    let emailUpdates = $state(true);
    let emailSecurity = $state(true);
</script>

<div class="w-full max-w-md">
    <div class="mb-4">
        <h3 class="text-foreground [font-weight:var(--font-weight-label,500)]">
            Email preferences
        </h3>
    </div>
    <div class="space-y-4">
        <Checkbox
            bind:checked={emailMarketing}
            label="Product news"
            description="Be the first to hear about new features and updates"
        />
        <Checkbox
            bind:checked={emailUpdates}
            label="Tips and tutorials"
            description="Learn best practices and improve your workflow"
        />
        <Checkbox
            bind:checked={emailSecurity}
            label="Security alerts"
            description="Receive important notifications about your account"
        />
    </div>
</div>
