<script lang="ts">
    import * as Collapsible from '@sivir-ui/svelte/components/collapsible';

    let {
        open = $bindable(true),
        disabled = false
    }: {
        open?: boolean;
        disabled?: boolean;
    } = $props();

    const files = [
        'collapsible-trigger.svelte',
        'collapsible-content.svelte',
        'manifest.ts',
        '+page.svelte'
    ];
</script>

<div class="w-full max-w-md">
    <Collapsible.Root bind:open {disabled}>
        <Collapsible.Trigger>{files.length} files changed</Collapsible.Trigger>
        <Collapsible.Content>
            <ul class="m-0 flex list-none flex-col gap-1.5 p-0">
                {#each files as file (file)}
                    <li class="truncate font-mono text-[0.875em] text-foreground">{file}</li>
                {/each}
            </ul>
        </Collapsible.Content>
    </Collapsible.Root>
</div>
