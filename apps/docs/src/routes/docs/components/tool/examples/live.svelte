<script lang="ts">
    import FileText from '@lucide/svelte/icons/file-text';
    import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
    import Search from '@lucide/svelte/icons/search';
    import Terminal from '@lucide/svelte/icons/terminal';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { Spinner } from '@sivir-ui/svelte/components/spinner';
    import * as Tool from '@sivir-ui/svelte/components/tool';
    import { onDestroy, onMount } from 'svelte';

    type Step = {
        id: string;
        status: string;
        liveAction: string;
        doneAction: string;
        target: string;
        kind: 'search' | 'read' | 'run';
        ms: number;
    };

    const steps: Step[] = [
        {
            id: 'search',
            status: 'Searching the codebase',
            liveAction: 'Searching',
            doneAction: 'Searched',
            target: 'refund_status',
            kind: 'search',
            ms: 1200
        },
        {
            id: 'read',
            status: 'Reading 1 file',
            liveAction: 'Reading',
            doneAction: 'Read',
            target: 'src/billing/refunds.ts',
            kind: 'read',
            ms: 900
        },
        {
            id: 'test',
            status: 'Running tests',
            liveAction: 'Running',
            doneAction: 'Ran',
            target: 'bun test refunds',
            kind: 'run',
            ms: 2100
        }
    ];

    let started = $state(0);
    let finished = $state(0);
    let timer: ReturnType<typeof setTimeout> | undefined;

    const running = $derived(finished < steps.length);
    const status = $derived(steps[Math.min(started, steps.length) - 1]?.status ?? 'Working');

    function next() {
        if (started > finished) {
            finished += 1;
        }
        if (started === steps.length) {
            return;
        }

        started += 1;
        timer = setTimeout(next, steps[started - 1].ms);
    }

    function replay() {
        clearTimeout(timer);
        started = 0;
        finished = 0;
        timer = setTimeout(next, 300);
    }

    onMount(() => {
        timer = setTimeout(next, 300);
    });

    onDestroy(() => {
        clearTimeout(timer);
    });
</script>

<div class="flex w-full max-w-xl flex-col items-start gap-4">
    <Tool.Root {running} class="w-full">
        <Tool.Trigger {status} summary="Searched once, read 1 file, ran tests" />
        <Tool.Content>
            {#each steps.slice(0, started) as step, index (step.id)}
                {@const live = index >= finished}
                <Tool.Call
                    action={live ? step.liveAction : step.doneAction}
                    target={step.target}
                    state={live ? 'running' : 'complete'}
                >
                    {#snippet icon()}
                        {#if live}
                            <Spinner size={14} aria-hidden="true" />
                        {:else if step.kind === 'search'}
                            <Search />
                        {:else if step.kind === 'read'}
                            <FileText />
                        {:else}
                            <Terminal />
                        {/if}
                    {/snippet}
                </Tool.Call>
            {/each}
        </Tool.Content>
    </Tool.Root>
    <Button variant="outline" size="sm" disabled={running} onclick={replay}>
        <RotateCcw aria-hidden="true" />
        Replay
    </Button>
</div>
