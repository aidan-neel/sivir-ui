<script lang="ts">
    import { Badge } from '@sivir-ui/svelte/components/badge';
</script>

<div class="w-full max-w-md flex flex-col gap-3">
    <div class="flex items-center justify-between">
        <span class="text-sm">Server status</span>
        <Badge variant="success" dot>Online</Badge>
    </div>
    <div class="flex items-center justify-between">
        <span class="text-sm">Database</span>
        <Badge variant="warning" dot>Syncing</Badge>
    </div>
    <div class="flex items-center justify-between">
        <span class="text-sm">API</span>
        <Badge variant="destructive" dot>Offline</Badge>
    </div>
</div>
