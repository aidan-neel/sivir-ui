<script lang="ts">
    import Search from '@lucide/svelte/icons/search';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { Input } from '@sivir-ui/svelte/components/input';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    import type { ComponentSlug } from '$lib/component-anatomy';
    import { componentSummaries } from '$lib/component-summaries';
    import { components, sanitizeComponent } from '$lib/components';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    type Group = {
        id: string;
        heading: string;
        items: ComponentSlug[];
    };

    const groups: Group[] = [
        {
            id: 'ai',
            heading: 'AI',
            items: [
                'conversation',
                'message',
                'composer',
                'attachment',
                'question',
                'reasoning',
                'tool',
                'response-stream'
            ]
        },
        {
            id: 'inputs',
            heading: 'Inputs',
            items: [
                'button',
                'checkbox',
                'color-picker',
                'combobox',
                'input',
                'label',
                'radio-group',
                'select',
                'slider',
                'switch',
                'tag-input',
                'textarea',
                'toggle',
                'toggle-group'
            ]
        },
        {
            id: 'overlays',
            heading: 'Overlays',
            items: [
                'alert-dialog',
                'command',
                'context-menu',
                'dropdown-menu',
                'hover-card',
                'modal',
                'popover',
                'sheet',
                'tooltip'
            ]
        },
        {
            id: 'feedback',
            heading: 'Feedback',
            items: [
                'alert',
                'badge',
                'gauge',
                'progress',
                'skeleton',
                'spinner',
                'task-steps',
                'toast'
            ]
        },
        {
            id: 'navigation',
            heading: 'Navigation',
            items: ['breadcrumb', 'fullscreen-nav', 'pagination', 'tabs']
        },
        {
            id: 'layout',
            heading: 'Layout',
            items: [
                'accordion',
                'avatar',
                'card',
                'collapsible',
                'reorder-list',
                'scroll-area',
                'show-more'
            ]
        },
        {
            id: 'content',
            heading: 'Content',
            items: ['code-block', 'copy-button', 'file-diff', 'markdown', 'shortcut', 'typography']
        }
    ];

    let query = $state('');

    const needle = $derived(query.trim().toLowerCase());
    const visibleGroups = $derived(
        groups
            .map((group) => {
                return {
                    ...group,
                    items: group.items.filter(matches)
                };
            })
            .filter((group) => {
                return group.items.length > 0;
            })
    );
    const visibleItems = $derived(
        visibleGroups.flatMap((group) => {
            return group.items;
        })
    );
    const countLabel = $derived(
        needle === ''
            ? `${components.length} components`
            : `${visibleItems.length} of ${components.length}`
    );

    function matches(component: ComponentSlug) {
        if (needle === '') {
            return true;
        }

        const name = sanitizeComponent(component).toLowerCase();
        const summary = componentSummaries[component].toLowerCase();

        return component.includes(needle) || name.includes(needle) || summary.includes(needle);
    }

    function componentHref(component: ComponentSlug) {
        return resolve(`/docs/components/${component}` as '/docs/components/accordion');
    }

    function handleSearchKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape' && query !== '') {
            event.preventDefault();
            query = '';
            return;
        }

        const first = visibleItems[0];

        if (event.key === 'Enter' && needle !== '' && first) {
            event.preventDefault();
            void goto(componentHref(first));
        }
    }
</script>

<svelte:head>
    <title>Sivir · Components</title>
    <meta
        name="description"
        content={`All ${components.length} Sivir UI components for Svelte 5, grouped by purpose.`}
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1 class="m-0">Components</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Filter by name or purpose. Press Enter to open the first match, or Escape to clear
                the filter.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <search class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <div class="w-full sm:max-w-sm">
            <Input
                type="text"
                bind:value={query}
                placeholder="Filter by name or purpose"
                aria-label="Filter components"
                aria-describedby="component-count"
                autocomplete="off"
                spellcheck="false"
                onkeydown={handleSearchKeydown}
            >
                {#snippet leading()}
                    <Search size={15} aria-hidden="true" />
                {/snippet}
            </Input>
        </div>
        <Typography.Metadata
            id="component-count"
            class="whitespace-nowrap tabular-nums"
            aria-live="polite"
        >
            {countLabel}
        </Typography.Metadata>
    </search>

    {#if visibleItems.length === 0}
        <section aria-label="No matching components" class="flex flex-col items-start gap-3">
            <Typography.Text variant="supporting">
                No components match “{query.trim()}”.
            </Typography.Text>
            <Button
                variant="outline"
                size="md"
                onclick={() => {
                    query = '';
                }}
            >
                Clear filter
            </Button>
        </section>
    {:else}
        <section aria-label="Component list" class="flex flex-col">
            {#each visibleGroups as group (group.id)}
                <section
                    aria-labelledby={`group-${group.id}`}
                    class="flex flex-col gap-3 border-t-[length:var(--border-size)] border-border py-6 first:border-t-0 first:pt-0"
                >
                    <Typography.H2
                        id={`group-${group.id}`}
                        class="m-0 [font-size:var(--font-size-body)] [font-weight:var(--font-weight-header)]"
                    >
                        {group.heading}
                    </Typography.H2>
                    <ul class="m-0 grid list-none gap-x-8 gap-y-0.5 p-0 sm:grid-cols-2">
                        {#each group.items as component (component)}
                            <li>
                                <a
                                    href={componentHref(component)}
                                    class="-mx-3 flex flex-col gap-0.5 rounded-[var(--radius-md)] px-3 py-2 no-underline outline-none transition-colors [transition-duration:var(--motion-duration-hover)] hover:bg-secondary/60 focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
                                >
                                    <span
                                        class="[font-weight:var(--font-weight-label)] text-foreground"
                                    >
                                        {sanitizeComponent(component)}
                                    </span>
                                    <span class="text-sm text-foreground-muted">
                                        {componentSummaries[component]}
                                    </span>
                                </a>
                            </li>
                        {/each}
                    </ul>
                </section>
            {/each}
        </section>
    {/if}
</div>
