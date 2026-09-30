<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import { Textarea } from '@sivir-ui/svelte/components/textarea';

    let open = $state(false);
    let feedback = $state('');

    function send(event: SubmitEvent) {
        event.preventDefault();
        feedback = '';
        open = false;
    }
</script>

<Popover.Root bind:open placement="bottom-start">
    <Popover.Trigger variant="outline" size="md">Feedback</Popover.Trigger>
    <Popover.Content class="w-80 max-w-[calc(100vw-2rem)]">
        <form class="flex flex-col gap-3" onsubmit={send}>
            <Popover.Title>Send feedback</Popover.Title>
            <Textarea
                bind:value={feedback}
                rows={4}
                placeholder="What’s working, and what isn’t?"
                aria-label="Feedback"
            />
            <div class="flex items-center justify-between gap-3">
                <p class="m-0 text-xs text-foreground-muted">Read by the Sivir team.</p>
                <Button type="submit" size="sm" disabled={!feedback.trim()}>Send</Button>
            </div>
        </form>
    </Popover.Content>
</Popover.Root>
