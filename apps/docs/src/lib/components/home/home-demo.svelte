<script lang="ts">
    import Plus from '@lucide/svelte/icons/plus';
    import Settings from '@lucide/svelte/icons/settings';
    import SquarePen from '@lucide/svelte/icons/square-pen';
    import * as Avatar from '@sivir-ui/svelte/components/avatar';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Composer from '@sivir-ui/svelte/components/composer';
    import * as Conversation from '@sivir-ui/svelte/components/conversation';
    import { CopyButton } from '@sivir-ui/svelte/components/copy-button';
    import type { FileDiffLine } from '@sivir-ui/svelte/components/file-diff';
    import * as FileDiff from '@sivir-ui/svelte/components/file-diff';
    import { Markdown } from '@sivir-ui/svelte/components/markdown';
    import * as Message from '@sivir-ui/svelte/components/message';
    import * as Select from '@sivir-ui/svelte/components/select';
    import { Spinner } from '@sivir-ui/svelte/components/spinner';
    import { Switch } from '@sivir-ui/svelte/components/switch';
    import { type TaskStep, TaskSteps } from '@sivir-ui/svelte/components/task-steps';
    import * as ToggleGroup from '@sivir-ui/svelte/components/toggle-group';
    import * as Tool from '@sivir-ui/svelte/components/tool';
    import * as Tooltip from '@sivir-ui/svelte/components/tooltip';
    import { builtInThemePresets } from '@sivir-ui/svelte/themes/builtin-presets';
    import {
        applyLiveThemeCss,
        clearLiveThemeCss,
        getStoredLiveThemeCss
    } from '@sivir-ui/svelte/themes/live';
    import { themeToCss } from '@sivir-ui/svelte/themes/theme';
    import { onDestroy, onMount } from 'svelte';

    type Thread = {
        id: string;
        title: string;
        repo: string;
        branch: string;
        updated: string;
        prompt: string;
        reply: string;
    };

    type ThreadGroup = {
        label: string;
        threads: Thread[];
    };

    type FollowUp = {
        id: number;
        prompt: string;
        done: boolean;
    };

    type ChangedFile = {
        path: string;
        additions: number;
        deletions: number;
    };

    const threadGroups: ThreadGroup[] = [
        {
            label: 'Today',
            threads: [
                {
                    id: 'rate-limit',
                    title: 'Rate-limit the public API',
                    repo: 'northwind/api',
                    branch: 'feat/rate-limit',
                    updated: '2m',
                    prompt: '',
                    reply: ''
                },
                {
                    id: 'billing-test',
                    title: 'Fix the flaky invoice test',
                    repo: 'northwind/api',
                    branch: 'fix/invoice-clock',
                    updated: '1h',
                    prompt: 'The invoice total test fails about once a day in CI. Find out why.',
                    reply: 'The test builds invoices with `new Date()` and asserts on the billing period. Runs that cross midnight UTC land in the next period. I froze the clock with `vi.setSystemTime` and the test passed 500 runs in a row.'
                }
            ]
        },
        {
            label: 'Yesterday',
            threads: [
                {
                    id: 'audit-export',
                    title: 'Export the audit log as CSV',
                    repo: 'northwind/web',
                    branch: 'feat/audit-csv',
                    updated: '1d',
                    prompt: 'Admins want to download the audit log. Add a CSV export to the audit page.',
                    reply: 'Added **Export CSV** to the audit page. It streams rows from `GET /audit/export`, so large workspaces do not load the whole log into memory. Filters on the page apply to the export.'
                },
                {
                    id: 'onboarding-copy',
                    title: 'Tighten the onboarding copy',
                    repo: 'northwind/web',
                    branch: 'copy/onboarding',
                    updated: '1d',
                    prompt: 'Rewrite the three onboarding steps so each one fits on a single line.',
                    reply: 'Shortened all three steps to one line each and moved the details into the help links. The longest step is now 46 characters, down from 112.'
                }
            ]
        }
    ];

    const threads = threadGroups.flatMap((group) => {
        return group.threads;
    });

    const findings =
        'Every request passes through `authenticate`, so the limiter sits right after it and keys on the API key. It uses a sliding window in Redis, so a client cannot burst across a minute boundary.';

    const summary = [
        'Each API key now gets **100 requests per minute**. Over the limit, the API returns `429` and tells the client when to retry.',
        '',
        '`bun test api` passes, including 4 new limiter tests.'
    ].join('\n');

    const testOutput = [
        '✓ allows 100 requests in a minute',
        '✓ rejects the 101st request with 429',
        '✓ sets Retry-After to the window reset',
        '✓ tracks keys independently',
        '18 passed in 2.41s'
    ].join('\n');

    const diff: FileDiffLine[] = [
        {
            type: 'context',
            oldLineNumber: 9,
            newLineNumber: 9,
            content: '  .use(authenticate)'
        },
        {
            type: 'add',
            newLineNumber: 10,
            content: '  .use(rateLimit({ limit: 100, window: "1m" }))'
        },
        {
            type: 'remove',
            oldLineNumber: 10,
            content: '  .route("/v1", routes);'
        },
        {
            type: 'add',
            newLineNumber: 11,
            content: '  .route("/v1", routes)'
        },
        {
            type: 'add',
            newLineNumber: 12,
            content: '  .onError(rateLimitErrors);'
        }
    ];

    const changedFiles: ChangedFile[] = [
        {
            path: 'src/middleware/rate-limit.ts',
            additions: 52,
            deletions: 0
        },
        {
            path: 'src/app.ts',
            additions: 3,
            deletions: 1
        },
        {
            path: 'test/rate-limit.test.ts',
            additions: 64,
            deletions: 0
        }
    ];

    const checks: TaskStep[] = [
        {
            id: 'typecheck',
            label: 'Typecheck',
            meta: '6.2s'
        },
        {
            id: 'tests',
            label: 'Unit tests',
            meta: '18 passed'
        },
        {
            id: 'preview',
            label: 'Preview deploy',
            meta: '21s'
        }
    ];

    const models = ['Sivir 3.1', 'Sivir Mini'];
    const branches = ['main', 'release/2.4'];

    let {
        themePicker = true
    }: {
        themePicker?: boolean;
    } = $props();

    const metaClass = '[font-size:var(--font-size-label)] text-foreground-muted';
    const headingClass =
        'm-0 [font-size:var(--font-size-body)] [font-weight:var(--font-weight-label)] text-foreground';

    let themeSlug = $state<string | undefined>('sivir');
    let appliedSlug: string | undefined = 'sivir';
    let activeId = $state('rate-limit');
    let prompt = $state('');
    let model = $state(models[0]);
    let baseBranch = $state(branches[0]);
    let autoMerge = $state(true);
    let checksDone = $state(0);
    let pullRequestOpened = $state(false);
    let followUps = $state<Record<string, FollowUp[]>>({});
    let generating = $state(false);
    let replyTimer: ReturnType<typeof setTimeout> | undefined;
    let checksTimer: ReturnType<typeof setInterval> | undefined;

    const active = $derived(
        threads.find((thread) => {
            return thread.id === activeId;
        }) ?? threads[0]
    );
    const activeFollowUps = $derived(followUps[activeId] ?? []);
    const additions = changedFiles.reduce((total, file) => {
        return total + file.additions;
    }, 0);
    const deletions = changedFiles.reduce((total, file) => {
        return total + file.deletions;
    }, 0);

    onMount(() => {
        const stored = getStoredLiveThemeCss();

        if (stored) {
            const match = builtInThemePresets.find((preset) => {
                return themeToCss(preset) === stored;
            });

            themeSlug = match?.slug;
            appliedSlug = themeSlug;
        }

        checksTimer = setInterval(() => {
            checksDone += 1;

            if (checksDone >= checks.length) {
                clearInterval(checksTimer);
            }
        }, 1400);
    });

    onDestroy(() => {
        clearTimeout(replyTimer);
        clearInterval(checksTimer);
    });

    function selectTheme(value: string | string[] | undefined) {
        const preset = builtInThemePresets.find((option) => {
            return option.slug === value;
        });

        if (!preset) {
            themeSlug = appliedSlug;
            return;
        }

        appliedSlug = preset.slug;

        if (preset.slug === 'sivir') {
            clearLiveThemeCss();
            return;
        }

        applyLiveThemeCss(themeToCss(preset));
    }

    function selectThread(id: string) {
        stopResponse();
        activeId = id;
    }

    function submitPrompt(value: string) {
        const threadId = activeId;
        const followUp: FollowUp = {
            id: Date.now(),
            prompt: value,
            done: false
        };

        followUps[threadId] = [...(followUps[threadId] ?? []), followUp];
        prompt = '';
        generating = true;
        clearTimeout(replyTimer);
        replyTimer = setTimeout(() => {
            finishFollowUps(threadId);
        }, 2200);
    }

    function finishFollowUps(threadId: string) {
        followUps[threadId] = (followUps[threadId] ?? []).map((followUp) => {
            return {
                ...followUp,
                done: true
            };
        });
        generating = false;
        replyTimer = undefined;
    }

    function stopResponse() {
        clearTimeout(replyTimer);

        if (generating) {
            finishFollowUps(activeId);
        }
    }
