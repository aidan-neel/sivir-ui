<script lang="ts">
    import * as Tabs from '@sivir-ui/svelte/components/tabs';
    import { getCssDuration } from '@sivir-ui/svelte/transition';
    import { cn } from '@sivir-ui/svelte/utils';
    import { setContext, tick, untrack } from 'svelte';
    import type { CodeBlockProps, CodeBlockRegistry, CodeBlockTab } from '.';
    import Actions from './code-block-actions.svelte';
    import Content from './code-block-content.svelte';
    import Header from './code-block-header.svelte';
    import List from './code-block-list.svelte';
    import Trigger from './code-block-trigger.svelte';

    let {
        children,
        class: className,
        value = $bindable(),
        tabs,
        code,
        lang,
        showLineNumbers = false,
        copy = 'actionbar',
        actions,
        theme = 'sivir',
        ...rest
    }: CodeBlockProps = $props();

    const SINGLE = '__single__';

    /**
     * High-level when `tabs` (multi-language) or `code` (single snippet) is given.
     * Otherwise the caller composes the subparts as children.
     */
    const resolvedTabs = $derived<CodeBlockTab[]>(
        (tabs ?? []).map((t) => {
            return {
                ...t,
                value: t.value ?? t.lang
            };
        })
    );
    const isHighLevel = $derived(tabs != null || code != null);
    const hasTabRow = $derived(resolvedTabs.length > 0);
    const bodyCopy = $derived<'overlay' | 'inline' | undefined>(
        copy === 'actionbar' ? undefined : copy
    );

    /**
     * Seeds the active tab before the first render, reading the raw props because
     * the derived above is not ready during init.
     */
    const initialValue = untrack(() => {
        const firstTab = tabs?.[0];
        return firstTab ? (firstTab.value ?? firstTab.lang) : code != null ? SINGLE : '';
    });
    value ??= initialValue;

    /**
     * Raw code per tab -- Copy reads the active one -- plus the active/order
     * tracking that drives the directional slide between tabs.
     */
    const registry = $state({
        codes: {},
        langs: {},
        active: untrack(() => value ?? ''),
        order: [],
        contained: untrack(() => isHighLevel),
        theme: untrack(() => theme)
    } as CodeBlockRegistry);
    setContext('code-block', registry);

    $effect(() => {
        registry.active = value ?? '';
        registry.contained = isHighLevel;
        registry.theme = theme;
    });

    let surface = $state<HTMLDivElement>();
    let previousValue = untrack(() => value);
    let renderedHeight = 0;
    let resize: Animation | undefined;

    $effect(() => {
        const node = surface;

        if (!node) {
            return;
        }
        renderedHeight = node.getBoundingClientRect().height;
        const observer = new ResizeObserver(() => {
            renderedHeight = node.getBoundingClientRect().height;
        });

        observer.observe(node);

        return () => {
            observer.disconnect();
        };
    });

    /**
     * Eases the shared surface from its last rendered height to the incoming
     * panel's height so switching between snippets of different lengths does not
     * jump the layout. The observer lags the DOM by a frame, which is what keeps
     * the outgoing height available here.
     */
    $effect.pre(() => {
        const next = value;

        if (next === previousValue) {
            return;
        }
        previousValue = next;

        const node = untrack(() => surface);

        if (!node || renderedHeight === 0) {
            return;
        }
        const from = renderedHeight;

        resize?.cancel();
        tick().then(() => {
            animateSurface(node, from);
        });
    });

    function animateSurface(node: HTMLDivElement, from: number) {
        const to = node.getBoundingClientRect().height;
        const duration = getCssDuration(node, '--motion-duration-panel', 180) * 1.5;
        if (Math.abs(to - from) < 1 || duration <= 0) {
            return;
        }
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        const easing = getComputedStyle(node).getPropertyValue('--ease-out').trim() || 'ease-out';

        resize = node.animate(
            [
                {
                    flexGrow: 0,
                    flexBasis: `${from}px`,
                    overflow: 'hidden'
                },
                {
                    flexGrow: 0,
                    flexBasis: `${to}px`,
                    overflow: 'hidden'
                }
            ],
            {
                duration,
                easing
            }
        );
    }
</script>

<div
    data-ui="code-block"
    class={cn(
        className,
        'sivir-inset-frame flex max-h-[var(--code-block-max-height)] w-full flex-col overflow-hidden text-foreground',
        // token-lint-disable-next-line no-literal-length: code-block geometry contract
        '[--code-block-gutter:var(--color-foreground-muted)] [--code-block-padding-x:1.1rem] [--code-block-padding-y:0.9rem] [--code-block-line-height:1.7] [--code-block-max-height:min(32rem,70vh)] [--code-block-slide:1.25rem]'
    )}
    {...rest}
>
    <Tabs.Root bind:value variant="segmented" class="contents">
        {#if isHighLevel}
            {#if hasTabRow || actions || copy === 'actionbar'}
                <Header>
                    {#if hasTabRow}
                        <List>
                            {#each resolvedTabs as t (t.value)}
                                <Trigger value={t.value as string}>{t.label}</Trigger>
                            {/each}
                        </List>
                    {/if}
                    <Actions copy={copy === 'actionbar'}> {@render actions?.()} </Actions>
                </Header>
            {/if}
            {#if hasTabRow || code != null}
                <!-- The static card: holds the background/ring while only the text
				     panels slide inside it (and clips the slide). -->
                <div
                    bind:this={surface}
                    data-ui="code-block-surface"
                    class={cn(
                        'sivir-inset-surface relative flex min-h-0 w-full self-stretch flex-1 overflow-auto'
                    )}
                >
                    {#if hasTabRow}
                        {#each resolvedTabs as t (t.value)}
                            <Content
                                value={t.value as string}
                                code={t.code}
                                lang={t.lang}
                                {showLineNumbers}
                                copyPlacement={bodyCopy}
                            />
                        {/each}
                    {:else if code != null}
                        <Content
                            value={SINGLE}
                            {code}
                            {lang}
                            {showLineNumbers}
                            copyPlacement={bodyCopy}
                        />
                    {/if}
                </div>
            {/if}
        {:else}
            {@render children?.()}
        {/if}
    </Tabs.Root>
</div>
