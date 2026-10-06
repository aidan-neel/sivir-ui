<script lang="ts">
    import * as Avatar from '@sivir-ui/svelte/components/avatar';
    import * as Message from '@sivir-ui/svelte/components/message';
    import { type MessageEntry, type MessageSettings, messageEntries } from './playground';

    let {
        settings
    }: {
        settings: MessageSettings;
    } = $props();

    function statusFor(entry: MessageEntry) {
        return entry.from === 'assistant' ? settings.status : 'idle';
    }

    function avatarFor(entry: MessageEntry) {
        if (!settings.avatar) {
            return undefined;
        }
        return entry.from === 'assistant' ? assistantAvatar : userAvatar;
    }
</script>

{#snippet assistantAvatar()}
    <Avatar.Root size="sm">
        <Avatar.Fallback>{messageEntries[0].initials}</Avatar.Fallback>
    </Avatar.Root>
{/snippet}

{#snippet userAvatar()}
    <Avatar.Root size="sm">
        <Avatar.Fallback>{messageEntries[1].initials}</Avatar.Fallback>
    </Avatar.Root>
{/snippet}

<div class="w-[min(42rem,calc(100vw-5rem))] space-y-7">
    {#each messageEntries as entry (entry.from)}
        <Message.Root
            from={entry.from}
            status={statusFor(entry)}
            name={settings.name ? entry.name : undefined}
            timestamp={settings.timestamp ? entry.timestamp : undefined}
            avatar={avatarFor(entry)}
        >
            <Message.Content>{entry.text}</Message.Content>
        </Message.Root>
    {/each}
</div>
