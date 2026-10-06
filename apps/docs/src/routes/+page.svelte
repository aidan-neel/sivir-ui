<script lang="ts">
    import ArrowRight from '@lucide/svelte/icons/arrow-right';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { resolve } from '$app/paths';
    import { changelogVersions } from '$lib/changelog';
    import { components } from '$lib/components';
    import HomeNav from '$lib/components/home/home-nav.svelte';
    import HomeShowcase from '$lib/components/home/home-showcase.svelte';
    import InstallCommand from '$lib/components/install-command.svelte';

    import type { PageData } from './$types';

    const { data }: { data: PageData } = $props();

    const latestVersion = changelogVersions[0];
    const install = 'bunx @sivir-ui/svelte init -y';
    const description = `${components.length} Svelte components for apps and AI interfaces. Set colors, fonts, radius, and motion in one theme. Install with the CLI, or point your coding agent at the docs.`;
    const riseClass =
        'motion-safe:[animation:home-rise_calc(var(--motion-duration-sheet)*2.2)_var(--ease-out)_both]';
    const nudgeClass =
        'transition-[translate] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none';

    function riseDelay(step: number) {
        return `animation-delay: calc(var(--motion-duration-sheet) * ${0.15 + step * 0.4})`;
    }
</script>

<svelte:head>
    <title>Sivir UI · Themed Svelte components</title>
    <meta name="description" content={description} />
</svelte:head>

<div class="flex min-h-[100svh] min-w-0 flex-col bg-background">
    <HomeNav starCount={data.starCount ?? null} />

    <main class="flex min-w-0 flex-col gap-16 pb-16 sm:gap-24 sm:pb-24">
        <section
            aria-labelledby="home-title"
            class="flex flex-col items-center px-5 pt-16 text-center sm:px-10 sm:pt-24"
        >
            <a
                href={resolve('/docs/changelog')}
                class={`group inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] [font-size:var(--font-size-label)] text-foreground-muted no-underline outline-none transition-colors [transition-duration:var(--motion-duration-hover)] hover:text-foreground focus-visible:shadow-[var(--focus-ring)] ${riseClass}`}
                style={riseDelay(0)}
            >
                <span class="font-mono tabular-nums">v{latestVersion}</span>
                <span aria-hidden="true">·</span>
                What’s new
                <ArrowRight
                    size={12}
                    aria-hidden="true"
                    class={`${nudgeClass} group-hover:translate-x-0.5`}
                />
            </a>

            <h1
                id="home-title"
                class={`m-0 mt-6 font-[family-name:var(--font-header)] [font-size:clamp(2.5rem,7vw,4.75rem)] [font-weight:var(--font-weight-body)] leading-[1.04] tracking-[-0.045em] text-balance text-foreground ${riseClass}`}
                style={riseDelay(1)}
            >
                <span class="block">Theme it once.</span>
                <span class="block">Every component follows.</span>
            </h1>

            <p
                class={`m-0 mt-6 max-w-[34rem] [font-size:var(--font-size-header)] leading-relaxed text-foreground-muted text-pretty ${riseClass}`}
                style={riseDelay(2)}
            >
                {description}
            </p>

            <div
                class={`mt-8 flex flex-wrap items-center justify-center gap-2 ${riseClass}`}
                style={riseDelay(3)}
            >
                <Button href={resolve('/docs/components')} class="group">
                    Browse components
                    <ArrowRight
                        size={14}
                        aria-hidden="true"
                        class={`${nudgeClass} group-hover:translate-x-0.5`}
                    />
                </Button>
                <Button href={resolve('/docs/skill')} variant="outline" class="group">
                    Give Sivir to your AI
                    <ArrowRight
                        size={14}
                        aria-hidden="true"
                        class={`${nudgeClass} group-hover:translate-x-0.5`}
                    />
                </Button>
            </div>

            <InstallCommand
                command={install}
                source="home"
                class={`mt-10 max-w-[30rem] ${riseClass}`}
                style={riseDelay(4)}
            />
        </section>

        <div class="mx-auto w-full max-w-[80rem] min-w-0 px-4 sm:px-10">
            <HomeShowcase />
        </div>
    </main>
</div>
