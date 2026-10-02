<script lang="ts">
    import * as Collapsible from '@sivir-ui/svelte/components/collapsible';

    let open = $state(false);
</script>

<div class="w-full max-w-md">
    <Collapsible.Root bind:open>
        <Collapsible.Trigger>Advanced settings</Collapsible.Trigger>
        <Collapsible.Content
            >Request timeout is 30 seconds. Failed requests retry up to 3 times.</Collapsible.Content
        >
    </Collapsible.Root>
</div>
