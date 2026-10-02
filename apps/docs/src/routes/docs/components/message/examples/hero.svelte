<script lang="ts">
    import ThumbsUp from '@lucide/svelte/icons/thumbs-up';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { CopyButton } from '@sivir-ui/svelte/components/copy-button';
    import { Markdown } from '@sivir-ui/svelte/components/markdown';
    import * as Message from '@sivir-ui/svelte/components/message';
    import * as Reasoning from '@sivir-ui/svelte/components/reasoning';
    import * as Tooltip from '@sivir-ui/svelte/components/tooltip';

    const response = [
        '### Billing API v2',
        '',
        'The release separates invoice adjustments from payment collection and replaces `account_id` with `customer_id`.',
        '',
        '- Update webhook handlers for `invoice.adjusted`.',
        '- Backfill `customer_id` before switching reads.',
        '- Keep v1 retries active during the seven-day overlap.',
        '',
        '> Main migration risk: consumers that infer payment state from invoice updates.'
    ].join('\n');

    let liked = $state(false);
    let status = $state('');
</script>

<div class="w-full max-w-3xl space-y-7">
    <Message.Root from="user">
        <Message.Content>
            Summarize what changed in our billing API and flag the migration work.
        </Message.Content>
    </Message.Root>

    <Message.Root from="assistant">
        <Message.Content class="space-y-3">
            <Reasoning.Root>
                <Reasoning.Trigger title="Reviewed the v2 changelog and migration guide" />
                <Reasoning.Content>
                    <p>Compared the event model, identifier changes, and compatibility window.</p>
                </Reasoning.Content>
            </Reasoning.Root>
            <Markdown content={response} />
        </Message.Content>
        <Message.Actions aria-label="Assistant response actions">
            <CopyButton
                text={response}
                label="Copy"
                copiedLabel="Copied"
                tooltipDelay={500}
                oncopy={() => (status = 'Response copied to clipboard.')}
            />
            <Tooltip.Root delay={500}>
                <Tooltip.Trigger>
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Like"
                        aria-pressed={liked}
                        onclick={() => (liked = !liked)}
                    >
                        <ThumbsUp
                            size={15}
                            fill={liked ? 'currentColor' : 'none'}
                            aria-hidden="true"
                        />
                    </Button>
                </Tooltip.Trigger>
                <Tooltip.Content>Like</Tooltip.Content>
            </Tooltip.Root>
        </Message.Actions>
    </Message.Root>

    <p class="sr-only" role="status">{status}</p>
</div>
