<script lang="ts">
    import ArrowRight from '@lucide/svelte/icons/arrow-right';
    import Moon from '@lucide/svelte/icons/moon';
    import Sun from '@lucide/svelte/icons/sun';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as FullscreenNav from '@sivir-ui/svelte/components/fullscreen-nav';
    import { cn } from '@sivir-ui/svelte/utils';
    import { mode, toggleMode } from 'mode-watcher';
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import GitHubBlack from '$lib/assets/GitHub_Invertocat_Black.svg';
    import GitHubWhite from '$lib/assets/GitHub_Invertocat_White.svg';
    import Logo from '$lib/components/logo.svelte';

    let {
        starCount
    }: {
        starCount: number | null;
    } = $props();

    type Highlight = {
        x: number;
        width: number;
    };

    const links = [
        {
            href: resolve('/docs/introduction'),
            title: 'Docs'
        },
        {
            href: resolve('/docs/components'),
            title: 'Components'
        },
        {
            href: resolve('/studio'),
            title: 'Studio'
        },
        {
            href: resolve('/docs/skill'),
            title: 'Skill'
        },
        {
            href: resolve('/docs/changelog'),
            title: 'Changelog'
        }
    ];

    const itemClass =
        'relative z-[1] inline-flex h-[var(--size-control-sm)] shrink-0 items-center whitespace-nowrap rounded-[var(--radius-md)] px-3 [font-size:var(--font-size-body)] leading-none text-foreground-muted no-underline outline-none transition-colors [transition-duration:var(--motion-duration-hover)] ease-[var(--ease-out)] hover:cursor-[var(--ui-cursor-interactive)] hover:text-foreground focus-visible:shadow-[var(--focus-ring)] aria-[current=page]:text-foreground motion-reduce:transition-none';
    const iconMorphClass =
        'absolute inset-0 transition-[opacity,filter,scale,rotate] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none';

    let list: HTMLDivElement | undefined;
    let menuOpen = $state(false);
    let highlight = $state<Highlight>();
    let highlightVisible = $state(false);
    let highlightGliding = $state(false);

    const dark = $derived(mode.current === 'dark');
    const stars = $derived(formatStarCount(starCount));

    function formatStarCount(count: number | null) {
        if (count === null || Number.isNaN(count)) {
            return null;
        }

        if (count >= 1000) {
            const thousands = count / 1000;

            return `${thousands >= 10 ? Math.round(thousands) : thousands.toFixed(1)}k`;
        }

        return String(count);
    }

    function isCurrent(href: string) {
        return page.url.pathname.startsWith(href);
    }

    function trackHover(event: PointerEvent) {
        const target = event.target instanceof Element ? event.target : null;
        const item = target?.closest<HTMLElement>('[data-home-nav-item]');

        if (!item || !list?.contains(item)) {
            highlightVisible = false;
            return;
        }

        highlightGliding = highlightVisible;
        highlight = {
            x: item.offsetLeft,
            width: item.offsetWidth
        };
        highlightVisible = true;
    }

    function switchTheme() {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduceMotion || !document.startViewTransition) {
            toggleMode();
            return;
        }

        document.startViewTransition(() => {
            toggleMode();
        });
    }
</script>

<FullscreenNav.Root bind:open={menuOpen}>
    <header
        class="relative flex h-16 w-full shrink-0 items-center justify-between gap-4 px-4 sm:px-6"
    >
        <div class="flex min-w-0 items-center gap-2">
            <FullscreenNav.Trigger class="size-9 rounded-[var(--radius-md)] md:hidden" />
            <Logo />
        </div>

        <nav
            aria-label="Site"
            class="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block"
        >
            <div
                bind:this={list}
                role="presentation"
                onpointerover={trackHover}
                onpointerleave={() => {
                    highlightVisible = false;
                }}
                class="relative isolate flex items-center gap-0.5"
            >
                {#if highlight}
                    <span
                        aria-hidden="true"
                        class={cn(
                            'pointer-events-none absolute top-0 left-0 z-0 h-full rounded-[var(--radius-md)] bg-foreground/[0.06] ease-[var(--ease-out)] [transition-duration:var(--motion-duration-panel)] motion-reduce:transition-none',
                            highlightGliding ? 'transition-[translate,width,opacity]' : 'transition-opacity',
                            highlightVisible ? 'opacity-100' : 'opacity-0'
                        )}
                        style:translate={`${highlight.x}px 0`}
                        style:width={`${highlight.width}px`}
                    ></span>
                {/if}
                {#each links as link (link.href)}
                    <a
                        href={link.href}
                        data-home-nav-item
                        aria-current={isCurrent(link.href) ? 'page' : undefined}
                        class={itemClass}
                    >
                        {link.title}
                    </a>
                {/each}
            </div>
        </nav>

        <div class="flex shrink-0 items-center gap-1.5">
            <Button
                variant="ghost"
                size="icon"
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                onclick={switchTheme}
            >
                <span class="relative size-4" aria-hidden="true">
                    <Sun
                        size={16}
                        class={cn(
                            iconMorphClass,
                            dark
                                ? '-rotate-90 scale-[0.25] opacity-0 blur-[4px]'
                                : 'rotate-0 scale-100 opacity-100 blur-[0px]'
                        )}
                    />
                    <Moon
                        size={16}
                        class={cn(
                            iconMorphClass,
                            dark
                                ? 'rotate-0 scale-100 opacity-100 blur-[0px]'
                                : 'rotate-90 scale-[0.25] opacity-0 blur-[4px]'
                        )}
                    />
                </span>
            </Button>
            <Button
                href="https://github.com/aidan-neel/sivir-ui"
                target="_blank"
                rel="noreferrer"
                variant="ghost"
                class="gap-2 px-2.5"
                aria-label={stars ? `Sivir UI on GitHub, ${stars} stars` : 'Sivir UI on GitHub'}
            >
                <img src={GitHubBlack} alt="" class="size-4 dark:hidden" />
                <img src={GitHubWhite} alt="" class="hidden size-4 dark:block" />
                <span class="tabular-nums">{stars ?? 'Star'}</span>
            </Button>
            <Button href={resolve('/docs/introduction')} class="group ms-1 max-sm:hidden">
                Get started
                <ArrowRight
                    size={14}
                    aria-hidden="true"
                    class="transition-[translate] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
            </Button>
        </div>
    </header>

    <FullscreenNav.Content label="Browse Sivir UI" class="p-0 md:hidden">
        <div class="flex shrink-0 items-center justify-between px-4 py-3">
            <Logo />
            <FullscreenNav.Close />
        </div>
        <div class="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            <FullscreenNav.Group heading="Navigate">
                <FullscreenNav.Link href={resolve('/')}>Home</FullscreenNav.Link>
                {#each links as link (link.href)}
                    <FullscreenNav.Link href={link.href}>{link.title}</FullscreenNav.Link>
                {/each}
                <FullscreenNav.Link href="https://github.com/aidan-neel/sivir-ui">
                    GitHub
                </FullscreenNav.Link>
            </FullscreenNav.Group>
        </div>
    </FullscreenNav.Content>
</FullscreenNav.Root>
