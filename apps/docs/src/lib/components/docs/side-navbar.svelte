<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import { travelingHighlight } from '@sivir-ui/svelte/utils';
    import { dev } from '$app/environment';
    import { page } from '$app/stores';
    import { blocks } from '$lib/blocks';
    import { components, sanitizeComponent } from '$lib/components';
    import Logo from '$lib/components/logo.svelte';
    import GitHubLink from './github-link.svelte';
    import ThemeToggle from './theme-toggle.svelte';

    type NavItem = {
        href: string;
        label: string;
    };

    let {
        class: classProp = '',
        starCount = null,
        onNavigate
    }: {
        class?: string;
        starCount?: number | null;
        onNavigate?: () => void;
    } = $props();
    const pageName = $derived($page.url.pathname);
    let asideEl = $state<HTMLElement>();

    const gettingStartedItems: NavItem[] = [
        { href: '/docs/introduction', label: 'Introduction' },
        { href: '/docs/installation', label: 'Installation' },
        { href: '/docs/theming', label: 'Theming' },
        { href: '/docs/skill', label: 'Skill' },
        { href: '/docs/changelog', label: 'Changelog' },
        { href: '/studio', label: 'Studio' }
    ];

    const blockItems: NavItem[] = [
        { href: '/docs/blocks', label: 'Overview' },
        ...blocks.map((block) => ({
            href: `/docs/blocks/${block.slug}`,
            label: block.title
        }))
    ];

    const componentItems: NavItem[] = [
        { href: '/docs/components', label: 'Overview' },
        ...[...components]
            .sort((a, b) => sanitizeComponent(a).localeCompare(sanitizeComponent(b)))
            .map((component) => ({
                href: `/docs/components/${component}`,
                label: sanitizeComponent(component)
            }))
    ];

    $effect(() => {
        void pageName;
        const activeLink = asideEl?.querySelector<HTMLElement>('[aria-current="page"]');

        if (!asideEl || !activeLink) {
            return;
        }

        const viewport = asideEl.getBoundingClientRect();
        const link = activeLink.getBoundingClientRect();
        const outOfView = link.top < viewport.top || link.bottom > viewport.bottom;

        if (outOfView) {
            activeLink.scrollIntoView({
                block: 'center'
            });
        }
    });

    function isActive(path: string) {
        return pageName === path;
    }
</script>

{#snippet navLink(item: NavItem)}
    {@const active = isActive(item.href)}
    <Button
        variant="quiet"
        size="sm"
        href={item.href}
        onclick={onNavigate}
        aria-current={active ? 'page' : undefined}
        data-collection-item
        data-collection-active={active ? 'true' : undefined}
        class="h-9 w-fit justify-start rounded-[var(--radius-lg)] px-3 text-left text-sm text-foreground [font-weight:var(--font-weight-label,500)]"
    >
        {item.label}
    </Button>
{/snippet}

<aside
    bind:this={asideEl}
    class={`${classProp} hide-scrollbar flex flex-col overflow-y-auto overscroll-contain pb-6`}
>
    <div class="flex items-center justify-between gap-2 pl-2">
        <Logo />

        <div class="-my-1 flex items-center">
            <GitHubLink
                {starCount}
                variant="quiet"
                iconClass="size-3.5 opacity-60 transition-opacity group-hover:opacity-100"
                class="h-7 gap-1.5 rounded-[var(--radius-md)] px-2 text-xs text-foreground-muted hover:text-foreground"
            />
            <ThemeToggle
                variant="quiet"
                iconSize={14}
                class="size-7 rounded-[var(--radius-md)] text-foreground-muted hover:text-foreground"
            />
        </div>
    </div>

    <nav aria-label="Documentation" class="mt-8 flex flex-col gap-8">
        <section aria-labelledby="nav-getting-started" class="flex flex-col gap-1">
            <h3
                id="nav-getting-started"
                class="px-3 pb-1 text-[13px] text-foreground-muted [font-weight:var(--font-weight-body,400)]"
            >
                Getting started
            </h3>
            <div use:travelingHighlight class="flex flex-col">
                {#each gettingStartedItems as item (item.href)}
                    {@render navLink(item)}
                {/each}
            </div>
        </section>

        {#if dev}
            <section aria-labelledby="nav-blocks" class="flex flex-col gap-1">
                <h3
                    id="nav-blocks"
                    class="flex items-baseline gap-2 px-3 pb-1 text-[13px] text-foreground-muted [font-weight:var(--font-weight-body,400)]"
                >
                    Blocks
                    <span class="text-foreground-muted/70">Dev only</span>
                </h3>
                <div use:travelingHighlight class="flex flex-col">
                    {#each blockItems as item (item.href)}
                        {@render navLink(item)}
                    {/each}
                </div>
            </section>
        {/if}

        <section aria-labelledby="nav-components" class="flex flex-col gap-1">
            <h3
                id="nav-components"
                class="flex items-baseline gap-2 px-3 pb-1 text-[13px] text-foreground-muted [font-weight:var(--font-weight-body,400)]"
            >
                Components
                <span class="tabular-nums text-foreground-muted/70">
                    {components.length}
                </span>
            </h3>
            <div use:travelingHighlight class="flex flex-col">
                {#each componentItems as item (item.href)}
                    {@render navLink(item)}
                {/each}
            </div>
        </section>
    </nav>
</aside>
