<script lang="ts">
    import ArrowRight from '@lucide/svelte/icons/arrow-right';
    import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { CopyButton } from '@sivir-ui/svelte/components/copy-button';
    import { resolve } from '$app/paths';
    import { trackEvent } from '$lib/analytics';
    import { components } from '$lib/components';
    import HomeDemo from '$lib/components/home/home-demo.svelte';
    import HomeNav from '$lib/components/home/home-nav.svelte';

    import type { PageData } from './$types';

    const { data }: { data: PageData } = $props();

    const install = 'bunx --package @sivir-ui/svelte sivir init -y';
    const headline = [
        'Sivir is a set of themed Svelte components.',
        `Set your colors, fonts, and radius once, and all ${components.length} components follow.`
    ];
    const description = headline.join(' ');
    const wordCount = description.split(' ').length;
    const riseClass =
        'motion-safe:[animation:home-rise_calc(var(--motion-duration-sheet)*2.2)_var(--ease-out)_both]';
    const nudgeClass =
        'transition-[translate] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none';

    function firstWordIndex(sentence: number) {
        return headline
            .slice(0, sentence)
            .reduce((count, text) => count + text.split(' ').length, 0);
    }

    function wordDelay(index: number) {
        return `animation-delay: calc(var(--motion-duration-sheet) * ${0.2 + index * 0.1})`;
    }

    function riseDelay(step: number) {
        return `animation-delay: calc(var(--motion-duration-sheet) * ${0.4 + wordCount * 0.1 + step * 0.35})`;
    }

    function copyCommand(event: MouseEvent & { currentTarget: HTMLElement }) {
        const target = event.target as HTMLElement;

        if (target.closest('button')) {
            return;
        }

        event.currentTarget.querySelector<HTMLButtonElement>('button')?.click();
    }
</script>

<svelte:head>
    <title>Sivir UI · Themed Svelte components</title>
    <meta name="description" content={description} />
</svelte:head>

<div class="flex min-h-[100svh] min-w-0 flex-col bg-card min-[900px]:flex-row">
    <HomeNav starCount={data.starCount ?? null} />

    <main
        class="mx-auto flex w-full max-w-[80rem] min-w-0 flex-1 flex-col gap-14 px-4 pt-8 pb-6 sm:px-10 sm:pt-14 sm:pb-12 min-[900px]:justify-center min-[900px]:py-12"
    >
        <section aria-labelledby="home-title" class="flex max-w-[54rem] flex-col">
            <h1
                id="home-title"
                aria-label={description}
                class="m-0 font-[family-name:var(--font-header)] [font-size:var(--font-size-title)] [font-weight:var(--font-weight-body)] leading-[var(--leading-snug)] tracking-[var(--tracking-header)] text-pretty text-foreground-muted sm:[font-size:var(--font-size-display)]"
            >
                {#each headline as sentence, s (s)}
                    <span class={s === 0 ? 'text-foreground' : undefined} aria-hidden="true">
                        {#each sentence.split(' ') as word, w (w)}
                            <span
                                class="inline-block motion-safe:[animation:home-word_calc(var(--motion-duration-sheet)*2.4)_var(--ease-out)_both]"
                                style={wordDelay(firstWordIndex(s) + w)}
                                >{word}</span
                            >{' '}
                        {/each}
                    </span>
                {/each}
            </h1>

            <div class={`mt-6 flex flex-wrap items-center gap-2 ${riseClass}`} style={riseDelay(0)}>
                <Button href={resolve('/docs/components')} class="group">
                    Browse components
                    <ArrowRight
                        size={14}
                        aria-hidden="true"
                        class={`${nudgeClass} group-hover:translate-x-0.5`}
                    />
                </Button>
                <Button
                    href="https://github.com/aidan-neel/sivir-ui"
                    target="_blank"
                    rel="noreferrer"
                    variant="outline"
                    class="group"
                >
                    View on GitHub
                    <ArrowUpRight
                        size={14}
                        aria-hidden="true"
                        class={`${nudgeClass} group-hover:translate-x-px group-hover:-translate-y-px`}
                    />
                </Button>
            </div>

            <div
                role="presentation"
                onclick={copyCommand}
                class={`group mt-10 flex h-[var(--size-control-lg)] w-full cursor-pointer select-none items-center gap-2.5 rounded-[var(--radius-lg)] bg-background ps-3.5 pe-1 font-mono [font-size:var(--font-size-label)] shadow-[inset_0_0_0_var(--border-size)_var(--color-border)] transition-[background-color,box-shadow] [transition-duration:var(--motion-duration-hover)] ease-[var(--ease-out)] hover:bg-secondary hover:shadow-[inset_0_0_0_var(--border-size)_var(--color-border-strong)] motion-reduce:transition-none ${riseClass}`}
                style={riseDelay(1)}
            >
                <span
                    aria-hidden="true"
                    class="select-none text-foreground-muted/60 transition-colors [transition-duration:var(--motion-duration-hover)] group-hover:text-primary"
                    >$</span
                >
                <code
                    class="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-foreground-muted transition-colors [transition-duration:var(--motion-duration-hover)] [scrollbar-width:none] group-hover:text-foreground"
                    >{install}</code
                >
                <CopyButton
                    text={install}
                    label="Copy command"
                    copiedLabel="Copied"
                    tooltipDelay={500}
                    oncopy={() => trackEvent('install_command_copied', { source: 'home' })}
                />
            </div>
        </section>

        <div class={riseClass} style={riseDelay(2)}>
            <HomeDemo />
        </div>
    </main>
</div>
