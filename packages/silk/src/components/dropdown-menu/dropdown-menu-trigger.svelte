<script lang="ts">
	import * as Popover from '@silk/ui/components/popover';
	import { cn } from '@silk/ui/utils';
	import { getContext, type Snippet } from 'svelte';
	import type { ButtonVariant } from '@silk/ui/components/button';

	type Props = {
		children: Snippet;
		class?: string;
		variant?: ButtonVariant;
	} & Omit<Popover.PopoverTriggerProps, 'children' | 'class' | 'variant'>;

	let { children, class: className, variant, ...rest }: Props = $props();
</script>

<Popover.Trigger class={cn(className, ``)} {variant} {...rest}>
	{@render children?.()}
</Popover.Trigger>
