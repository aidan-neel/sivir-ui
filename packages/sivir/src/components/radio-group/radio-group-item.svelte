<script lang="ts">
    import { cn, pressable } from '@sivir-ui/svelte/utils';
    import { getContext } from 'svelte';
    import type { RadioGroupContext, RadioGroupItemProps } from '.';

    let {
        class: className,
        value,
        disabled,
        label,
        description,
        id,
        onchange,
        ...rest
    }: RadioGroupItemProps = $props();

    const ctx = getContext<RadioGroupContext>('radio-group');
    const selected = $derived(ctx.isSelected(value));
    const isDisabled = $derived(disabled || ctx.disabled);
    const inputId = $derived(id ?? `radio-${value}`);
    const descriptionId = $derived(description ? `${inputId}-description` : undefined);

    function handleChange(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
        ctx.setValue(value);
        onchange?.(event);
    }
</script>

<label
    for={inputId}
    data-ui="radio-group-row"
    data-state={selected ? 'checked' : 'unchecked'}
    data-disabled={isDisabled || undefined}
    class={cn(
        'group flex min-h-[var(--size-touch)] select-none items-start gap-2.5 md:min-h-0',
        isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-[var(--ui-cursor-interactive)]',
        className
    )}
>
    <input
        {...rest}
        type="radio"
        id={inputId}
        name={ctx.name}
        {value}
        checked={selected}
        disabled={isDisabled}
        aria-describedby={descriptionId}
        onchange={handleChange}
        class="sr-only"
    />
    <span class="flex h-5 shrink-0 items-center">
        <span
            use:pressable
            data-ui="radio-group-item"
            data-state={selected ? 'checked' : 'unchecked'}
            aria-hidden="true"
            class={cn(
                'sivir-press relative flex size-4 items-center justify-center overflow-hidden rounded-full border-[length:var(--border-size)] transition-[background-color,border-color,box-shadow,scale] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-press)] motion-reduce:transition-none',
                selected
                    ? 'border-primary bg-primary [transition-delay:100ms,0ms,0ms,0ms]'
                    : 'border-[var(--color-input)] bg-[var(--color-field)] [transition-delay:0ms]',
                'group-has-[input:focus-visible]:shadow-[var(--focus-ring)]',
                !selected && !isDisabled && 'group-hover:border-[var(--color-foreground-muted)] group-hover:bg-[var(--color-field-hover)]'
            )}
        >
            <span
                class={cn(
                    'absolute inset-0 rounded-full bg-primary transition-[scale,opacity] motion-reduce:transition-none',
                    selected
                        ? 'scale-100 opacity-100 [transition-duration:200ms] ease-[var(--ease-press)]'
                        : 'scale-0 opacity-0 [transition-duration:120ms] ease-[var(--ease-out)]'
                )}
            ></span>
            <span
                class={cn(
                    'relative size-1.5 rounded-full bg-[var(--color-on-primary)] transition-[scale,opacity] motion-reduce:transition-none',
                    selected
                        ? 'scale-100 opacity-100 [transition-delay:60ms] [transition-duration:180ms] ease-[var(--ease-press)]'
                        : 'scale-0 opacity-0 [transition-delay:0ms] [transition-duration:90ms] ease-[var(--ease-out)]'
                )}
            ></span>
        </span>
    </span>
    {#if label || description}
        <span class="flex min-w-0 flex-col gap-0.5">
            {#if label}
                <span
                    class="leading-5 [font-size:var(--font-size-body)] [font-weight:var(--font-weight-label)] [letter-spacing:var(--tracking-label)] text-foreground"
                >
                    {label}
                </span>
            {/if}
            {#if description}
                <span
                    id={descriptionId}
                    class="leading-5 [font-size:var(--font-size-body)] [font-weight:var(--font-weight-body)] [letter-spacing:var(--tracking-body)] text-foreground-muted"
                >
                    {description}
                </span>
            {/if}
        </span>
    {/if}
</label>
