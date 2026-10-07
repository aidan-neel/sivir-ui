<script lang="ts">
    import ArrowRight from '@lucide/svelte/icons/arrow-right';
    import ExternalLink from '@lucide/svelte/icons/external-link';
    import Plus from '@lucide/svelte/icons/plus';
    import { Button, type ButtonStatus } from '@sivir-ui/svelte/components/button';
    import { onDestroy } from 'svelte';
    import type { PlaygroundSettings } from './playground';

    let { example, variant, size }: PlaygroundSettings = $props();

    let status = $state<ButtonStatus>('idle');
    let timer: ReturnType<typeof setTimeout> | undefined;

    function publish() {
        if (status === 'loading') {
            return;
        }
        clearTimeout(timer);
        status = 'loading';
        timer = setTimeout(() => {
            status = 'success';
            timer = setTimeout(() => {
                status = 'idle';
            }, 1200);
        }, 1100);
    }

    onDestroy(() => {
        clearTimeout(timer);
    });
</script>

{#if example === 'leading'}
    <Button {variant} {size}>
        <Plus size={14} />
        New project
    </Button>
{:else if example === 'trailing'}
    <Button {variant} {size}>
        Continue
        <ArrowRight size={14} />
    </Button>
{:else if example === 'status'}
    <Button
        {status}
        {variant}
        {size}
        loadingLabel="Publishing…"
        successLabel="Published"
        onclick={publish}
    >
        Publish
    </Button>
{:else if example === 'link'}
    <Button href="/docs" {variant} {size}>
        <ExternalLink size={13} />
        Open docs
    </Button>
{:else if example === 'disabled'}
    <Button {variant} {size} disabled>Get started</Button>
{:else}
    <Button {variant} {size}>Get started</Button>
{/if}
