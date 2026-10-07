<script lang="ts" generics="T extends string">
    import * as Select from '@sivir-ui/svelte/components/select';
    import { cn } from '@sivir-ui/svelte/utils';

    type PreviewOption = {
        value: T;
        label: string;
    };

    let {
        label,
        options,
        value = $bindable(),
        placeholder,
        class: classProp
    }: {
        label: string;
        options: readonly PreviewOption[];
        value: T | '';
        placeholder?: string;
        class?: string;
    } = $props();

    let labelWidth = $state(0);

    const selected = $derived(
        options.find((option) => {
            return option.value === value;
        })
    );

    function handleValueChange(next: string) {
        const match = options.find((option) => {
            return option.value === next;
        });

        if (match) {
            value = match.value;
        }
    }
</script>

<Select.Root {value} onValueChange={handleValueChange}>
    <Select.Trigger
        variant="ghost"
        size="sm"
        aria-label={`${label}: ${selected?.label ?? placeholder ?? value}`}
        class={cn('h-7 text-[0.8125rem]', classProp)}
    >
        <span
            style:width={labelWidth ? `${labelWidth}px` : undefined}
            class="inline-flex overflow-hidden transition-[width] duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none"
        >
            <span bind:offsetWidth={labelWidth} class="shrink-0 whitespace-nowrap">
                {selected?.label ?? placeholder ?? value}
            </span>
        </span>
    </Select.Trigger>
    <Select.Content>
        {#each options as option (option.value)}
            <Select.Item value={option.value} label={option.label}>
                {option.label}
            </Select.Item>
        {/each}
    </Select.Content>
</Select.Root>
