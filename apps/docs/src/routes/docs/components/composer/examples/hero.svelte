<script lang="ts">
    import Check from '@lucide/svelte/icons/check';
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import Plus from '@lucide/svelte/icons/plus';
    import ShieldCheck from '@lucide/svelte/icons/shield-check';
    import Workflow from '@lucide/svelte/icons/workflow';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Composer from '@sivir-ui/svelte/components/composer';
    import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';
    import * as Select from '@sivir-ui/svelte/components/select';
    import { onDestroy } from 'svelte';

    const models = ['Sivir 3.1', 'Sivir Mini'];
    const modes = ['Plan', 'Build'];
    const permissions = ['Ask first', 'Auto approve'];
    const efforts = ['Low', 'Medium', 'High'];

    let value = $state('Review the release notes and call out any migration risks.');
    let model = $state(models[0]);
    let mode = $state(modes[0]);
    let permission = $state(permissions[0]);
    let effort = $state(efforts[2]);
    let generating = $state(false);
    let timer: ReturnType<typeof setTimeout> | undefined;

    function clearTimer() {
        if (timer) {
            clearTimeout(timer);
        }
        timer = undefined;
    }

    async function submitPrompt() {
        await new Promise<void>((resolve) => {
            setTimeout(resolve, 600);
        });
        value = '';
        generating = true;
        clearTimer();
        timer = setTimeout(() => {
            generating = false;
            timer = undefined;
        }, 4000);
    }

    function stopResponse() {
        clearTimer();
        generating = false;
    }

    onDestroy(clearTimer);
</script>

<div class="@container flex w-full max-w-2xl flex-col">
    <Composer.Root bind:value {generating} onSubmit={submitPrompt} onStop={stopResponse}>
        <Composer.Input aria-label="Prompt" placeholder="Ask the agent..." />

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

                <Select.Root bind:value={mode}>
                    <Select.Trigger
                        variant="ghost"
                        class="h-8 w-auto max-w-32 gap-1 rounded-full px-2.5 text-foreground-muted hover:text-foreground"
                    >
                        <Workflow size={14} aria-hidden="true" />
                        <span class="truncate @max-md:hidden">{mode}</span>
                    </Select.Trigger>
                    <Select.Content dynamic>
                        <Select.Label>Mode</Select.Label>
                        {#each modes as option (option)}
                            <Select.Item value={option}>{option}</Select.Item>
                        {/each}
                    </Select.Content>
                </Select.Root>

                <Select.Root bind:value={permission}>
                    <Select.Trigger
                        variant="ghost"
                        class="h-8 w-auto max-w-44 gap-1 rounded-full px-2.5 text-foreground-muted hover:text-foreground"
                    >
                        <ShieldCheck size={14} aria-hidden="true" />
                        <span class="truncate @max-md:hidden">{permission}</span>
                    </Select.Trigger>
                    <Select.Content dynamic>
                        <Select.Label>Permission</Select.Label>
                        {#each permissions as option (option)}
                            <Select.Item value={option}>{option}</Select.Item>
                        {/each}
                    </Select.Content>
                </Select.Root>
            </Composer.Actions>

            <div class="ml-auto flex min-w-0 items-center gap-1">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger
                        variant="ghost"
                        class="h-8 w-auto max-w-52 rounded-full px-2.5"
                    >
                        <span class="flex min-w-0 flex-1 items-center gap-1.5">
                            <span class="truncate">{model}</span>
                            <span class="text-foreground-muted @max-md:hidden">{effort}</span>
                        </span>
                        <ChevronDown
                            size={12}
                            class="ml-auto shrink-0 text-foreground-muted"
                            aria-hidden="true"
                        />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content dynamic>
                        <DropdownMenu.Label>Configuration</DropdownMenu.Label>
                        <DropdownMenu.Sub>
                            <DropdownMenu.SubTrigger>Model</DropdownMenu.SubTrigger>
                            <DropdownMenu.SubContent dynamic>
                                {#each models as option (option)}
                                    <DropdownMenu.Item callback={() => (model = option)}>
                                        <span class="flex-1">{option}</span>
                                        {#if model === option}
                                            <Check size={13} aria-hidden="true" />
                                        {/if}
                                    </DropdownMenu.Item>
                                {/each}
                            </DropdownMenu.SubContent>
                        </DropdownMenu.Sub>
                        <DropdownMenu.Sub>
                            <DropdownMenu.SubTrigger>Effort</DropdownMenu.SubTrigger>
                            <DropdownMenu.SubContent dynamic>
                                {#each efforts as option (option)}
                                    <DropdownMenu.Item callback={() => (effort = option)}>
                                        <span class="flex-1">{option}</span>
                                        {#if effort === option}
                                            <Check size={13} aria-hidden="true" />
                                        {/if}
                                    </DropdownMenu.Item>
                                {/each}
                            </DropdownMenu.SubContent>
                        </DropdownMenu.Sub>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>

                <Composer.Submit />
            </div>
        </Composer.Toolbar>
    </Composer.Root>
</div>
