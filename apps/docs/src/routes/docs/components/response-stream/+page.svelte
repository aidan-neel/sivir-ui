<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import {
        ComponentPreview,
        InstallCommand,
        PropGroup,
        PropRow,
        PropSegmented
    } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import {
        changedResponseStreamProps,
        type ResponseStreamSettings,
        type ResponseStreamSource,
        type ResponseStreamSpeed,
        responseStreamCode,
        responseStreamDefaults
    } from './playground/playground';

    const TITLE = 'Response Stream';
    const SLUG = 'response-stream';
    const installCommand = `bunx @sivir-ui/svelte add ${SLUG}`;

    const sourceOptions: {
        value: ResponseStreamSource;
        label: string;
    }[] = [
        {
            value: 'stream',
            label: 'Async stream'
        },
        {
            value: 'text',
            label: 'Complete text'
        }
    ];

    const speedOptions: {
        value: ResponseStreamSpeed;
        label: string;
    }[] = [
        {
            value: '5',
            label: '5'
        },
        {
            value: '10',
            label: '10'
        },
        {
            value: '20',
            label: '20'
        },
        {
            value: '50',
            label: '50'
        }
    ];

    let settings = $state<ResponseStreamSettings>({
        ...responseStreamDefaults
    });

    const heroCode = $derived(responseStreamCode(settings));
    const changed = $derived(changedResponseStreamProps(settings));
    const replayKey = $derived(`${settings.source}-${settings.speed}`);
</script>

{#snippet heroProps()}
    <PropGroup title="Reveal">
        <PropRow label="Source">
            <PropSegmented
                label="Source"
                size="sm"
                options={sourceOptions}
                bind:value={settings.source}
            />
        </PropRow>
        <PropRow label="Speed">
            <PropSegmented
                label="Speed"
                size="sm"
                options={speedOptions}
                bind:value={settings.speed}
            />
        </PropRow>
    </PropGroup>
{/snippet}

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta
        name="description"
        content="Reveals streamed or complete response text at a steady pace, fading in the newest characters."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>{TITLE}</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Text appears character by character instead of in network-sized chunks. When chunks
                arrive faster than the reveal, it speeds up to stay about a third of a second behind
                the model.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={heroCode} props={heroProps} {changed} refreshable>
            {#key replayKey}
                <Hero source={settings.source} speed={Number(settings.speed)} />
            {/key}
        </ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Installation</Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <div class="flex flex-col gap-3">
            <div>
                <Typography.H3>Live responses</Typography.H3>
                <Typography.Text variant="supporting" class="mt-1">
                    Pass an async iterable of text chunks as
                    <Typography.InlineCode>textStream</Typography.InlineCode>, or pass the
                    cumulative string and set
                    <Typography.InlineCode>streaming</Typography.InlineCode>
                    until it is final. A pulsing dot grid shows until the first chunk arrives. Text
                    that has already arrived keeps revealing after the stream ends, then
                    <Typography.InlineCode>onComplete</Typography.InlineCode>
                    fires. With reduced motion, text appears without the reveal.
                </Typography.Text>
            </div>
            <CodeBlock
                code={`import { ResponseStream } from '@sivir-ui/svelte/components/response-stream';\n\n<ResponseStream textStream={modelResponse} />`}
                lang="svelte"
                copy="overlay"
            />
        </div>

        <div class="flex flex-col gap-3">
            <div>
                <Typography.H3>Complete responses</Typography.H3>
                <Typography.Text variant="supporting" class="mt-1">
                    For a complete string, set
                    <Typography.InlineCode>speed</Typography.InlineCode>
                    from 1 (slowest) to 100 (fastest) to control the reveal pace. The default is 20.
                </Typography.Text>
            </div>
            <CodeBlock
                code={`import { ResponseStream } from '@sivir-ui/svelte/components/response-stream';\n\n<ResponseStream textStream="Draft saved." speed={70} />`}
                lang="svelte"
                copy="overlay"
            />
        </div>
    </section>
</div>
