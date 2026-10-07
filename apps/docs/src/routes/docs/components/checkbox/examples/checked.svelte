<script lang="ts">
    import { Checkbox } from '@sivir-ui/svelte/components/checkbox';

    let darkMode = $state(true);
    let notifications = $state(true);
    let analyticsCookie = $state(false);
</script>

<div class="w-full max-w-md">
    <div class="space-y-4">
        <div
            class="flex items-center justify-between rounded-[var(--radius-md)] border-[length:var(--border-size)] border-border px-3 py-2"
        >
            <Checkbox bind:checked={darkMode} label="Dark mode" />
            <span class="text-xs text-foreground-muted">
                {darkMode ? 'On' : 'Off'}
            </span>
        </div>
        <div
            class="flex items-center justify-between rounded-[var(--radius-md)] border-[length:var(--border-size)] border-border px-3 py-2"
        >
            <Checkbox bind:checked={notifications} label="Push notifications" />
            <span class="text-xs text-foreground-muted">
                {notifications ? 'On' : 'Off'}
            </span>
        </div>
        <div
            class="flex items-center justify-between rounded-[var(--radius-md)] border-[length:var(--border-size)] border-border px-3 py-2"
        >
            <Checkbox bind:checked={analyticsCookie} label="Analytics" />
            <span class="text-xs text-foreground-muted">
                {analyticsCookie ? 'On' : 'Off'}
            </span>
        </div>
    </div>
</div>
