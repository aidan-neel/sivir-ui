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
            'group relative flex min-h-12 cursor-[var(--ui-cursor-interactive)] items-start gap-3 rounded-[var(--radius-md)] border-[length:var(--border-size)] px-3 py-2.5 text-start transition-[background-color,border-color,box-shadow] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-press)] motion-reduce:transition-none has-[:focus-visible]:shadow-[var(--focus-ring)]',
            selected
                ? 'border-primary/60 bg-[color-mix(in_srgb,var(--color-primary)_8%,var(--color-card))]'
                : 'border-transparent bg-transparent [&:not([data-disabled]):hover]:border-border [&:not([data-disabled]):hover]:bg-secondary'
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
        <span
            class={cn(
                'mt-0.5 grid size-4 shrink-0 place-items-center border-[length:var(--border-size)] transition-[background-color,border-color] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-press)] motion-reduce:transition-none',
                context.type === 'multiple' ? 'rounded-[var(--radius-sm)]' : 'rounded-full',
                selected ? 'border-primary bg-primary' : 'border-border bg-background'
            )}
            aria-hidden="true"
        >
            {#if context.type === 'multiple'}
                <Check
                    size={11}
                    strokeWidth={2.5}
                    class={cn(
                        'text-[var(--color-on-primary)] transition-[opacity,scale,filter] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-press)] motion-reduce:transition-none',
                        // token-lint-disable-next-line no-literal-length: crossfade blur is part of the swap motion
                        selected ? 'scale-100 opacity-100 blur-[0px]' : 'scale-[0.25] opacity-0 blur-[2px]'
                    )}
                />
            {:else}
                <span
                    class={cn(
                        'size-1.5 rounded-full bg-[var(--color-on-primary)] transition-[opacity,scale,filter] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-press)] motion-reduce:transition-none',
                        // token-lint-disable-next-line no-literal-length: crossfade blur is part of the swap motion
                        selected ? 'scale-100 opacity-100 blur-[0px]' : 'scale-[0.25] opacity-0 blur-[2px]'
                    )}
                ></span>
            {/if}
        </span>
        <span class="min-w-0 flex-1">
            <span
                class="block [font-size:var(--font-size-label)] [font-weight:var(--font-weight-label)] [letter-spacing:var(--tracking-label)] leading-snug text-foreground"
            >
                {label}
            </span>
            {#if description}
                <span
                    class="mt-0.5 block [font-size:var(--font-size-body)] [font-weight:var(--font-weight-body)] [letter-spacing:var(--tracking-body)] leading-snug text-foreground-muted"
                >
                    {description}
                </span>
            {/if}
        </span>
    </label>
{/if}
