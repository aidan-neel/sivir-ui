<script lang="ts">
	import * as Combobox from '@silk/ui/components/combobox';

	let selected = $state('');

	const languages = [
		{ value: 'en', label: 'English' },
		{ value: 'es', label: 'Spanish' },
		{ value: 'fr', label: 'French' },
		{ value: 'de', label: 'German' },
		{ value: 'ja', label: 'Japanese' },
		{ value: 'pt', label: 'Portuguese' }
	];
</script>

<div class="flex justify-center">
	<div class="w-[240px]">
		<Combobox.Root placeholder="Select a language">
			<Combobox.Trigger class="w-full" />
			<Combobox.Content>
				{#each languages as item (item.value)}
					<Combobox.Item
						value={item.value}
						label={item.label}
						callback={() => (selected = item.value)}
					/>
				{/each}
			</Combobox.Content>
		</Combobox.Root>
	</div>
</div>
