<script lang="ts">
    import * as Select from '@sivir-ui/svelte/components/select';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { Snippet } from 'svelte';
    import ChangedDot from './changed-dot.svelte';
    import { fieldLabel, fieldSurface } from './field';

    type SelectFieldTriggerProps = {
        label: string;
        changed?: boolean;
        class?: string;
        children: Snippet;
    };

    let { label, changed = false, class: className, children }: SelectFieldTriggerProps = $props();
</script>

<Select.Trigger
    unstyled
    aria-label={label}
    class={cn(fieldSurface, 'group/field pr-2 [&>svg]:size-3.5', className)}
>
    <span class={fieldLabel}>
        <span class="truncate">{label}</span>
        <ChangedDot {changed} />
    </span>
    <span class="ml-auto min-w-0 truncate text-right text-foreground"> {@render children()} </span>
</Select.Trigger>
