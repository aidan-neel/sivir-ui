<script lang="ts" generics="T extends string">
    import type { ButtonVariant } from '@sivir-ui/svelte/components/button';
    import * as Select from '@sivir-ui/svelte/components/select';
    import type { ConceptOption } from './options';

    let {
        label,
        options,
        value = $bindable(),
        variant = 'outline',
        class: classProp
    }: {
        label: string;
        options: readonly ConceptOption<T>[];
        value: T;
        variant?: ButtonVariant;
        class?: string;
    } = $props();

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
        {variant}
        size="sm"
        aria-label={`${label}: ${selected?.label ?? value}`}
        class={classProp}
    >
        {selected?.label ?? value}
    </Select.Trigger>
    <Select.Content>
        {#each options as option (option.value)}
            <Select.Item value={option.value} label={option.label}>
                {option.label}
            </Select.Item>
        {/each}
    </Select.Content>
</Select.Root>
