<script lang="ts">
    import Check from '@lucide/svelte/icons/check';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { QuestionOptionProps } from '.';
    import { getQuestionContext } from './context.svelte';

    let {
        value,
        label,
        description,
        disabled = false,
        element = $bindable(),
        class: className,
        onchange,
        ...rest
    }: QuestionOptionProps = $props();

    const context = getQuestionContext();
    const selected = $derived(context.isSelected(value));
    const isDisabled = $derived(context.disabled || context.busy || disabled);
    const inputType = $derived(context.type === 'multiple' ? 'checkbox' : 'radio');

    function handleChange(event: Event & { currentTarget: HTMLInputElement }) {
        context.select(value);
        onchange?.(event);
    }
</script>

{#if context.type !== 'text'}
    <label
        data-ui="question-option"
        data-state={selected ? 'checked' : 'unchecked'}
        data-disabled={isDisabled || undefined}
        class={cn(
            className,
            isDisabled && 'cursor-not-allowed opacity-[var(--opacity-disabled)]',
            'group relative flex cursor-[var(--ui-cursor-interactive)] items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-start transition-[background-color,box-shadow] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-press)] [counter-increment:question-option] motion-reduce:transition-none has-[:focus-visible]:shadow-[var(--focus-ring)]',
            selected
                ? 'bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] shadow-[inset_0_0_0_var(--border-size)_color-mix(in_srgb,var(--color-primary)_45%,transparent)]'
                : 'bg-[color-mix(in_srgb,var(--color-foreground)_4%,transparent)] [&:not([data-disabled]):hover]:bg-[color-mix(in_srgb,var(--color-foreground)_7%,transparent)]'
        )}
    >
        <input
            bind:this={element}
            {...rest}
            data-question-control
            data-ui="question-option-input"
            type={inputType}
            name={context.name}
            {value}
            checked={selected}
            disabled={isDisabled}
            required={context.required && context.type === 'single'}
            aria-invalid={Boolean(context.validationMessage)}
            onchange={handleChange}
            class="peer sr-only"
        />
        {#if context.type === 'multiple'}
            <span
                class="flex h-[1lh] items-center self-start [font-size:var(--font-size-label)] leading-snug"
                aria-hidden="true"
            >
                <span
                    class={cn(
                        'grid size-4 shrink-0 place-items-center rounded-[var(--radius-sm)] border-[length:var(--border-size)] transition-[background-color,border-color] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-press)] motion-reduce:transition-none',
                        selected
                            ? 'border-primary bg-primary'
                            : 'border-border-strong bg-[var(--color-field)]'
                    )}
                >
                    <Check
                        size={11}
                        strokeWidth={2.5}
                        class={cn(
                            'text-[var(--color-on-primary)] transition-[opacity,scale,filter] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-press)] motion-reduce:transition-none',
                            selected
                                ? 'scale-100 opacity-100 blur-[0]'
                                : 'scale-[0.25] opacity-0 blur-[var(--motion-swap-blur)]'
                        )}
                    />
                </span>
            </span>
        {/if}
        <span class="min-w-0 flex-1">
            <span
                class="block [font-size:var(--font-size-label)] [font-weight:var(--font-weight-label)] [letter-spacing:var(--tracking-label)] leading-snug text-foreground"
            >
                {label}
            </span>
            {#if description}
                <span
                    class="mt-0.5 block [font-size:var(--font-size-label)] [font-weight:var(--font-weight-body)] [letter-spacing:var(--tracking-body)] leading-snug text-foreground-muted"
                >
                    {description}
                </span>
            {/if}
        </span>
        <kbd
            aria-hidden="true"
            class={cn(
                'hidden min-h-4 min-w-4 shrink-0 select-none items-center justify-center rounded-[var(--radius-sm)] border-[length:var(--border-size)] px-1 py-0.5 font-sans text-[length:var(--font-size-meta)] font-medium leading-none tabular-nums transition-[border-color,color] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-press)] before:content-[counter(question-option)] motion-reduce:transition-none sm:inline-flex',
                selected ? 'border-primary/50 text-primary' : 'border-border bg-card text-foreground-muted'
            )}
        ></kbd>
    </label>
{/if}
