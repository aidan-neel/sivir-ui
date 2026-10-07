<script lang="ts">
    import * as Collapsible from '@sivir-ui/svelte/components/collapsible';
</script>

<div class="flex w-full max-w-md flex-col">
    <Collapsible.Root disabled>
        <Collapsible.Trigger>v0.5.0 release notes (not yet published)</Collapsible.Trigger>
        <Collapsible.Content>Notes appear here when the release ships.</Collapsible.Content>
    </Collapsible.Root>
    <Collapsible.Root>
        <Collapsible.Trigger>v0.4.4 release notes</Collapsible.Trigger>
        <Collapsible.Content>
            Collapsible now ships with a chevron trigger, hover and disabled states, and content
            that lines up with the trigger label.
        </Collapsible.Content>
    </Collapsible.Root>
</div>
