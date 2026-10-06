<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Reasoning from '@sivir-ui/svelte/components/reasoning';
    import { ResponseStream } from '@sivir-ui/svelte/components/response-stream';

    const trace =
        'I need the release history, current error sample, and payment-provider status before I can recommend a rollback.';

    let run = $state(0);
    let streaming = $state(true);
    let startedAt = $state(Date.now());
    let now = $state(Date.now());
    const duration = $derived(`${((now - startedAt) / 1000).toFixed(1)}s`);

    $effect(() => {
        if (!streaming) {
            return;
        }

        const timer = setInterval(() => {
            now = Date.now();
        }, 100);

        return () => {
            clearInterval(timer);
        };
    });

    function replay() {
        startedAt = Date.now();
        now = startedAt;
        streaming = true;
        run += 1;
    }
</script>

<div class="flex w-full max-w-xl flex-col items-start gap-4">
    <Reasoning.Root {streaming} open>
        <Reasoning.Trigger {duration} />
        <Reasoning.Content>
            {#key run}
                <ResponseStream
                    textStream={trace}
                    speed={6}
                    class="text-foreground-muted"
                    onComplete={() => {
                        now = Date.now();
                        streaming = false;
                    }}
                />
            {/key}
        </Reasoning.Content>
    </Reasoning.Root>
    <Button variant="ghost" disabled={streaming} onclick={replay}>Replay</Button>
</div>
