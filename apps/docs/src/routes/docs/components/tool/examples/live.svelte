<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Tool from '@sivir-ui/svelte/components/tool';
    import { onMount } from 'svelte';

    type Step = {
        id: string;
        title: string;
        liveAction: string;
        doneAction: string;
        target: string;
        ms: number;
    };

    const steps: Step[] = [
        {
            id: 'search',
            title: 'Searching the codebase',
            liveAction: 'Searching',
            doneAction: 'Search',
            target: 'refund_status',
            ms: 1200
        },
        {
            id: 'read',
            title: 'Reading 1 file',
            liveAction: 'Reading file',
            doneAction: 'Read file',
            target: 'src/billing/refunds.ts',
            ms: 900
        },
        {
            id: 'test',
            title: 'Running 1 command',
            liveAction: 'Running',
            doneAction: 'Run',
            target: 'bun test refunds',
            ms: 2100
        }
    ];
    const total = steps.reduce((sum, step) => {
        return sum + step.ms;
    }, 0);

    let elapsed = $state(0);

    const calls = $derived.by(() => {
        let start = 0;

        return steps.flatMap((step) => {
            const end = start + step.ms;
            const begun = elapsed >= start;
            const active = elapsed < end;
            const spent = Math.min(elapsed, end) - start;
            start = end;

            if (!begun) {
                return [];
            }

            return [
                {
                    id: step.id,
                    title: step.title,
                    action: active ? step.liveAction : step.doneAction,
                    target: step.target,
                    running: active,
                    duration: formatSeconds(spent)
                }
            ];
        });
    });
    const running = $derived(elapsed < total);
    const title = $derived.by(() => {
        const current = calls.find((call) => {
            return call.running;
        });

        return current?.title ?? 'Searched once, read 1 file, ran 1 command';
    });

    function formatSeconds(ms: number) {
        return `${(ms / 1000).toFixed(1)}s`;
    }

    function replay() {
        elapsed = 0;
    }

    onMount(() => {
        const id = setInterval(() => {
            if (elapsed < total) {
                elapsed = Math.min(total, elapsed + 100);
            }
        }, 100);

        return () => {
            clearInterval(id);
        };
    });
</script>

<div class="flex w-full max-w-xl flex-col items-start gap-4">
    <Tool.Root state={running ? 'running' : 'complete'} open class="w-full">
        <Tool.Trigger {title} duration={formatSeconds(elapsed)} />
        <Tool.Content>
            {#each calls as call (call.id)}
                <Tool.Call
                    action={call.action}
                    target={call.target}
                    state={call.running ? 'running' : 'complete'}
                    duration={call.duration}
                />
            {/each}
        </Tool.Content>
    </Tool.Root>
    <Button variant="secondary" size="sm" disabled={running} onclick={replay}>Replay</Button>
</div>
