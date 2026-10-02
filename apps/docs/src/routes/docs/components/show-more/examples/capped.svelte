<script lang="ts">
    import { ShowMore } from '@sivir-ui/svelte/components/show-more';

    const entries = [
        '2.9.0: Adds keyboard shortcuts for archiving and snoozing threads.',
        '2.8.2: Fixes attachments over 25 MB failing to upload in Safari.',
        '2.8.1: Restores unread counts after switching workspaces.',
        '2.8.0: Adds scheduled send with a time zone picker.',
        '2.7.3: Fixes search skipping messages older than one year.',
        '2.7.2: Reduces memory use in threads with more than 500 replies.',
        '2.7.1: Fixes drafts being lost when the laptop wakes from sleep.',
        '2.7.0: Adds shared labels for team inboxes.',
        '2.6.1: Fixes calendar invites showing the wrong time zone.',
        '2.6.0: Adds a dark theme.'
    ];
</script>

<ShowMore lines={2} maxHeight={112} label="Release notes">
    <div class="flex flex-col gap-2">
        {#each entries as entry (entry)}
            <p>{entry}</p>
        {/each}
    </div>
</ShowMore>
