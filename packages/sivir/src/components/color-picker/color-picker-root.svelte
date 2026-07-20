<script lang="ts">
	import * as Popover from '@sivir/ui/components/popover';
	import { cn } from '@sivir/ui/utils';
	import type { Snippet } from 'svelte';
	import { setColorPickerContext, type ColorOption } from './context';

	type Props = {
		label?: string;
		value: string;
		onValueChange?: (value: string) => void;
		options?: ColorOption[];
		class?: string;
		children: Snippet;
	};

	let { label, value, onValueChange, options = [], class: className, children }: Props = $props();

	setColorPickerContext({
		get value() {
			return value;
		},
		get options() {
			return options;
		},
		apply: (hex) => onValueChange?.(hex.toLowerCase())
	});
</script>

<div class={cn(className, 'space-y-1')}>
	{#if label}
		<p class="text-sm text-foreground-muted">{label}</p>
	{/if}

	<Popover.Root placement="bottom">
		{@render children()}
	</Popover.Root>
</div>
