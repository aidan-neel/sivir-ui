<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import Check from '@lucide/svelte/icons/check';
	import { scaleFade } from '@silk/ui/internals/transition';
	import { checkbox, checkboxBox, checkboxText } from './variants';

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
		checkbox({ variant, disabled: disabled ?? false, checked: checked ?? false })
	)}
>
	{#if disabled}
		<input
			type="checkbox"
			class="peer absolute size-[var(--checkbox-size)] opacity-0"
			disabled
			aria-checked={checked}
		/>
	{:else}
		<input
			type="checkbox"
			class="peer absolute size-[var(--checkbox-size)] opacity-0"
			bind:checked
			aria-checked={checked}
		/>
	{/if}
	{#if checked}
		<div
			in:scaleFade={{ duration: 200, durationVar: '--motion-duration-hover' }}
			class={checkboxBox({ checked: true })}
		>
			<Check size="12" class="text-[var(--checkbox-checked-foreground)]" />
		</div>
	{:else}
		<div
			in:scaleFade={{ duration: 200, durationVar: '--motion-duration-hover' }}
			class={checkboxBox({ checked: false })}
		></div>
	{/if}
	{#if label}
		<div class="flex flex-col justify-center">
			<!-- token-lint-disable-next-line no-literal-length: fine-tuning vertical alignment of label -->
			<span class={cn(checkboxText(), 'mt-[-0.2rem]')} role="presentation">
				{label}
			</span>
			{#if description}
				<span
					class="text-text [font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted"
				>
					{description}
				</span>
			{/if}
		</div>
	{/if}
</label>
