<script lang="ts">
	import * as Select from '@silk/ui/components/select';
</script>

<Select.Root>
	<Select.Trigger>
		<span data-testid="select-trigger">Select an option</span>
	</Select.Trigger>
	<Select.Content>
		<Select.Item value="apple"><span data-testid="opt-apple">Apple</span></Select.Item>
		<Select.Item value="banana"><span data-testid="opt-banana">Banana</span></Select.Item>
		<Select.Item value="cherry"><span data-testid="opt-cherry">Cherry</span></Select.Item>
	</Select.Content>
</Select.Root>
