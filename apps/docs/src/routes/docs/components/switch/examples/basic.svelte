<script lang="ts">
    import { Switch } from '@sivir-ui/svelte/components/switch';

    let emailNotifications = $state(true);
    let smsNotifications = $state(false);
</script>

<div class="w-full max-w-xs space-y-3 rounded-lg border border-border bg-surface p-4">
    <p class="text-sm font-medium text-foreground">Notifications</p>
    <div class="space-y-2">
        <Switch bind:checked={emailNotifications} label="Email notifications" />
        <Switch bind:checked={smsNotifications} label="Text message alerts" />
    </div>
</div>
