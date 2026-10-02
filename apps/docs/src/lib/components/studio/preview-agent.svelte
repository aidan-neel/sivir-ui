<script lang="ts">
    import Plus from '@lucide/svelte/icons/plus';
    import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Composer from '@sivir-ui/svelte/components/composer';
    import * as Conversation from '@sivir-ui/svelte/components/conversation';
    import { CopyButton } from '@sivir-ui/svelte/components/copy-button';
    import * as FileDiff from '@sivir-ui/svelte/components/file-diff';
    import { Markdown } from '@sivir-ui/svelte/components/markdown';
    import * as Message from '@sivir-ui/svelte/components/message';
    import type { QuestionAnswer } from '@sivir-ui/svelte/components/question';
    import * as Question from '@sivir-ui/svelte/components/question';
    import * as Reasoning from '@sivir-ui/svelte/components/reasoning';
    import * as Select from '@sivir-ui/svelte/components/select';
    import { type TaskStep, TaskSteps } from '@sivir-ui/svelte/components/task-steps';
    import * as Tool from '@sivir-ui/svelte/components/tool';
    import { onDestroy } from 'svelte';

    type ShipOption = {
        value: string;
        label: string;
        reply: string;
        action: string;
        target: string;
        result: string;
    };

    const traceOutput = [
        'span                     p50     p95     Δ p95',
        'address.verify          188ms   612ms   +430ms',
        'inventory.reserve        41ms    96ms     +3ms',
        'db.orders.insert         12ms    31ms     +1ms',
        'payments.charge         204ms   388ms     -6ms'
    ].join('\n');
    const gitOutput = [
        'a41c9e2 Validate shipping addresses before charge',
        '7d02b18 Bump address-provider client to 3.2.0',
        'e9f5a77 Copy tweaks on the review step'
    ].join('\n');
    const finding = [
        'The slowdown starts with release `web-2418`, which moved address validation in front of the charge in `placeOrder`.',
        '',
        '| Span | p95 before | p95 after |',
        '| --- | --- | --- |',
        '| `address.verify` | 182 ms | 612 ms |',
        '| `payments.charge` | 394 ms | 388 ms |',
        '| `POST /checkout` | 801 ms | 1,231 ms |',
        '',
        'The address provider times out on about 8% of non-US requests, and each timeout waits the full 1.5 s before checkout continues. Inventory and the database are flat.',
        '',
        'I can move the check off the request path and verify the address after the charge. What should happen when a deferred check fails?'
    ].join('\n');
    const failedTest = [
        '✓ charges before verifying the address',
        '✗ holds orders that fail address checks',
        '  expected status "held", received "paid"',
        '1 passed, 1 failed in 1.62s'
    ].join('\n');
    const passedTest = [
        '✓ charges before verifying the address',
        '✓ holds orders that fail address checks',
        '✓ releases held orders after review',
        '3 passed in 1.84s'
    ].join('\n');
    const summary = [
        '`POST /checkout` p95 is back to **796 ms** in the preview build, down from 1,231 ms.',
        '',
        '- Address checks now run on the `verify-address` queue after the charge.',
        '- Orders that fail the check are marked **held** and land in the review queue.',
        '- A new `address.deferred` counter tracks how many checks moved off the request path.'
    ].join('\n');
    const patchSteps: TaskStep[] = [
        {
            id: 'defer',
            label: 'Move address check to the queue',
            meta: '2 files'
        },
        {
            id: 'hold',
            label: 'Hold orders that fail the check',
            meta: '1 file'
        },
        {
            id: 'tests',
            label: 'Update checkout tests',
            meta: '3 tests'
        },
        {
            id: 'verify',
            label: 'Compare latency in preview',
            meta: '796 ms'
        }
    ];
    const shipOptions: ShipOption[] = [
        {
            value: 'pull-request',
            label: 'Open a pull request',
            reply: 'Open a pull request.',
            action: 'Run',
            target: 'gh pr create --base main --head fix/defer-address-check',
            result: 'Opened pull request #482 and requested review from the checkout team.'
        },
        {
            value: 'staging',
            label: 'Deploy to staging',
            reply: 'Deploy it to staging.',
            action: 'Run',
            target: 'bun run deploy --env staging',
            result: 'Deployed to staging. I will report back if p95 rises above 900 ms.'
        },
        {
            value: 'local',
            label: 'Keep it local',
            reply: 'Keep it local for now.',
            action: 'Run',
            target: 'git commit -m "Defer address checks"',
            result: 'Committed to fix/defer-address-check. Nothing was pushed.'
        }
    ];
    const models = ['Sivir 3.1', 'Sivir Mini'];

    let shipAnswer = $state<QuestionAnswer>('');
    let shipChoice = $state<ShipOption | null>(null);
    let shipping = $state(false);
    let prompt = $state('');
    let model = $state(models[0]);
    let generating = $state(false);
    let timer: ReturnType<typeof setTimeout> | undefined;

    function clearTimer() {
        if (timer) {
            clearTimeout(timer);
        }

        timer = undefined;
    }

    function ship(answer: QuestionAnswer) {
        const choice = shipOptions.find((option) => {
            return option.value === answer;
        });

        if (!choice) {
            return;
        }

        shipChoice = choice;
        shipping = true;
        clearTimer();
        timer = setTimeout(() => {
            shipping = false;
            timer = undefined;
        }, 1800);
    }

    function restart() {
        clearTimer();
        shipAnswer = '';
        shipChoice = null;
        shipping = false;
        generating = false;
    }

    function submitPrompt() {
        prompt = '';
        generating = true;
        clearTimer();
        timer = setTimeout(() => {
            generating = false;
            timer = undefined;
        }, 2400);
    }

    function stopResponse() {
        clearTimer();
        generating = false;
    }

    onDestroy(clearTimer);
