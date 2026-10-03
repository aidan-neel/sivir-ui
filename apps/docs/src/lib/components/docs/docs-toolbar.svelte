<script lang="ts">
    import ChevronRight from '@lucide/svelte/icons/chevron-right';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as FullscreenNav from '@sivir-ui/svelte/components/fullscreen-nav';
    import { resolve } from '$app/paths';
    import { page } from '$app/state';

    import { components, sanitizeComponent } from '$lib/components';
    import Logo from '../logo.svelte';
    import GitHubLink from './github-link.svelte';
    import ThemeToggle from './theme-toggle.svelte';

    const {
        starCount = null,
        sidebar = false
    }: {
        starCount?: number | null;
        sidebar?: boolean;
    } = $props();
    let mobileMenuOpen = $state(false);

    $effect(() => {
        page.url.pathname;
        mobileMenuOpen = false;
    });

    const navItems = [
        { href: '/docs/introduction', label: 'Docs' },
        { href: '/docs/components', label: 'Components' },
        { href: '/studio', label: 'Studio' }
    ];
    const docsPages = [
        { title: 'Introduction', href: resolve('/docs/introduction') },
        { title: 'Installation', href: resolve('/docs/installation') },
        { title: 'Theming', href: resolve('/docs/theming') },
        { title: 'Skill', href: resolve('/docs/skill') },
        { title: 'Changelog', href: resolve('/docs/changelog') },
        { title: 'Components', href: resolve('/docs/components') }
    ];
    const sortedComponents = $derived(
        [...components].sort((a, b) => sanitizeComponent(a).localeCompare(sanitizeComponent(b)))
    );

    const breadcrumbs = $derived.by(() => {
        const pathnameSegments = page.url.pathname.split('/').filter(Boolean);
        const isDocsPath = pathnameSegments[0] === 'docs';
        const segments = isDocsPath ? pathnameSegments.slice(1) : pathnameSegments;
        const basePath = isDocsPath ? '/docs' : '';

        return [
            { href: '/', label: 'Sivir UI' },
            ...segments.map((segment, index) => ({
                href: `${basePath}/${segments.slice(0, index + 1).join('/')}`,
                label: formatSegment(segment)
            }))
        ];
    });

    function formatSegment(segment: string): string {
        const labels: Record<string, string> = {
            docs: 'Docs',
            components: 'Components',
            composer: 'Composer'
        };

        if (labels[segment]) {
            return labels[segment];
        }

        return segment
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
</script>

<FullscreenNav.Root bind:open={mobileMenuOpen}>
    {#if sidebar}
        <header
            class="z-20 flex h-12 w-full shrink-0 items-center justify-between gap-2 px-2 lg:hidden"
        >
            <div class="flex min-w-0 items-center gap-2">
                <FullscreenNav.Trigger class="size-9 rounded-[var(--radius-md)]" />
                <Logo />
            </div>

            <div class="flex shrink-0 items-center">
                <GitHubLink
                    {starCount}
                    variant="quiet"
                    iconClass="size-3.5 opacity-60 transition-opacity group-hover:opacity-100"
                    class="h-8 gap-1.5 rounded-[var(--radius-md)] px-2 text-xs text-foreground-muted hover:text-foreground"
                />
                <ThemeToggle
                    variant="quiet"
                    iconSize={15}
                    class="size-8 rounded-[var(--radius-md)] text-foreground-muted hover:text-foreground"
                />
            </div>
        </header>
    {:else}
        <header
            class="z-20 mx-auto flex h-16 w-full max-w-[960px] items-center justify-between gap-4 px-2 sm:px-5 lg:px-10"
        >
            <div class="flex min-w-0 items-center gap-2 sm:hidden">
                <FullscreenNav.Trigger class="size-9 rounded-[var(--radius-md)]" />
                <Logo />
            </div>

            <nav aria-label="Breadcrumb" class="hidden min-w-0 sm:block">
                <ol
                    class="flex min-w-0 items-center gap-1 overflow-hidden text-sm text-foreground-muted [font-weight:var(--font-weight-label,500)]"
                >
                    {#each breadcrumbs as breadcrumb, index (breadcrumb.href)}
                        <li class="flex min-w-0 items-center gap-1">
                            {#if index < breadcrumbs.length - 1}
                                <a
                                    href={breadcrumb.href}
                                    class="truncate transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
                                >
                                    {breadcrumb.label}
                                </a>
                            {:else}
                                <span class="truncate text-foreground" aria-current="page"
                                    >{breadcrumb.label}</span
                                >
                            {/if}
                            {#if index < breadcrumbs.length - 1}
                                <ChevronRight size={14} class="shrink-0" aria-hidden="true" />
                            {/if}
                        </li>
                    {/each}
                </ol>
            </nav>

            <div class="flex shrink-0 items-center gap-1.5">
                <Button
                    class="h-9 rounded-[var(--radius-md)] px-2.5 text-[0.8125rem]"
                    variant="outline"
                    href={resolve('/studio')}
                >
                    Studio
                </Button>
                <GitHubLink
                    {starCount}
                    class="h-9 gap-1.5 rounded-[var(--radius-md)] px-2.5 text-[0.8125rem]"
                />
                <ThemeToggle class="size-9 rounded-[var(--radius-md)]" />
            </div>
        </header>
    {/if}

    <FullscreenNav.Content
        label="Browse Sivir UI"
        class={sidebar ? 'p-0 lg:hidden' : 'p-0 sm:hidden'}
    >
        <header class="flex shrink-0 items-center justify-between px-3 py-3">
            <a href={resolve('/')} class="font-semibold tracking-tight text-foreground no-underline"
                >Sivir UI</a
            >
            <FullscreenNav.Close />
        </header>

        <div class="min-h-0 flex-1 overflow-y-auto px-3 py-4">
            <FullscreenNav.Group heading="Navigate">
                {#each navItems as item (item.href)}
                    <FullscreenNav.Link href={item.href}>{item.label}</FullscreenNav.Link>
                {/each}
            </FullscreenNav.Group>

            <FullscreenNav.Group heading="Getting started" class="mt-10">
                {#each docsPages as item (item.href)}
                    <FullscreenNav.Link href={item.href}>{item.title}</FullscreenNav.Link>
                {/each}
            </FullscreenNav.Group>

            <FullscreenNav.Group heading="Components" class="mt-10">
                {#each sortedComponents as component (component)}
                    <FullscreenNav.Link href={`/docs/components/${component}`}>
                        {sanitizeComponent(component)}
                    </FullscreenNav.Link>
                {/each}
            </FullscreenNav.Group>
        </div>
    </FullscreenNav.Content>
</FullscreenNav.Root>
