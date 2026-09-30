<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SliderValueProps } from '.';
    import { getSliderContext } from './context.svelte';

    let { class: className, ...rest }: SliderValueProps = $props();

    const slider = getSliderContext();
    let field = $state<HTMLInputElement>();
    const interactive = $derived(slider.editable && !slider.disabled);

    $effect(() => {
        if (slider.editing) {
            field?.focus({
                preventScroll: true
            });
            field?.select();
        }
    });

    function handleKeyDown(event: KeyboardEvent & { currentTarget: HTMLInputElement }) {
        if (event.key === 'Enter') {
            event.preventDefault();
            slider.commitEdit(event.currentTarget.value);
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            slider.cancelEdit();
        }
    }
</script>

{#if slider.editing}
    <input
        bind:this={field}
        type="text"
        inputmode="decimal"
        autocomplete="off"
        spellcheck="false"
        aria-label={slider.label ? `${slider.label} value` : 'Value'}
        data-ui="slider-value-input"
        value={slider.rawValue}
        class={cn(
            className,
            'relative z-[1] m-0 min-w-[3ch] shrink-0 cursor-text border-0 bg-transparent p-0 text-right font-mono tabular-nums text-foreground outline-none [field-sizing:content]'
        )}
        onpointerdown={(event) => {
            event.stopPropagation();
        }}
        onkeydown={handleKeyDown}
        onblur={(event) => {
            slider.commitEdit(event.currentTarget.value);
        }}
    />
{:else}
    <span
        aria-hidden="true"
        data-ui="slider-value"
        data-editable={interactive ? '' : undefined}
        class={cn(
            className,
            'relative z-[1] shrink-0 font-mono tabular-nums text-foreground',
            interactive &&
                'cursor-text underline-offset-4 decoration-foreground-muted/50 hover:underline hover:decoration-dotted'
        )}
        onpointerdown={interactive
            ? (event) => {
                  event.stopPropagation();
              }
            : undefined}
        onclick={interactive
            ? (event) => {
                  event.preventDefault();
                  slider.beginEdit();
              }
            : undefined}
        {...rest}
    >
        {slider.formatted}
    </span>
{/if}
