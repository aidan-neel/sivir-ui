<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import Check from '@lucide/svelte/icons/check';
	import { scaleFade } from '@silk/ui/internals/transition';

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
		variant?: 'default' | 'primary';
		class?: string;
	} = $props();
</script>

<label
	{...rest}
	class={cn(
		classProp,
		`${disabled ? 'opacity-60' : ''} group ${variant === 'primary' ? 'p-4 rounded-lg border focus-within:bg-secondary hover:bg-secondary' : ''} duration-200 ${variant === 'primary' && checked === true ? 'bg-primary/10 border-primary/30 focus-within:bg-primary/20 hover:bg-primary/20' : ''} flex flex-row items-start gap-3`
	)}
>
	{#if disabled}
		<input type="checkbox" class="peer absolute size-4 opacity-0" disabled aria-checked={checked} />
	{:else}
		<input
			type="checkbox"
			class="peer absolute size-4 opacity-0"
			bind:checked
			aria-checked={checked}
		/>
	{/if}
	{#if checked}
		<div
			in:scaleFade={{ duration: 200, durationVar: '--motion-duration-hover' }}
			class="flex h-4 w-4 items-center justify-center rounded-[var(--radius-sm)] bg-primary p-0 ring-offset-2 transition-[box-shadow,transform] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-ring)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background"
		>
			<Check size="12" class="text-foreground-btn" />
		</div>
	{:else}
		<div
			in:scaleFade={{ duration: 200, durationVar: '--motion-duration-hover' }}
			class="flex h-4 w-4 items-center justify-center rounded-[var(--radius-sm)] border bg-[var(--checkbox-bg)] p-0 duration-200 transition-[background-color,box-shadow,transform] peer-hover:bg-[var(--color-field-hover)] peer-focus-visible:bg-[var(--color-field-hover)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-ring)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background"
		></div>
	{/if}
	{#if label}
		<div class="flex flex-col justify-center">
			<span class="text-text [font-size:var(--font-size-body,16px)] mt-[-0.2rem] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)]">
				{label}
			</span>
			{#if description}
				<span class="text-text [font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted">
					{description}
				</span>
			{/if}
		</div>
	{/if}
</label>
