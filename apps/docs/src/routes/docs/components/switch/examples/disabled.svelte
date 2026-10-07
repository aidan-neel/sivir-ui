<script lang="ts">
    import { Switch } from '@sivir-ui/svelte/components/switch';

    let syncWifi = $state(true);
</script>

<div class="w-full max-w-sm space-y-3 rounded-lg border border-border bg-surface p-4">
    <p class="text-sm font-medium text-foreground">Sync</p>
    <div class="space-y-3">
        <Switch bind:checked={syncWifi} label="Sync over Wi-Fi" />
        <Switch
            disabled
            label="Sync over cellular"
            description="Upgrade to Pro to enable background sync on mobile networks."
        />
    </div>
</div>
