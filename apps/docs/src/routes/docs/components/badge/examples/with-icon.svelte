<script lang="ts">
    import AlertCircle from '@lucide/svelte/icons/alert-circle';
    import Check from '@lucide/svelte/icons/check';
    import Clock from '@lucide/svelte/icons/clock';
    import { Badge } from '@sivir-ui/svelte/components/badge';
</script>

<div class="w-full max-w-md flex flex-col gap-3">
    <div class="flex items-center justify-between">
        <span class="text-sm">Backup complete</span>
        <Badge variant="success" icon={Check}>Done</Badge>
    </div>
    <div class="flex items-center justify-between">
        <span class="text-sm">Scheduled maintenance</span>
        <Badge variant="info" icon={Clock}>Scheduled</Badge>
    </div>
    <div class="flex items-center justify-between">
        <span class="text-sm">Critical issue</span>
        <Badge variant="error" icon={AlertCircle}>Alert</Badge>
    </div>
</div>
