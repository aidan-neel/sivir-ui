<script lang="ts">
    import ArrowRight from '@lucide/svelte/icons/arrow-right';
    import Search from '@lucide/svelte/icons/search';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { CopyButton } from '@sivir-ui/svelte/components/copy-button';
    import { Input } from '@sivir-ui/svelte/components/input';
    import { Pagination } from '@sivir-ui/svelte/components/pagination';
    import { toast } from '@sivir-ui/svelte/components/toast';
    import * as ToggleGroup from '@sivir-ui/svelte/components/toggle-group';
    import { applyLiveThemeCss, getStoredLiveThemeCss } from '@sivir-ui/svelte/themes/live';
    import { parseTheme, themeToCss } from '@sivir-ui/svelte/themes/theme';
    import { cn } from '@sivir-ui/svelte/utils';
    import { mode } from 'mode-watcher';
    import { onMount } from 'svelte';
    import { afterNavigate, goto, replaceState } from '$app/navigation';
    import { resolve } from '$app/paths';
    import HomeDemo from '$lib/components/home/home-demo.svelte';
    import HomeNav from '$lib/components/home/home-nav.svelte';
    import { themeToDraft } from '$lib/studio/theme-draft';
    import {
        type RegistryTheme,
        THEMES_PAGE_SIZE,
        type ThemeSourceFilter,
        themeInstallCommand,
        themePreviewCss,
        themeStylesheetPath
    } from '$lib/theme-registry';
    import type { PageData } from './$types';

    const PREVIEW_STYLE_ID = 'sivir-theme-preview-style';
    const SEARCH_DEBOUNCE_MS = 250;
    const sourceFilters: {
        value: ThemeSourceFilter;
        label: string;
    }[] = [
        {
            value: 'all',
            label: 'All'
        },
        {
            value: 'sivir',
            label: 'Sivir'
        },
        {
            value: 'community',
            label: 'Community'
        }
    ];

    const titleClass =
        'm-0 font-[family-name:var(--font-header)] [font-size:var(--font-size-title)] [font-weight:var(--font-weight-body)] leading-[var(--leading-snug)] tracking-[var(--tracking-header)] text-pretty text-foreground-muted';
    const sectionTitleClass =
        'm-0 [font-size:var(--font-size-body)] [font-weight:var(--font-weight-label)] text-foreground';
    const metaClass = '[font-size:var(--font-size-label)] text-foreground-muted';
    const bodyClass = 'm-0 [font-size:var(--font-size-body)] leading-relaxed text-foreground-muted';
    const rowClass =
        'flex w-full cursor-[var(--ui-cursor-interactive)] items-center gap-3 rounded-[var(--radius-lg)] px-2 py-2 text-left outline-none transition-colors [transition-duration:var(--motion-duration-hover)] ease-[var(--ease-out)] hover:bg-foreground/[0.06] focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none';

    const { data }: { data: PageData } = $props();

    const initialQuery = () => data.filters.q;
    const initialSelection = () => data.selected;

    let query = $state(initialQuery());
    let selected = $state<RegistryTheme | null>(initialSelection());
    let appliedCss = $state<string | null>(null);

    const pageCount = $derived(Math.max(1, Math.ceil(data.catalog.total / THEMES_PAGE_SIZE)));
    const colorMode = $derived(mode.current === 'dark' ? 'dark' : 'light');
    const selectedCss = $derived(selected ? themeToCss(selected) : '');
    const selectedJson = $derived(selected ? JSON.stringify(parseTheme(selected), null, 2) : '');
    const selectedInUse = $derived(selectedCss !== '' && appliedCss === selectedCss);
    const selectedFacts = $derived(selected ? themeFacts(selected) : []);
    const countLabel = $derived(
        `${data.catalog.total} ${data.catalog.total === 1 ? 'theme' : 'themes'}`
    );

    function themeFacts(theme: RegistryTheme) {
        return [
            {
                label: 'Neutral',
                value: capitalize(theme.neutral === 'true' ? 'true gray' : theme.neutral)
            },
            {
                label: 'Radius',
                value: capitalize(theme.radius)
            },
            {
                label: 'Density',
                value: capitalize(theme.density)
            },
            {
                label: 'Motion',
                value: capitalize(theme.motion)
            },
            {
                label: 'Sans',
                value: fontName(theme.fontSans)
            },
            {
                label: 'Mono',
                value: fontName(theme.fontMono)
            }
        ];
    }

    function capitalize(value: string): string {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    function fontName(value: string): string {
        if (value.trim().startsWith('var(')) {
            return 'Same as sans';
        }

        return value
            .split(',')[0]
            .trim()
            .replace(/^['"]|['"]$/g, '');
    }

    function swatches(theme: RegistryTheme): string[] {
        const draft = themeToDraft(theme);
        const foundation = draft.foundationColors[colorMode];

        return [
            draft.brandColors[colorMode],
            foundation.background,
            foundation.base,
            foundation.border,
            foundation.foreground
        ];
    }

    function sourceLabel(theme: RegistryTheme): string {
        return theme.source === 'sivir' ? 'Built-in' : 'Community';
    }

    function publisherLabel(theme: RegistryTheme): string {
        return `${theme.publisher ?? 'Unknown publisher'} · ${sourceLabel(theme)}`;
    }

    function navigate(changes: Record<string, string | null>) {
        const url = new URL(window.location.href);
        url.searchParams.delete('page');

        for (const [key, value] of Object.entries(changes)) {
            if (value) {
                url.searchParams.set(key, value);
            } else {
                url.searchParams.delete(key);
            }
        }

        goto(url, {
            keepFocus: true,
            noScroll: true,
            replaceState: true
        });
    }

    function changeSource(value: string | string[] | undefined) {
        const next = typeof value === 'string' ? value : 'all';

        navigate({
            source: next === 'all' ? null : next
        });
    }

    function selectTheme(theme: RegistryTheme) {
        selected = theme;

        const url = new URL(window.location.href);
        url.searchParams.set('theme', theme.slug);
        replaceState(url, {});
    }

    function useOnSite() {
        if (!selected) {
            return;
        }

        applyLiveThemeCss(selectedCss);
        appliedCss = selectedCss;
        toast({
            title: `${selected.name} is in use`,
            description: 'This theme now styles every page of the site in this browser.',
            type: 'success',
            duration: 2000
        });
    }

    function copied(label: string) {
        toast({
            title: `${label} copied`,
            type: 'success',
            duration: 1600
        });
    }

    $effect(() => {
        const next = query.trim();
        if (next === data.filters.q) {
            return;
        }

        const timer = window.setTimeout(() => {
            navigate({
                q: next || null
            });
        }, SEARCH_DEBOUNCE_MS);

        return () => window.clearTimeout(timer);
    });

    afterNavigate(({ type }) => {
        if (type !== 'popstate') {
            return;
        }

        query = data.filters.q;
        if (data.selected?.slug !== selected?.slug) {
            selected = data.selected;
        }
    });

    $effect(() => {
        let tag = document.getElementById(PREVIEW_STYLE_ID);
        if (!tag) {
            tag = document.createElement('style');
            tag.id = PREVIEW_STYLE_ID;
            document.head.appendChild(tag);
        }

        tag.textContent = themePreviewCss(selectedCss);
    });

    onMount(() => {
        const root = document.documentElement;
        const inlineFont = root.style.getPropertyValue('--font-sans');
        root.style.removeProperty('--font-sans');
        appliedCss = getStoredLiveThemeCss();

        return () => {
            document.getElementById(PREVIEW_STYLE_ID)?.remove();

            if (inlineFont && !getStoredLiveThemeCss()) {
                root.style.setProperty('--font-sans', inlineFont);
            }
        };
    });
</script>

<svelte:head>
    <title>Sivir UI · Themes</title>
    <meta
        name="description"
        content="Preview built-in and community Sivir themes, then use, customize, or install one."
    />
</svelte:head>

<div class="flex min-h-[100svh] bg-background p-2">
    <div
        class="flex min-w-0 flex-1 flex-col rounded-[var(--radius-xl)] border-[length:var(--border-size)] border-border bg-card min-[900px]:flex-row"
    >
        <HomeNav starCount={data.starCount ?? null} />

        <main
            class="mx-auto flex w-full max-w-[80rem] min-w-0 flex-1 flex-col gap-10 px-4 pt-8 pb-6 sm:px-10 sm:pt-14 sm:pb-12"
        >
            <header class="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <h1 class={cn(titleClass, 'max-w-[40rem]')}>
                    <span class="text-foreground">Themes.</span>
                    Pick one to preview it across this page, then use it on the site, customize it
                    in the Studio, or install it with the CLI.
                </h1>
                <Button href={resolve('/studio')} variant="outline" class="group self-start">
                    Make your own
                    <ArrowRight
                        size={14}
                        aria-hidden="true"
                        class="transition-[translate] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] group-hover:translate-x-0.5 motion-reduce:transition-none"
                    />
                </Button>
            </header>

            <div class="grid gap-10 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
                <section aria-label="Theme catalog" class="flex min-w-0 flex-col gap-4">
                    <div class="relative">
                        <Search
                            size={14}
                            aria-hidden="true"
                            class="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-foreground-muted"
                        />
                        <Input
                            variant="outline"
                            class="pl-9"
                            placeholder="Search themes"
                            aria-label="Search themes"
                            bind:value={query}
                        />
                    </div>
                    <div class="flex items-center justify-between gap-3">
                        <div role="group" aria-label="Theme source">
                            <ToggleGroup.Root
                                type="single"
                                value={data.filters.source}
                                onValueChange={changeSource}
                            >
                                {#each sourceFilters as filter (filter.value)}
                                    <ToggleGroup.Item value={filter.value}>
                                        {filter.label}
                                    </ToggleGroup.Item>
                                {/each}
                            </ToggleGroup.Root>
                        </div>
                        <span class={cn(metaClass, 'tabular-nums')}>{countLabel}</span>
                    </div>
                    {#if !data.registryAvailable}
                        <p class={cn(metaClass, 'm-0')}>
                            Community themes are unavailable right now. Built-in themes still work.
                        </p>
                    {/if}

                    {#if data.catalog.items.length === 0}
                        <div class="flex flex-col items-start gap-3 py-4">
                            <p class={bodyClass}>No themes match this search.</p>
                            {#if data.filters.q || data.filters.source !== 'all'}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onclick={() => {
                                        query = '';
                                        navigate({
                                            q: null,
                                            source: null
                                        });
                                    }}
                                >
                                    Clear filters
                                </Button>
                            {/if}
                        </div>
                    {:else}
                        <ul class="-mx-2 m-0 flex list-none flex-col gap-0.5 p-0">
                            {#each data.catalog.items as theme (theme.id)}
                                {@const isSelected = selected?.slug === theme.slug}
                                <li>
                                    <button
                                        type="button"
                                        aria-pressed={isSelected}
                                        class={cn(
                                            rowClass,
                                            isSelected && 'bg-secondary hover:bg-secondary'
                                        )}
                                        onclick={() => selectTheme(theme)}
                                    >
                                        <span
                                            class="flex h-7 w-[4.5rem] shrink-0 overflow-hidden rounded-[var(--radius-sm)] border-[length:var(--border-size)] border-border"
                                            aria-hidden="true"
                                        >
                                            {#each swatches(theme) as color, index (index)}
                                                <span
                                                    class="h-full flex-1"
                                                    style:background={color}
                                                ></span>
                                            {/each}
                                        </span>
                                        <span class="flex min-w-0 flex-1 flex-col gap-0.5">
                                            <span
                                                class="truncate [font-size:var(--font-size-body)] [font-weight:var(--font-weight-label)] text-foreground"
                                            >
                                                {theme.name}
                                            </span>
                                            <span class={cn(metaClass, 'truncate')}>
                                                {publisherLabel(theme)}
                                            </span>
                                        </span>
                                    </button>
                                </li>
                            {/each}
                        </ul>
                    {/if}

                    {#if pageCount > 1}
                        <Pagination
                            page={data.filters.page}
                            total={pageCount}
                            onPageChange={(next) => {
                                navigate({
                                    page: next > 1 ? String(next) : null
                                });
                            }}
                        />
                    {/if}
                </section>

                {#if selected}
                    <section
                        aria-labelledby="selected-theme-name"
                        class="flex min-w-0 flex-col gap-8"
                    >
                        <div
                            class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
                        >
                            <div class="flex min-w-0 flex-col gap-1.5">
                                <h2
                                    id="selected-theme-name"
                                    class={cn(titleClass, 'text-foreground')}
                                >
                                    {selected.name}
                                </h2>
                                <span class={metaClass}>{publisherLabel(selected)}</span>
                                {#if selected.description}
                                    <p class={cn(bodyClass, 'mt-1 max-w-[60ch]')}>
                                        {selected.description}
                                    </p>
                                {/if}
                            </div>
                            <div class="flex shrink-0 flex-wrap gap-2">
                                <Button onclick={useOnSite} disabled={selectedInUse}>
                                    {selectedInUse ? 'In use on this site' : 'Use on this site'}
                                </Button>
                                <Button
                                    variant="outline"
                                    href={`${resolve('/studio')}?theme=${encodeURIComponent(selected.slug)}`}
                                >
                                    Customize in Studio
                                </Button>
                            </div>
                        </div>

                        <HomeDemo themePicker={false} />

                        <div class="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                            <div class="flex flex-col gap-3">
                                <h3 class={sectionTitleClass}>Axes</h3>
                                <dl class="m-0 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                                    <div class="flex min-w-0 flex-col gap-1">
                                        <dt class={metaClass}>Brand</dt>
                                        <dd
                                            class="m-0 flex items-center gap-2 [font-size:var(--font-size-body)] text-foreground"
                                        >
                                            <span
                                                class="size-3 shrink-0 rounded-full shadow-[inset_0_0_0_var(--border-size)_var(--color-border)]"
                                                style:background={selected.brand}
                                                aria-hidden="true"
                                            ></span>
                                            <span
                                                class="font-mono [font-size:var(--font-size-label)]"
                                                >{selected.brand}</span
                                            >
                                        </dd>
                                    </div>
                                    {#each selectedFacts as fact (fact.label)}
                                        <div class="flex min-w-0 flex-col gap-1">
                                            <dt class={metaClass}>{fact.label}</dt>
                                            <dd
                                                class="m-0 truncate [font-size:var(--font-size-body)] text-foreground"
                                            >
                                                {fact.value}
                                            </dd>
                                        </div>
                                    {/each}
                                </dl>
                            </div>

                            <div class="flex min-w-0 flex-col gap-3">
                                <h3 class={sectionTitleClass}>Install</h3>
                                <p class={bodyClass}>
                                    Writes the theme to <code class="font-mono">theme.css</code>.
                                    Import it after <code class="font-mono">ui.css</code>.
                                </p>
                                <div
                                    class="flex h-[var(--size-control-lg)] w-full items-center gap-2.5 rounded-[var(--radius-lg)] bg-background ps-3.5 pe-1 font-mono [font-size:var(--font-size-label)] shadow-[inset_0_0_0_var(--border-size)_var(--color-border)]"
                                >
                                    <span aria-hidden="true" class="text-foreground-muted/60"
                                        >$</span
                                    >
                                    <code
                                        class="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-foreground-muted [scrollbar-width:none]"
                                        >{themeInstallCommand(selected.slug)}</code
                                    >
                                    <CopyButton
                                        text={themeInstallCommand(selected.slug)}
                                        label="Copy command"
                                        copiedLabel="Copied"
                                    />
                                </div>
                                <div class="flex flex-wrap items-center gap-2">
                                    <CopyButton
                                        text={selectedCss}
                                        label="Copy CSS"
                                        variant="outline"
                                        size="sm"
                                        oncopy={() => copied('CSS')}
                                    >
                                        Copy CSS
                                    </CopyButton>
                                    <CopyButton
                                        text={selectedJson}
                                        label="Copy JSON"
                                        variant="outline"
                                        size="sm"
                                        oncopy={() => copied('JSON')}
                                    >
                                        Copy JSON
                                    </CopyButton>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        href={themeStylesheetPath(selected.slug)}
                                        target="_blank"
                                        rel="noopener"
                                    >
                                        Open stylesheet
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>
                {/if}
            </div>
        </main>
    </div>
</div>
