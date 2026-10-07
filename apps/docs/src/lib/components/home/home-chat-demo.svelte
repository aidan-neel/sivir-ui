<script lang="ts">
    import * as Composer from '@sivir-ui/svelte/components/composer';
    import * as Conversation from '@sivir-ui/svelte/components/conversation';
    import { Markdown } from '@sivir-ui/svelte/components/markdown';
    import * as Message from '@sivir-ui/svelte/components/message';
    import * as Reasoning from '@sivir-ui/svelte/components/reasoning';
    import { ResponseStream } from '@sivir-ui/svelte/components/response-stream';
    import { onDestroy } from 'svelte';

    type Turn = {
        id: number;
        prompt: string;
        reply: string;
        thought: string | undefined;
        done: boolean;
    };

    const openingReply = [
        'Your **Team** plan renews on **Oct 14** for **$96**.',
        '',
        'Two seats are unused. Removing them before renewal brings the charge down to **$72**.'
    ].join('\n');

    const seatsReply = [
        'Two people have not used their seat this month:',
        '',
        '- **Priya Shah**, last active Aug 2',
        '- **Leo Martins**, invited Jul 18, never signed in',
        '',
        'Both can be removed without losing any work.'
    ].join('\n');

    const replies = [
        'Done. I removed Priya and Leo, so your next invoice is $72. The change is already on the Billing page.',
        'You can switch to yearly billing at any time. It costs $720 a year, which saves $144 compared with paying monthly.',
        'Invoices go to finance@northwind.dev. You can add a second address under Billing, then Recipients.'
    ];

    let prompt = $state('');
    let turns = $state<Turn[]>([]);
    let timer: ReturnType<typeof setTimeout> | undefined;

    const generating = $derived(
        turns.some((turn) => {
            return !turn.done;
        })
    );

    function submitPrompt(value: string) {
        const id = Date.now();
        const reply = replies[turns.length % replies.length];

        turns = [
            ...turns,
            {
                id,
                prompt: value,
                reply,
                thought: undefined,
                done: false
            }
        ];
        prompt = '';
        clearTimeout(timer);
        timer = setTimeout(() => {
            finishThinking(id);
        }, 900);
    }

    function finishThinking(id: number) {
        turns = turns.map((turn) => {
            if (turn.id !== id) {
                return turn;
            }

            return {
                ...turn,
                thought: '0.9s'
            };
        });
    }

    function finishTurn(id: number) {
        turns = turns.map((turn) => {
            if (turn.id !== id) {
                return turn;
            }

            return {
                ...turn,
                done: true
            };
        });
    }

    function stopResponse() {
        clearTimeout(timer);
        turns = turns.map((turn) => {
            return {
                ...turn,
                thought: turn.thought ?? '0.4s',
                done: true
            };
        });
    }

    onDestroy(() => {
        clearTimeout(timer);
    });
</script>

<section
    aria-label="Billing assistant built with Sivir components"
    class="flex h-[34rem] w-full min-w-0 flex-col overflow-hidden rounded-[var(--radius-xl)] bg-panel shadow-[inset_0_0_0_var(--border-size)_var(--color-border)] lg:h-auto"
>
    <header
        class="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4 [font-size:var(--font-size-body)]"
    >
        <span class="[font-weight:var(--font-weight-label)] text-foreground"
            >Billing assistant</span
        >
        <span class="truncate [font-size:var(--font-size-label)] text-foreground-muted">
            Northwind · Team plan
        </span>
    </header>

    <Conversation.Root class="min-h-0 flex-1">
        <Conversation.Content
            aria-label="Billing assistant conversation"
            transcriptClass="max-w-[36rem]"
        >
            <Message.Root from="user">
                <Message.Content>When does my plan renew, and can I pay less?</Message.Content>
            </Message.Root>

            <Message.Root from="assistant">
                <Message.Content class="space-y-3">
                    <Reasoning.Root>
                        <Reasoning.Trigger summary="Checked the subscription and seat usage" />
                        <Reasoning.Content>
                            <p>
                                Read the Team plan, its renewal date, and who used a seat this
                                month.
                            </p>
                        </Reasoning.Content>
                    </Reasoning.Root>
                    <Markdown content={openingReply} />
                </Message.Content>
            </Message.Root>

            <Message.Root from="user">
                <Message.Content>Who isn't using their seat?</Message.Content>
            </Message.Root>

            <Message.Root from="assistant">
                <Message.Content class="space-y-3">
                    <Reasoning.Root duration={1}>
                        <Reasoning.Trigger />
                    </Reasoning.Root>
                    <Markdown content={seatsReply} />
                </Message.Content>
            </Message.Root>

            {#each turns as turn (turn.id)}
                <Message.Root from="user">
                    <Message.Content>{turn.prompt}</Message.Content>
                </Message.Root>

                <Message.Root from="assistant" status={turn.done ? 'idle' : 'streaming'}>
                    <Message.Content class="space-y-3">
                        <Reasoning.Root streaming={!turn.thought}>
                            <Reasoning.Trigger />
                            <Reasoning.Content>
                                <p>Checked the billing settings this request touches.</p>
                            </Reasoning.Content>
                        </Reasoning.Root>
                        {#if turn.thought}
                            <ResponseStream
                                textStream={turn.reply}
                                speed={40}
                                onComplete={() => {
                                    finishTurn(turn.id);
                                }}
                            />
                        {/if}
                    </Message.Content>
                </Message.Root>
            {/each}
        </Conversation.Content>
        <Conversation.ScrollButton />
    </Conversation.Root>

    <div class="mx-auto w-full max-w-[36rem] shrink-0 px-4 pb-4 sm:px-6">
        <Composer.Root
            bind:value={prompt}
            {generating}
            onSubmit={submitPrompt}
            onStop={stopResponse}
        >
            <Composer.Input
                aria-label="Message"
                placeholder={turns.length > 0 ? 'Ask a follow-up' : 'Remove both seats'}
            />
            <Composer.Toolbar>
                <div class="ml-auto">
                    <Composer.Submit />
                </div>
            </Composer.Toolbar>
        </Composer.Root>
    </div>
</section>
