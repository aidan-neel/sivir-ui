<script lang="ts" generics="T extends string">
    import * as Tabs from '@sivir-ui/svelte/components/tabs';
    import { cn } from '@sivir-ui/svelte/utils';

    type PreviewExample = {
        value: T;
        label: string;
    };

    let {
        label,
        options,
        value = $bindable(),
        size = 'md',
        class: classProp
    }: {
        label: string;
        options: readonly PreviewExample[];
        value: T;
        size?: 'sm' | 'md';
        class?: string;
    } = $props();

    function handleValueChange(next: string) {
        const match = options.find((option) => {
            return option.value === next;
        });

        if (match) {
            value = match.value;
        }
    }
</script>

<div role="group" aria-label={label} class="contents">
    <Tabs.Root {value} onValueChange={handleValueChange} variant="ghost" class="contents">
        <Tabs.List
            class={cn(
                classProp,
                'shrink-0 gap-0.5 [&_[role=tab]]:[font-weight:var(--font-weight-label)] [&_[role=tab]]:whitespace-nowrap [&_[role=tab]]:rounded-[var(--radius-md)] [&_[role=tab]]:py-0',
                size === 'sm'
                    ? '[&_[role=tab]]:h-6 [&_[role=tab]]:px-2 [&_[role=tab]]:text-xs'
                    : '[&_[role=tab]]:h-7 [&_[role=tab]]:px-2.5 [&_[role=tab]]:text-[0.8125rem]'
            )}
        >
            {#each options as option (option.value)}
                <Tabs.Trigger value={option.value}>{option.label}</Tabs.Trigger>
            {/each}
        </Tabs.List>
        {#each options as option (option.value)}
            <Tabs.Content value={option.value} forceMount class="hidden" />
        {/each}
    </Tabs.Root>
</div>
