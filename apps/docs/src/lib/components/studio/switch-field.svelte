<script lang="ts">
    import { Switch } from '@sivir-ui/svelte/components/switch';
    import { cn } from '@sivir-ui/svelte/utils';
    import ChangedDot from './changed-dot.svelte';
    import { fieldLabel, fieldSurface } from './field';

    type SwitchFieldProps = {
        label: string;
        checked: boolean;
        description?: string;
        changed?: boolean;
        class?: string;
    };

    let {
        label,
        checked = $bindable(),
        description,
        changed = false,
        class: className
    }: SwitchFieldProps = $props();

    const id = $props.id();
</script>

<label
    for={`${id}-switch`}
    title={description}
    class={cn(
        fieldSurface,
        'select-none pr-2 has-[:focus-visible]:border-primary has-[:focus-visible]:shadow-[var(--focus-ring)]',
        className
    )}
>
    <span class={fieldLabel}>
        <span class="truncate">{label}</span>
        <ChangedDot {changed} />
    </span>
    <span class="ml-auto flex shrink-0 items-center [&>div]:min-h-0">
        <Switch
            id={`${id}-switch`}
            aria-label={label}
            class="focus-visible:shadow-none"
            bind:checked
        />
    </span>
</label>
