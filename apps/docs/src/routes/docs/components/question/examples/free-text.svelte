<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Question from '@sivir-ui/svelte/components/question';

    let answer = $state('');
    let submitted = $state('');
    let showFeedback = $state(false);
</script>

<div class="flex w-full max-w-2xl flex-col gap-3">
    {#if !showFeedback}
        <Question.Root
            variant="inset"
            type="text"
            bind:value={answer}
            onSubmit={(value) => {
                submitted = Array.isArray(value) ? value.join(', ') : value;
                showFeedback = true;
            }}
        >
            <Question.Content>
                <Question.Title>What is the main issue you encountered?</Question.Title>
                <Question.Description>
                    Describe the problem in detail so the investigation can focus on the right area.
                </Question.Description>
                <Question.Input
                    placeholder="Example: Build fails with 'module not found' error when running bun build"
                />
            </Question.Content>
            <Question.Actions>
                <Question.Submit />
            </Question.Actions>
        </Question.Root>
    {:else}
        <div class="rounded-[var(--radius-lg)] border border-border bg-panel/60 p-4 shadow-xs">
            <p class="mb-2 text-sm font-medium">Reported issue:</p>
            <p class="text-sm text-foreground-muted">{submitted}</p>
            <Button
                variant="ghost"
                class="mt-4 w-full"
                onclick={() => {
                    showFeedback = false;
                    submitted = '';
                    answer = '';
                }}
            >
                Report another issue
            </Button>
        </div>
    {/if}
</div>
