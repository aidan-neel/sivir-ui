<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Composer from '@sivir-ui/svelte/components/composer';
    import * as Conversation from '@sivir-ui/svelte/components/conversation';
    import * as Message from '@sivir-ui/svelte/components/message';
    import type { QuestionAnswer } from '@sivir-ui/svelte/components/question';
    import * as Question from '@sivir-ui/svelte/components/question';

    let asking = $state(true);
    let answer = $state<QuestionAnswer>();
    let draft = $state('Keep the migration reversible.');
    let sentPrompt = $state('');
    let shouldFocusQuestion = $state(false);

    function answerQuestion(value: QuestionAnswer) {
        answer = value;
        asking = false;
    }

    function sendPrompt(value: string) {
        sentPrompt = value;
        draft = '';
    }
</script>

<div
    class="flex h-[34rem] w-full max-w-3xl flex-col gap-3 rounded-[var(--radius-xl)] border border-border bg-panel p-3"
>
    <Conversation.Root class="min-h-0 flex-1">
        <Conversation.Content aria-label="Migration planning conversation">
            <Message.Root from="user">
                <Message.Content>
                    Write the migration that renames account_id to customer_id. Don't run it in
                    production yet.
                </Message.Content>
            </Message.Root>
            <Message.Root from="assistant">
                <Message.Content>
                    The migration and its rollback are ready. Which environment should run it first?
                </Message.Content>
            </Message.Root>
            {#if answer}
                <Message.Root from="user">
                    <Message.Content>
                        Use {Array.isArray(answer) ? answer.join(', ') : answer}.
                    </Message.Content>
                </Message.Root>
            {/if}
            {#if sentPrompt}
                <Message.Root from="user">
                    <Message.Content>{sentPrompt}</Message.Content>
                </Message.Root>
            {/if}
        </Conversation.Content>
        <Conversation.ScrollButton />
    </Conversation.Root>

    <div>
        {#if asking}
            <Question.Root
                variant="inset"
                bind:value={answer}
                autofocus={shouldFocusQuestion}
                onSubmit={answerQuestion}
            >
                <Question.Content>
                    <Question.Title>Where should I run the migration first?</Question.Title>
                    <Question.Description>
                        I'll stop after the first run and report the row counts.
                    </Question.Description>
                    <Question.Options>
                        <Question.Option
                            value="preview"
                            label="Preview environment"
                            description="A disposable database copy that resets nightly."
                        />
                        <Question.Option
                            value="staging"
                            label="Staging environment"
                            description="Shared with QA and seeded weekly from production."
                        />
                    </Question.Options>
                </Question.Content>
                <Question.Actions>
                    <Question.Cancel onclick={() => (asking = false)}
                        >Skip question</Question.Cancel
                    >
                    <Question.Submit />
                </Question.Actions>
            </Question.Root>
        {:else}
            <Composer.Root bind:value={draft} onSubmit={sendPrompt}>
                <Composer.Input aria-label="Message the agent" />
                <Composer.Toolbar>
                    <Composer.Actions>
                        <Button
                            variant="quiet"
                            size="md"
                            onclick={() => {
                                shouldFocusQuestion = true;
                                asking = true;
                            }}
                        >
                            Ask again
                        </Button>
                    </Composer.Actions>
                    <Composer.Submit />
                </Composer.Toolbar>
            </Composer.Root>
        {/if}
    </div>
</div>
