<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import { toast } from '@sivir-ui/svelte/components/toast';
    import * as Typography from '@sivir-ui/svelte/components/typography';
</script>

<div class="flex flex-col gap-2">
    <div>
        <Typography.Metadata class="block mb-2">Trigger toast notifications:</Typography.Metadata>
        <div class="flex flex-wrap gap-2">
            <Button
                variant="outline"
                onclick={() =>
                    toast({ title: 'Link copied', description: 'Paste it anywhere.' })}
            >
                Copy link
            </Button>
            <Button
                onclick={() =>
                    toast.success('Saved', { description: 'Your draft was saved automatically.' })}
            >
                Save
            </Button>
            <Button
                variant="outline"
                onclick={() =>
                    toast.error('Upload failed', { description: 'The file is too large. Max 50 MB.' })}
            >
                Upload (error)
            </Button>
            <Button
                variant="outline"
                onclick={() =>
                    toast.warning('Trial ends soon', { description: 'Upgrade in 7 days to keep using pro features.' })}
            >
                Trial info
            </Button>
            <Button
                variant="outline"
                onclick={() => toast.info('New feature available', { description: 'Reload to see the latest updates.' })}
            >
                Info
            </Button>
        </div>
    </div>
</div>
