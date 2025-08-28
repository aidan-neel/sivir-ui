<script lang="ts">
	import { cn } from '$lib/ui/utils';
	import Check from '@lucide/svelte/icons/check';
	import { scaleFade } from '$lib/ui/internals/transition';
    import { STATE_KEY } from '.';

	let {
		checked = $bindable<boolean>(),
		label,
        description,
        disabled,
        variant = 'default',
		class: classProp,
		...rest
	}: {
		checked: boolean;
		label?: string;
        description?: string;
        disabled?: boolean;
        variant: 'default' | 'primary';
		class?: string;
	} = $props();
</script>

<label
	{...rest}
	class={cn(classProp, `${disabled ? 'opacity-60' : ''} group ${variant === 'primary' ? 'p-4 rounded-xl border focus-within:bg-secondary hover:bg-secondary' : ''} duration-200 ${variant === 'primary' && checked === true ? 'bg-primary/10 border-primary/30 focus-within:bg-primary/20 hover:bg-primary/20' : ''} flex flex-row items-start gap-3`)}
	id={`${String(STATE_KEY)}-controls`}
>
	{#if disabled}
        <input
            type="checkbox"
            class="peer absolute opacity-0"
            disabled
            aria-checked={checked}
            aria-labelledby={`${String(STATE_KEY)}-controls-label`}
        />
    {:else}
        <input
            type="checkbox"
            class="peer absolute opacity-0"
            bind:checked
            aria-checked={checked}
            aria-labelledby={`${String(STATE_KEY)}-controls-label`}
        />
    {/if}
	{#if checked}
		<div
			in:scaleFade={{ duration: 200 }}
			class="bg-primary p-0 h-4 w-4 flex peer-focus:ring-primary/30 peer-focus-visible:ring-2 ring-offset-1 focus:outline-none items-center justify-center rounded-md"
		>
			<Check size="12" class="text-foreground-btn" />
		</div>
	{:else}
		<div
			in:scaleFade={{ duration: 200 }}
			class="bg-popover border peer-hover:bg-secondary peer-focus-visible:bg-secondary duration-200 p-0 flex items-center justify-center h-4 w-4 rounded-md"
		></div>
	{/if}
    {#if label}
        <div class="flex flex-col justify-center">
            <span
                id={`${String(STATE_KEY)}-controls-label`}
                class="text-text text-sm mt-[-0.2rem] font-medium"
            >
                {label}
            </span>
            {#if description}
                <span
                    id={`${String(STATE_KEY)}-controls-description`}
                    class="text-text text-sm text-foreground-muted"
                >
                    {description}
                </span>
            {/if}
        </div>
    {/if}
</label>

