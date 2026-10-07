<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import {
        ComponentPreview,
        InstallCommand,
        PreviewMorph,
        PropGroup,
        PropRow,
        PropSegmented
    } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import {
        changedPaginationProps,
        PAGINATION_START_PAGE,
        type PaginationSettings,
        type PaginationSiblings,
        type PaginationTotal,
        paginationCode,
        paginationDefaults
    } from './playground/playground';
    import Preview from './playground/preview.svelte';

    type Option<T extends string> = {
        value: T;
        label: string;
    };

    const installCommand = 'bunx @sivir-ui/svelte add pagination';

    const totalOptions: Option<PaginationTotal>[] = [
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
    const siblingOptions: Option<PaginationSiblings>[] = [
        {
            value: '0',
            label: '0'
        },
        {
            value: '1',
            label: '1'
        },
        {
            value: '2',
            label: '2'
        }
    ];

    let settings = $state<PaginationSettings>({
        ...paginationDefaults
    });
    let page = $state(PAGINATION_START_PAGE);

    const heroCode = $derived(paginationCode(settings, page));
    const changed = $derived(changedPaginationProps(settings));

    function readTotal() {
        return settings.total;
    }

    function writeTotal(next: PaginationTotal) {
        settings.total = next;
        page = Math.min(page, Number(next));
    }
</script>

{#snippet paginationProps()}
    <PropGroup title="Range">
        <PropRow label="Total pages">
            <PropSegmented
                label="Total pages"
                size="sm"
                options={totalOptions}
                bind:value={readTotal, writeTotal}
            />
        </PropRow>
        <PropRow label="Siblings">
            <PropSegmented
                label="Siblings"
                size="sm"
                options={siblingOptions}
                bind:value={settings.siblings}
            />
        </PropRow>
    </PropGroup>
{/snippet}

<svelte:head>
    <title>Sivir · Pagination</title>
    <meta
        name="description"
        content="Numbered page buttons with previous and next controls that collapse long ranges into an ellipsis."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Pagination </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                The first and last page always stay visible. Pages more than
                <Typography.InlineCode>siblings</Typography.InlineCode>
                (default 1) away from the current page collapse into an ellipsis.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <!-- ─── Hero Example ──────────────────────────────────────────── -->
    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={heroCode} props={paginationProps} {changed}>
            <PreviewMorph key={`${settings.total}-${settings.siblings}`}>
                <Preview {settings} bind:page />
            </PreviewMorph>
        </ComponentPreview>
    </section>

    <!-- ─── Installation ──────────────────────────────────────────── -->
    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Installation</Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <!-- ─── Usage ─────────────────────────────────────────────────── -->
    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <Typography.Text variant="supporting">
            Pass the number of pages as <Typography.InlineCode>total</Typography.InlineCode>, not
            the number of items. Bind <Typography.InlineCode>page</Typography.InlineCode>, which
            starts at 1, or listen with <Typography.InlineCode>onPageChange</Typography.InlineCode>.
        </Typography.Text>
        <CodeBlock
            code={`import { Pagination } from '@sivir-ui/svelte/components/pagination';\n\nlet page = $state(1);\n\n<Pagination bind:page total={20} />`}
            lang="svelte"
            copy="overlay"
        />
    </section>
</div>
