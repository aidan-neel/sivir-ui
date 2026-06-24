<!-- token-lint-disable-file -->
<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import * as Tabs from '@silk/ui/components/tabs';
	import type { CodeBlockTriggerProps } from '.';

	let {
		children,
		class: className,
		value,
		disabled = false,
		...rest
	}: CodeBlockTriggerProps = $props();
</script>

<Tabs.Trigger
	{value}
	{disabled}
	data-ui="code-block-trigger"
	class={cn(className, 'text-[13px] min-h-[28px] py-0')}
	{...rest}
>
	{@render children?.()}
</Tabs.Trigger>
