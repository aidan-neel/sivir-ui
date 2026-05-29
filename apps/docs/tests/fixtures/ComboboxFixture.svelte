<script lang="ts">
	import * as Combobox from '@silk/ui/components/combobox';

	let {
		onApple = () => {},
		onBanana = () => {},
		onCherry = () => {}
	}: {
		onApple?: () => void;
		onBanana?: () => void;
		onCherry?: () => void;
	} = $props();
</script>

<Combobox.Root>
	<Combobox.Trigger>
		<span data-testid="combobox-trigger">Pick fruit</span>
	</Combobox.Trigger>
	<Combobox.Content>
		<Combobox.Search placeholder="Search fruits" />
		<Combobox.Results>
			<Combobox.Item value="apple" label="Apple" callback={onApple}>
				<span data-testid="combo-apple">Apple</span>
			</Combobox.Item>
			<Combobox.Item value="banana" label="Banana" callback={onBanana}>
				<span data-testid="combo-banana">Banana</span>
			</Combobox.Item>
			<Combobox.Item value="cherry" label="Cherry" callback={onCherry}>
				<span data-testid="combo-cherry">Cherry</span>
			</Combobox.Item>
		</Combobox.Results>
	</Combobox.Content>
</Combobox.Root>
