<script lang="ts">
    import FileText from '@lucide/svelte/icons/file-text';
    import * as Sidebar from '@sivir-ui/svelte/components/sidebar';

    let sharedOpen = $state(false);
</script>

<Sidebar.Root collapsible="none" class="h-96 rounded-[var(--radius-xl)] border border-border">
    <Sidebar.Panel>
        <Sidebar.Content>
            <Sidebar.Group collapsible>
                <Sidebar.GroupLabel>Private</Sidebar.GroupLabel>
                <Sidebar.GroupContent>
                    {@render pageList(['Reading list', 'Habit tracker', 'Weekly to-do list'])}
                </Sidebar.GroupContent>
            </Sidebar.Group>
            <Sidebar.Group collapsible bind:open={sharedOpen}>
                <Sidebar.GroupLabel>Shared</Sidebar.GroupLabel>
                <Sidebar.GroupContent>
                    {@render pageList(['Team wiki', 'Launch checklist'])}
                </Sidebar.GroupContent>
            </Sidebar.Group>
        </Sidebar.Content>
    </Sidebar.Panel>
    <Sidebar.Inset>
        <p class="p-5 text-foreground-muted">Shared is {sharedOpen ? 'expanded' : 'collapsed'}.</p>
    </Sidebar.Inset>
</Sidebar.Root>

{#snippet pageList(pages: string[])}
    <Sidebar.Menu>
        {#each pages as page (page)}
            <Sidebar.Item>
                <Sidebar.ItemButton>
                    <FileText aria-hidden="true" />
                    <Sidebar.ItemLabel>{page}</Sidebar.ItemLabel>
                </Sidebar.ItemButton>
            </Sidebar.Item>
        {/each}
    </Sidebar.Menu>
{/snippet}
