<script lang="ts">
	import { ColorPicker, type ColorOption } from '@silk/ui/components/color-picker';

	let valueWithOptions = $state('#0284c7');

	const presetSwatches: ColorOption[] = [
		{ label: 'Blue', value: '#2563eb' },
		{ label: 'Indigo', value: '#4f46e5' },
		{ label: 'Violet', value: '#7c3aed' },
		{ label: 'Pink', value: '#db2777' },
		{ label: 'Rose', value: '#e11d48' }
	];
</script>

<div class="flex items-center justify-center">
	<ColorPicker
		value={valueWithOptions}
		onValueChange={(v) => (valueWithOptions = v)}
		options={presetSwatches}
		label="Choose"
	/>
</div>