</script>

<div class="flex flex-col gap-3">
    {#if themePicker}
        <div
            class="flex max-w-full min-w-0 items-center gap-3 self-end overflow-x-auto [scrollbar-width:none]"
        >
            <span class={metaClass}>Theme</span>
            <ToggleGroup.Root type="single" bind:value={themeSlug} onValueChange={selectTheme}>
                {#each builtInThemePresets as preset (preset.slug)}
                    <ToggleGroup.Item value={preset.slug}>{preset.name}</ToggleGroup.Item>
                {/each}
            </ToggleGroup.Root>
        </div>
    {/if}

    <section
        aria-label="Coding agent workspace built with Sivir components"
        class="@container overflow-hidden rounded-[var(--radius-xl)] border-[length:var(--border-size)] border-border bg-panel"
    >
        <div class="flex h-[36rem] @3xl:h-[45rem]">
            <nav
                aria-label="Threads"
                class="hidden w-60 shrink-0 flex-col border-e-[length:var(--border-size)] border-border bg-background @6xl:flex"
            >
                <div class="flex h-13 shrink-0 items-center gap-2.5 ps-4 pe-2">
                    <Avatar.Root size="sm" shape="square">
                        <Avatar.Fallback>N</Avatar.Fallback>
                    </Avatar.Root>
                    <span class={`flex-1 truncate ${headingClass}`}>Northwind</span>
                    <Tooltip.Root delay={500}>
                        <Tooltip.Trigger>
                            <Button variant="ghost" size="icon" aria-label="New thread">
                                <SquarePen size={15} aria-hidden="true" />
                            </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content>New thread</Tooltip.Content>
                    </Tooltip.Root>
                </div>

                <div class="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-2 pt-2 pb-4">
                    {#each threadGroups as group (group.label)}
                        <div class="flex flex-col gap-1">
                            <p class={`m-0 px-2 pb-1 ${metaClass}`}>
                                {group.label}
                            </p>
                            <ul class="m-0 flex list-none flex-col gap-0.5 p-0">
                                {#each group.threads as thread (thread.id)}
                                    <li>
                                        <button
                                            type="button"
                                            aria-current={thread.id === activeId
                                                ? 'page'
                                                : undefined}
                                            onclick={() => {
                                                selectThread(thread.id);
                                            }}
                                            class="flex w-full cursor-[var(--ui-cursor-interactive)] flex-col items-start gap-0.5 rounded-[var(--radius-lg)] px-2 py-1.5 text-start transition-colors [transition-duration:var(--motion-duration-hover)] ease-[var(--ease-out)] hover:bg-foreground/[0.04] focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none aria-[current=page]:bg-foreground/[0.08] motion-reduce:transition-none"
                                        >
                                            <span class="flex w-full min-w-0 items-center gap-2">
                                                <span
                                                    class="flex-1 truncate [font-size:var(--font-size-body)] text-foreground"
                                                >
                                                    {thread.title}
                                                </span>
                                                {#if generating && thread.id === activeId}
                                                    <Spinner size={12} />
                                                {/if}
                                            </span>
                                            <span class={`w-full truncate ${metaClass}`}>
                                                {thread.repo}
                                                · {thread.updated}
                                            </span>
                                        </button>
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    {/each}
                </div>

                <div
                    class="flex shrink-0 items-center gap-2.5 border-t-[length:var(--border-size)] border-border py-2 ps-4 pe-2"
                >
                    <Avatar.Root size="sm">
                        <Avatar.Fallback>MR</Avatar.Fallback>
                    </Avatar.Root>
                    <span class="flex-1 truncate [font-size:var(--font-size-body)] text-foreground">
                        Maya Reyes
                    </span>
                    <Tooltip.Root delay={500}>
                        <Tooltip.Trigger>
                            <Button variant="ghost" size="icon" aria-label="Settings">
                                <Settings size={15} aria-hidden="true" />
                            </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content>Settings</Tooltip.Content>
                    </Tooltip.Root>
                </div>
            </nav>

            <div class="flex min-w-0 flex-1 flex-col">
                <header
                    class="flex h-13 shrink-0 items-center gap-3 border-b-[length:var(--border-size)] border-border px-4"
                >
                    <div class="flex min-w-0 flex-1 items-baseline gap-2.5">
                        <p class={`truncate ${headingClass}`}>{active.title}</p>
                        <span class={`hidden truncate font-mono @2xl:inline ${metaClass}`}>
                            {active.branch}
                        </span>
                    </div>
                    <Button variant="outline">Share</Button>
                </header>

                <Conversation.Root class="min-h-0 flex-1">
                    <Conversation.Content aria-label={`${active.title} conversation`}>
                        {#if active.id === 'rate-limit'}
                            <Message.Root from="user">
                                <Message.Content>
                                    Add per-key rate limits to the public API. 100 requests a
                                    minute, and return a proper 429 when a client goes over.
                                </Message.Content>
                            </Message.Root>

                            <Message.Root from="assistant">
                                <Message.Content class="space-y-4">
                                    <Tool.Root>
                                        <Tool.Trigger summary="Searched twice, read 3 files" />
                                        <Tool.Content>
                                            <Tool.Call action="Searched" target="authenticate(" />
                                            <Tool.Call
                                                action="Searched"
                                                target="redis.createClient"
                                            />
                                            <Tool.Call action="Read" target="src/app.ts" />
                                            <Tool.Call
                                                action="Read"
                                                target="src/middleware/auth.ts"
                                            />
                                            <Tool.Call action="Read" target="src/lib/redis.ts" />
                                        </Tool.Content>
                                    </Tool.Root>
                                    <Markdown content={findings} />
                                    <FileDiff.Root file="src/app.ts" lang="ts" {diff} />
                                    <Tool.Root>
                                        <Tool.Trigger summary="Created 2 files, ran 1 command" />
                                        <Tool.Content>
                                            <Tool.Call
                                                action="Created"
                                                target="src/middleware/rate-limit.ts"
                                            />
                                            <Tool.Call
                                                action="Created"
                                                target="test/rate-limit.test.ts"
                                            />
                                            <Tool.Call action="Ran" target="bun test api">
                                                <Tool.Output>
                                                    <pre
                                                        class="font-mono text-xs leading-5"
                                                    >{testOutput}</pre>
                                                </Tool.Output>
                                            </Tool.Call>
                                        </Tool.Content>
                                    </Tool.Root>
                                    <Markdown content={summary} />
                                </Message.Content>
                                <Message.Actions aria-label="Assistant response actions">
                                    <CopyButton
                                        text={summary}
                                        label="Copy"
                                        copiedLabel="Copied"
                                        tooltipDelay={500}
                                    />
                                </Message.Actions>
                            </Message.Root>
                        {:else}
                            <Message.Root from="user">
                                <Message.Content>{active.prompt}</Message.Content>
                            </Message.Root>

                            <Message.Root from="assistant">
                                <Message.Content>
                                    <Markdown content={active.reply} />
                                </Message.Content>
                            </Message.Root>
                        {/if}

                        {#each activeFollowUps as followUp (followUp.id)}
                            <Message.Root from="user">
                                <Message.Content>{followUp.prompt}</Message.Content>
                            </Message.Root>

                            <Message.Root
                                from="assistant"
                                status={followUp.done ? 'idle' : 'streaming'}
                            >
                                <Message.Content class="space-y-4">
                                    <Tool.Root running={!followUp.done}>
                                        <Tool.Trigger
                                            status="Running tests"
                                            summary="Edited 1 file, ran 1 command"
                                        />
                                        <Tool.Content>
                                            <Tool.Call
                                                action={followUp.done ? 'Ran' : 'Running'}
                                                target={`bun test ${active.repo.split('/')[1]}`}
                                                state={followUp.done ? 'complete' : 'running'}
                                            />
                                        </Tool.Content>
                                    </Tool.Root>
                                    {#if followUp.done}
                                        <p class="m-0">
                                            Done. I pushed the change to
                                            <code class="font-mono">{active.branch}</code>
                                            and the tests still pass.
                                        </p>
                                    {/if}
                                </Message.Content>
                            </Message.Root>
                        {/each}
                    </Conversation.Content>
                    <Conversation.ScrollButton />
                </Conversation.Root>

                <div class="@container shrink-0 px-4 pb-4">
                    <Composer.Root
                        bind:value={prompt}
                        {generating}
                        onSubmit={submitPrompt}
                        onStop={stopResponse}
                    >
                        <Composer.Input aria-label="Prompt" placeholder="Ask for a follow-up" />
                        <Composer.Toolbar>
                            <Composer.Actions>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Add files"
                                    class="rounded-full text-foreground-muted hover:text-foreground"
                                >
                                    <Plus size={16} aria-hidden="true" />
                                </Button>
                            </Composer.Actions>
                            <div class="ml-auto flex min-w-0 items-center gap-1">
                                <Select.Root bind:value={model}>
                                    <Select.Trigger
                                        variant="ghost"
                                        class="h-8 w-auto gap-1 rounded-full px-2.5 text-foreground-muted hover:text-foreground"
                                        aria-label="Model"
                                    >
                                        {model}
                                    </Select.Trigger>
                                    <Select.Content dynamic>
                                        {#each models as option (option)}
                                            <Select.Item value={option}>{option}</Select.Item>
                                        {/each}
                                    </Select.Content>
                                </Select.Root>
                                <Composer.Submit />
                            </div>
                        </Composer.Toolbar>
                    </Composer.Root>
                </div>
            </div>

            <aside
                aria-label="Review changes"
                class="hidden w-80 shrink-0 flex-col border-s-[length:var(--border-size)] border-border @3xl:flex"
            >
                <div
                    class="flex h-13 shrink-0 items-center justify-between gap-3 border-b-[length:var(--border-size)] border-border px-4"
                >
                    <p class={headingClass}>Changes</p>
                    <span class="font-mono [font-size:var(--font-size-label)] tabular-nums">
                        <span class="text-success">+{additions}</span>
                        <span class="text-error">−{deletions}</span>
                    </span>
                </div>

                <div class="flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto p-4">
                    <ul class="m-0 flex list-none flex-col gap-2.5 p-0">
                        {#each changedFiles as file (file.path)}
                            <li class="flex items-center gap-3">
                                <span
                                    class="min-w-0 flex-1 truncate font-mono [font-size:var(--font-size-label)] text-foreground"
                                >
                                    {file.path}
                                </span>
                                <span
                                    class="shrink-0 font-mono [font-size:var(--font-size-label)] tabular-nums"
                                >
                                    <span class="text-success">+{file.additions}</span>
                                    {#if file.deletions > 0}
                                        <span class="text-error">−{file.deletions}</span>
                                    {/if}
                                </span>
                            </li>
                        {/each}
                    </ul>

                    <div class="flex flex-col gap-3">
                        <p class={headingClass}>Checks</p>
                        <TaskSteps steps={checks} current={checksDone} label="Checks" />
                    </div>

                    <div class="flex flex-col gap-5">
                        <div class="flex flex-col gap-1.5">
                            <span
                                class="[font-size:var(--font-size-label)] [font-weight:var(--font-weight-label)] [letter-spacing:var(--tracking-label)] leading-none text-foreground"
                            >
                                Merge into
                            </span>
                            <Select.Root bind:value={baseBranch}>
                                <Select.Trigger aria-label="Merge into" class="font-mono">
                                    {baseBranch}
                                </Select.Trigger>
                                <Select.Content>
                                    {#each branches as branch (branch)}
                                        <Select.Item value={branch} class="font-mono">
                                            {branch}
                                        </Select.Item>
                                    {/each}
                                </Select.Content>
                            </Select.Root>
                        </div>

                        <Switch
                            bind:checked={autoMerge}
                            label="Merge when checks pass"
                            description="Squash into one commit."
                        />
                    </div>
                </div>

                <div class="shrink-0 border-t-[length:var(--border-size)] border-border p-4">
                    {#if pullRequestOpened}
                        <Button variant="outline" class="w-full">View pull request #214</Button>
                    {:else}
                        <Button
                            class="w-full"
                            onclick={() => {
                                pullRequestOpened = true;
                            }}
                        >
                            Create pull request
                        </Button>
                    {/if}
                </div>
            </aside>
        </div>
    </section>
</div>
