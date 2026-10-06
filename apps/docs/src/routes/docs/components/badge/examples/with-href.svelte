<script lang="ts">
    import { Badge } from '@sivir-ui/svelte/components/badge';
</script>

<div class="w-full max-w-md flex flex-col gap-3">
    <div class="flex items-center gap-2">
        <span class="text-sm">Tags:</span>
        <Badge href="#" variant="secondary">Svelte</Badge>
        <Badge href="#" variant="outline">UI</Badge>
        <Badge href="#" variant="primary">Components</Badge>
    </div>
    <div class="flex items-center gap-2">
        <span class="text-sm">Filters:</span>
        <Badge href="#" variant="info">Recent</Badge>
        <Badge href="#" variant="success">Verified</Badge>
    </div>
</div>
