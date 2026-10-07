<script lang="ts">
    import { Checkbox } from '@sivir-ui/svelte/components/checkbox';
</script>

<div class="w-full max-w-md">
    <div class="mb-4">
        <h3 class="text-foreground [font-weight:var(--font-weight-label,500)]">Access control</h3>
    </div>
    <div class="space-y-3">
        <Checkbox label="Edit project settings" description="Full admin access" checked={true} />
        <Checkbox
            label="Manage members"
            description="Add, remove, and edit team members"
            checked={true}
        />
        <Checkbox
            label="Export data"
            description="This option is disabled by organization policy"
            disabled
            checked={false}
        />
    </div>
</div>
