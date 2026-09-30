<script lang="ts">
    import * as ColorPicker from '@sivir-ui/svelte/components/color-picker';
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import { cn } from '@sivir-ui/svelte/utils';
    import ChangedDot from './changed-dot.svelte';
    import { fieldLabel, fieldSurface } from './field';

    type ColorFieldProps = {
        label: string;
        value: string;
        onChange: (value: string) => void;
        options?: ColorPicker.ColorOption[];
        changed?: boolean;
        class?: string;
    };

    let {
        label,
        value,
        onChange,
        options = [],
        changed = false,
        class: className
    }: ColorFieldProps = $props();
</script>

<ColorPicker.Root {value} onValueChange={onChange} {options}>
    <Popover.Trigger
        unstyled
        aria-label={`${label}, ${value}`}
        class={cn(fieldSurface, 'group/field pr-2.5', className)}
    >
        <span class={fieldLabel}>
            <span class="truncate">{label}</span>
            <ChangedDot {changed} />
        </span>
        <span class="ml-auto flex shrink-0 items-center gap-2">
            <span class="font-mono text-xs text-foreground">{value}</span>
            <span
                class="size-4 shrink-0 rounded-full ring-1 ring-inset ring-[color-mix(in_srgb,var(--color-foreground)_12%,transparent)]"
                style:background={value}
            ></span>
        </span>
    </Popover.Trigger>
    <ColorPicker.Content />
</ColorPicker.Root>
