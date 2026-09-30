<script lang="ts">
    import Blocks from '@lucide/svelte/icons/blocks';
    import BookOpen from '@lucide/svelte/icons/book-open';
    import History from '@lucide/svelte/icons/history';
    import House from '@lucide/svelte/icons/house';
    import Moon from '@lucide/svelte/icons/moon';
    import Palette from '@lucide/svelte/icons/palette';
    import Sun from '@lucide/svelte/icons/sun';
    import SwatchBook from '@lucide/svelte/icons/swatch-book';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { cn } from '@sivir-ui/svelte/utils';
    import { mode, toggleMode } from 'mode-watcher';
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import GitHubBlack from '$lib/assets/GitHub_Invertocat_Black.svg';
    import GitHubWhite from '$lib/assets/GitHub_Invertocat_White.svg';

    let {
        starCount
    }: {
        starCount: number | null;
    } = $props();

    type Highlight = {
        x: number;
        y: number;
        width: number;
        height: number;
    };

    const links = [
        {
            href: resolve('/'),
            title: 'Home',
            icon: House
        },
        {
            href: resolve('/docs/introduction'),
            title: 'Docs',
            icon: BookOpen
        },
        {
            href: resolve('/docs/components'),
            title: 'Components',
            icon: Blocks
        },
        {
            href: resolve('/themes'),
            title: 'Themes',
            icon: SwatchBook
        },
        {
            href: resolve('/studio'),
            title: 'Studio',
            icon: Palette
        },
        {
            href: resolve('/docs/changelog'),
            title: 'Changelog',
            icon: History
        }
    ];

    const itemClass =
        'group relative z-[1] inline-flex h-[var(--size-control-sm)] shrink-0 items-center gap-2.5 whitespace-nowrap rounded-[var(--radius-lg)] ps-2.5 pe-3 [font-size:var(--font-size-body)] leading-none text-foreground-muted no-underline outline-none transition-[color,scale] [transition-duration:var(--motion-duration-hover)] ease-[var(--ease-out)] hover:text-foreground active:scale-[0.97] focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none motion-safe:[animation:home-rise_calc(var(--motion-duration-sheet)*1.8)_var(--ease-out)_both]';
    const iconClass =
        'transition-[translate,scale] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] group-hover:-translate-y-px group-hover:scale-110 motion-reduce:transition-none';
    const iconMorphClass =
        'absolute inset-0 transition-[opacity,filter,scale,rotate] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none';

    let list: HTMLDivElement | undefined;
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
        const path = page.url.pathname;

        return href === resolve('/') ? path === href : path.startsWith(href);
    }

    function entranceDelay(index: number) {
        return `animation-delay: calc(var(--motion-duration-sheet) * ${0.15 + index * 0.12})`;
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
            y: item.offsetTop,
            width: item.offsetWidth,
            height: item.offsetHeight
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

<nav
    aria-label="Site"
    class="flex w-full shrink-0 px-2.5 pt-2.5 min-[900px]:sticky min-[900px]:top-2 min-[900px]:h-[calc(100svh-1rem)] min-[900px]:w-44 min-[900px]:items-center min-[900px]:ps-3 min-[900px]:pe-2 min-[900px]:pt-0"
>
    <div
        bind:this={list}
        role="presentation"
        onpointerover={trackHover}
        onpointerleave={() => {
            highlightVisible = false;
        }}
        class="relative isolate flex w-full items-center gap-0.5 overflow-x-auto overscroll-x-contain [scrollbar-width:none] min-[900px]:flex-col min-[900px]:items-start min-[900px]:overflow-visible"
    >
        {#if highlight}
            <span
                aria-hidden="true"
                class={cn(
                    'pointer-events-none absolute top-0 left-0 z-0 rounded-[var(--radius-lg)] bg-foreground/[0.06] ease-[var(--ease-out)] [transition-duration:var(--motion-duration-panel)] motion-reduce:transition-none',
                    highlightGliding
                        ? 'transition-[translate,width,height,opacity]'
                        : 'transition-opacity',
                    highlightVisible ? 'opacity-100' : 'opacity-0'
                )}
                style:translate={`${highlight.x}px ${highlight.y}px`}
                style:width={`${highlight.width}px`}
                style:height={`${highlight.height}px`}
            ></span>
        {/if}
        {#each links as link, index (link.href)}
            {@const Icon = link.icon}
            <Button
                href={link.href}
                unstyled
                data-home-nav-item
                aria-current={isCurrent(link.href) ? 'page' : undefined}
                class={cn(itemClass, isCurrent(link.href) && 'bg-secondary text-foreground')}
                style={entranceDelay(index)}
            >
                <Icon size={16} strokeWidth={1.7} aria-hidden="true" class={iconClass} />
                {link.title}
            </Button>
        {/each}
        <Button
            href="https://github.com/aidan-neel/sivir-ui"
            target="_blank"
            rel="noreferrer"
            unstyled
            data-home-nav-item
            class={itemClass}
            style={entranceDelay(links.length)}
        >
            <img
                src={dark ? GitHubWhite : GitHubBlack}
                alt=""
                class={cn('size-4 opacity-80', iconClass)}
            />
            GitHub
            {#if stars}
                <span
                    class="font-mono [font-size:var(--font-size-badge)] tabular-nums text-foreground-muted"
                >
                    {stars}
                </span>
            {/if}
        </Button>
        <Button
            unstyled
            data-home-nav-item
            class={itemClass}
            style={entranceDelay(links.length + 1)}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            onclick={switchTheme}
        >
            <span class={cn('relative size-4', iconClass)} aria-hidden="true">
                <Sun
                    size={16}
                    strokeWidth={1.7}
                    class={cn(
                        iconMorphClass,
                        dark
                            ? '-rotate-90 scale-[0.25] opacity-0 blur-[4px]'
                            : 'rotate-0 scale-100 opacity-100 blur-[0px]'
                    )}
                />
                <Moon
                    size={16}
                    strokeWidth={1.7}
                    class={cn(
                        iconMorphClass,
                        dark
                            ? 'rotate-0 scale-100 opacity-100 blur-[0px]'
                            : 'rotate-90 scale-[0.25] opacity-0 blur-[4px]'
                    )}
                />
            </span>
            {dark ? 'Dark' : 'Light'}
        </Button>
    </div>
</nav>
