<script lang="ts">
    import type { QuestionAnswer } from '@sivir-ui/svelte/components/question';
    import * as Question from '@sivir-ui/svelte/components/question';

    let answer = $state<QuestionAnswer>([]);
    let summary = $state('');

    const capabilities = [
        {
            value: 'voice',
            label: 'Voice input',
            description: 'Users can speak commands and questions aloud.'
        },
        {
            value: 'video',
            label: 'Video output',
            description: 'Responses include visual demos and annotated screenshots.'
        },
        {
            value: 'offline',
            label: 'Offline mode',
            description: 'Cache conversations locally; sync when reconnected.'
        },
        {
            value: 'sharing',
            label: 'Share conversations',
            description: 'Generate shareable links with optional access controls.'
        }
    ];
</script>

<div class="flex w-full max-w-2xl flex-col gap-3">
    <Question.Root
        variant="inset"
        type="multiple"
        bind:value={answer}
        onSubmit={(value) => {
            summary = Array.isArray(value) ? value.join(', ') : value;
        }}
    >
        <Question.Content>
            <Question.Title>Which features should I build first?</Question.Title>
            <Question.Description>
                Select each feature to include in the 0.2.0 release.
            </Question.Description>
            <Question.Options>
                {#each capabilities as capability (capability.value)}
                    <Question.Option {...capability} />
                {/each}
            </Question.Options>
        </Question.Content>
        <Question.Actions>
            <Question.Submit
                label={`Add ${Array.isArray(answer) ? answer.length : 0} feature${Array.isArray(answer) && answer.length !== 1 ? 's' : ''}`}
            />
        </Question.Actions>
    </Question.Root>

    <p class="min-h-5 text-sm text-foreground-muted" role="status">
        {summary ? `Selected: ${summary}` : 'No features selected'}
    </p>
</div>
