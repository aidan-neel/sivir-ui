<script lang="ts">
    import * as Collapsible from '@sivir-ui/svelte/components/collapsible';

    let open = $state(false);
</script>

<div class="w-full max-w-md">
    <Collapsible.Root bind:open>
        <Collapsible.Trigger>
            {open ? 'Hide advanced settings' : 'Show advanced settings'}
        </Collapsible.Trigger>
        <Collapsible.Content>
            <dl class="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2">
                <dt>Request timeout</dt>
                <dd class="m-0 text-foreground tabular-nums">30 seconds</dd>
                <dt>Retries</dt>
                <dd class="m-0 text-foreground tabular-nums">3 attempts</dd>
                <dt>Backoff</dt>
                <dd class="m-0 text-foreground">Exponential</dd>
            </dl>
        </Collapsible.Content>
    </Collapsible.Root>
</div>
