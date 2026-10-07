<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Reasoning from '@sivir-ui/svelte/components/reasoning';
    import { ResponseStream } from '@sivir-ui/svelte/components/response-stream';

    const steps = [
        {
            title: 'Reading the release history',
            body: 'Release web-2418 shipped at 13:58 UTC, two minutes before the first error.'
        },
        {
            title: 'Sampling current errors',
            body: 'Every failing request times out in the address-verification call.'
        },
        {
            title: 'Checking the provider status',
            body: 'The provider reports no incident, so the new synchronous call is the likely cause.'
        }
    ];

    let run = $state(0);
    let shown = $state(1);
    let done = $state(0);
    let streaming = $state(true);

    const status = $derived(streaming ? steps[shown - 1].title : undefined);

    function next() {
        done += 1;

        if (done < steps.length) {
            shown += 1;

            return;
        }

        streaming = false;
    }

    function replay() {
        shown = 1;
        done = 0;
        streaming = true;
        run += 1;
    }
</script>

<div class="flex w-full max-w-xl flex-col items-start gap-4">
    <Reasoning.Root {streaming}>
        <Reasoning.Trigger {status} />
        <Reasoning.Content>
            {#key run}
                <Reasoning.Steps>
                    {#each steps.slice(0, shown) as step, index (step.title)}
                        <Reasoning.Step
                            title={step.title}
                            status={index < done ? 'complete' : 'active'}
                        >
                            <ResponseStream
                                textStream={step.body}
                                speed={8}
                                class="text-sm font-normal text-foreground-muted"
                                onComplete={next}
                            />
                        </Reasoning.Step>
                    {/each}
                </Reasoning.Steps>
            {/key}
        </Reasoning.Content>
    </Reasoning.Root>
    <Button variant="ghost" disabled={streaming} onclick={replay}>Replay</Button>
</div>
