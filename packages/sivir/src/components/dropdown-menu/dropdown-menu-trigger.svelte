<script lang="ts">
	import * as Popover from '@sivir/ui/components/popover';
	import { type Snippet } from 'svelte';
	import type { ButtonVariant } from '@sivir/ui/components/button';

	type Props = {
		children: Snippet;
		class?: string;
		variant?: ButtonVariant;
	} & Omit<Popover.PopoverTriggerProps, 'children' | 'class' | 'variant'>;

	let { children, class: className, variant, ...rest }: Props = $props();
</script>

<Popover.Trigger class={className} {variant} {...rest}>
	{@render children?.()}
</Popover.Trigger>