</script>

<div class="flex h-full min-h-0 flex-col gap-4">
    <Conversation.Root class="min-h-0 flex-1">
        <Conversation.Content aria-label="Agent conversation">
            <Message.Root from="user">
                <Message.Content>
                    Checkout got slow after the 14:00 deploy. Find the cause and patch it safely.
                </Message.Content>
            </Message.Root>

            <Message.Root from="assistant">
                <Message.Content class="space-y-4">
                    <Reasoning.Root>
                        <Reasoning.Trigger
                            title="Compared traces with the release timeline"
                            duration="4.8s"
                        />
                        <Reasoning.Content>
                            <p>
                                Pulled checkout traces for the last six hours and split them by
                                span. Only the address check moved, and its first slow request lines
                                up with the 14:02 rollout of web-2418.
                            </p>
                        </Reasoning.Content>
                    </Reasoning.Root>
                    <Tool.Root state="complete">
                        <Tool.Trigger
                            title="Queried traces, searched once, read 2 files, ran 1 command"
                            duration="5.6s"
                        />
                        <Tool.Content>
                            <Tool.Call
                                action="Query traces"
                                target="service:checkout last 6h"
                                duration="2.3s"
                            >
                                <Tool.Output>
                                    <pre class="font-mono text-xs leading-5">{traceOutput}</pre>
                                </Tool.Output>
                            </Tool.Call>
                            <Tool.Call action="Search" target="verifyAddress(" duration="61ms" />
                            <Tool.Call
                                action="Read file"
                                target="src/checkout/place-order.ts"
                                duration="11ms"
                            />
                            <Tool.Call
                                action="Read file"
                                target="src/queue/review.ts"
                                duration="9ms"
                            />
                            <Tool.Call
                                action="Run"
                                target="git log --oneline web-2417..web-2418"
                                duration="140ms"
                            >
                                <Tool.Output>
                                    <pre class="font-mono text-xs leading-5">{gitOutput}</pre>
                                </Tool.Output>
                            </Tool.Call>
                        </Tool.Content>
                    </Tool.Root>
                    <Markdown content={finding} />
                </Message.Content>
            </Message.Root>

            <Message.Root from="user">
                <Message.Content>
                    Charge first and hold the order for review if the address fails. Go ahead.
                </Message.Content>
            </Message.Root>

            <Message.Root from="assistant">
                <Message.Content class="space-y-4">
                    <TaskSteps steps={patchSteps} current={patchSteps.length} label="Patch plan" />
                    <Tool.Root state="complete">
                        <Tool.Trigger title="Edited 2 files, ran tests twice" duration="9.4s" />
                        <Tool.Content>
                            <Tool.Call
                                action="Edit file"
                                target="src/checkout/place-order.ts"
                                duration="18ms"
                            />
                            <Tool.Call
                                action="Edit file"
                                target="src/queue/review.ts"
                                duration="14ms"
                            />
                            <Tool.Call
                                action="Run"
                                target="bun test checkout"
                                duration="1.6s"
                                state="error"
                            >
                                <Tool.Output>
                                    <pre class="font-mono text-xs leading-5">{failedTest}</pre>
                                </Tool.Output>
                            </Tool.Call>
                            <Tool.Call
                                action="Edit file"
                                target="src/queue/review.ts"
                                duration="12ms"
                            />
                            <Tool.Call action="Run" target="bun test checkout" duration="1.8s">
                                <Tool.Output>
                                    <pre class="font-mono text-xs leading-5">{passedTest}</pre>
                                </Tool.Output>
                            </Tool.Call>
                        </Tool.Content>
                    </Tool.Root>
                    <FileDiff.Root
                        file="src/checkout/place-order.ts"
                        lang="ts"
                        additions={3}
                        deletions={2}
                    >
                        <FileDiff.Content>
                            <FileDiff.Row
                                type="context"
                                oldLine={41}
                                newLine={41}
                                code={'export async function placeOrder(order: Order) {'}
                            />
                            <FileDiff.Row
                                type="remove"
                                oldLine={42}
                                code={'  await verifyAddress(order.address);'}
                            />
                            <FileDiff.Row
                                type="remove"
                                oldLine={43}
                                code={'  const receipt = await charge(order);'}
                            />
                            <FileDiff.Row
                                type="add"
                                newLine={42}
                                code={'  const receipt = await charge(order);'}
                            />
                            <FileDiff.Row
                                type="add"
                                newLine={43}
                                code={"  queue.enqueue('verify-address', order.id);"}
                            />
                            <FileDiff.Row
                                type="add"
                                newLine={44}
                                code={"  metrics.count('address.deferred');"}
                            />
                            <FileDiff.Row
                                type="context"
                                oldLine={44}
                                newLine={45}
                                code={'  return receipt;'}
                            />
                        </FileDiff.Content>
                    </FileDiff.Root>
                    <FileDiff.Root file="src/queue/review.ts" lang="ts" additions={4} deletions={0}>
                        <FileDiff.Content>
                            <FileDiff.Row
                                type="context"
                                oldLine={18}
                                newLine={18}
                                code={"queue.handle('verify-address', async (orderId) => {"}
                            />
                            <FileDiff.Row
                                type="add"
                                newLine={19}
                                code={'  const order = await orders.get(orderId);'}
                            />
                            <FileDiff.Row
                                type="add"
                                newLine={20}
                                code={'  if (!(await verifyAddress(order.address))) {'}
                            />
                            <FileDiff.Row
                                type="add"
                                newLine={21}
                                code={"    await orders.update(orderId, { status: 'held' });"}
                            />
                            <FileDiff.Row type="add" newLine={22} code={'  }'} />
                            <FileDiff.Row type="context" oldLine={19} newLine={23} code={'});'} />
                        </FileDiff.Content>
                    </FileDiff.Root>
                    <Markdown content={summary} />
                </Message.Content>
                <Message.Actions aria-label="Assistant response actions">
                    <CopyButton text={summary} label="Copy" copiedLabel="Copied" />
                </Message.Actions>
            </Message.Root>

            {#if shipChoice}
                <Message.Root from="user">
                    <Message.Content>{shipChoice.reply}</Message.Content>
                </Message.Root>

                <Message.Root from="assistant">
                    <Message.Content class="space-y-4">
                        <Tool.Root state={shipping ? 'running' : 'complete'}>
                            <Tool.Trigger
                                title={shipping ? 'Running 1 command' : 'Ran 1 command'}
                                duration={shipping ? undefined : '1.8s'}
                            />
                            <Tool.Content>
                                <Tool.Call
                                    action={shipChoice.action}
                                    target={shipChoice.target}
                                    state={shipping ? 'running' : 'complete'}
                                />
                            </Tool.Content>
                        </Tool.Root>
                        {#if !shipping}
                            <p>{shipChoice.result}</p>
                        {/if}
                    </Message.Content>
                </Message.Root>
            {/if}
        </Conversation.Content>
        <Conversation.ScrollButton />
    </Conversation.Root>

    <div class="@container shrink-0">
        {#if shipChoice}
            <Composer.Root
                bind:value={prompt}
                {generating}
                onSubmit={submitPrompt}
                onStop={stopResponse}
            >
                <Composer.Input aria-label="Prompt" placeholder="Ask a follow-up…" />
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
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Restart the session"
                            class="rounded-full text-foreground-muted hover:text-foreground"
                            onclick={restart}
                        >
                            <RotateCcw size={15} aria-hidden="true" />
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
        {:else}
            <Question.Root variant="inset" bind:value={shipAnswer} required onSubmit={ship}>
                <Question.Content>
                    <Question.Title>The fix is ready. How should I ship it?</Question.Title>
                    <Question.Description>
                        Branch fix/defer-address-check has 1 commit and passing tests.
                    </Question.Description>
                    <Question.Options>
                        {#each shipOptions as option (option.value)}
                            <Question.Option value={option.value} label={option.label} />
                        {/each}
                    </Question.Options>
                </Question.Content>
                <Question.Actions>
                    <Question.Submit label="Ship" />
                </Question.Actions>
            </Question.Root>
        {/if}
    </div>
</div>
