<script lang="ts">
    import { input } from '@sivir-ui/svelte/components/input/variants';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { TextareaProps } from '.';

    let {
        placeholder,
        label,
        description,
        variant = 'outline',
        autoresize = false,
        class: classProp,
        children,
        element = $bindable<HTMLTextAreaElement>(),
        value = $bindable<string | number | null | undefined>(),
        oninput,
        ...rest
    }: TextareaProps = $props();

    function resize() {
        if (!autoresize || !element) {
            return;
        }
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
    }

    $effect(() => {
        if (autoresize) {
            value;
            resize();
        }
    });

    const composerClass = $derived(
        variant === 'secondary'
            ? 'bg-secondary shadow-[var(--shadow-well)] hover:shadow-[var(--shadow-well)]'
            : 'bg-[var(--color-field)] shadow-[var(--shadow-field)] hover:shadow-[var(--shadow-field-hover)]'
    );
</script>

{#snippet field()}
    <textarea
        bind:this={element}
        bind:value
        oninput={(event) => {
            oninput?.(event);
            resize();
        }}
        data-ui="textarea"
        data-variant={variant}
        class={cn(
            classProp,
            children &&
                'rounded-none bg-transparent shadow-none hover:shadow-none focus-visible:shadow-none aria-[invalid=true]:shadow-none aria-[invalid=true]:hover:shadow-none aria-[invalid=true]:focus-visible:shadow-none',
            autoresize && 'resize-none overflow-y-hidden',
            'min-h-16 resize-y py-2.5 leading-body',
            input({ variant })
        )}
        {...rest}
        {placeholder}
    ></textarea>
{/snippet}

{#snippet control()}
    {#if children}
        <div
            data-ui="textarea-composer"
            data-variant={variant}
            class={cn(
                'overflow-hidden rounded-[var(--radius-xl)] transition-[box-shadow] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-out)] focus-within:shadow-[var(--focus-ring),var(--shadow-field-focus)] has-[textarea[aria-invalid=true]]:shadow-[var(--shadow-field-invalid)] has-[textarea[aria-invalid=true]]:focus-within:shadow-[var(--focus-ring),var(--shadow-field-invalid)]',
                composerClass
            )}
        >
            {@render field()}
            {@render children()}
        </div>
    {:else}
        {@render field()}
    {/if}
{/snippet}

{#snippet meta()}
    {#if label}
        <span
            class="[font-size:var(--font-size-label)] [font-weight:var(--font-weight-label)] [letter-spacing:var(--tracking-label)] text-foreground [font-family:var(--font-sans),sans-serif]"
        >
            {label}
        </span>
    {/if}
    {@render control()}
    {#if description}
        <span
            class="[font-size:var(--font-size-body)] [font-weight:var(--font-weight-body)] [letter-spacing:var(--tracking-body)] text-foreground-muted"
            >{description}</span
        >
    {/if}
{/snippet}

{#if label}
    <label class="flex flex-col gap-1"> {@render meta()} </label>
{:else if description}
    <div class="flex flex-col gap-1">
        {@render meta()}
    </div>
{:else}
    {@render control()}
{/if}
