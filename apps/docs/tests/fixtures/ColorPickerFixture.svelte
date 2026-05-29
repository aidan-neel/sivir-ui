<script lang="ts">
	import ColorPicker from '@silk/ui/components/color-picker/color-picker.svelte';

	let {
		value = $bindable('#ff0000'),
		label = 'Color',
		onValueChange = (v: string) => { value = v; }
	}: {
		value?: string;
		label?: string;
		onValueChange?: (value: string) => void;
	} = $props();

	const options = [
		{ label: 'Red', value: '#ff0000' },
		{ label: 'Green', value: '#00ff00' },
		{ label: 'Blue', value: '#0000ff' }
	];
</script>

<div style="padding: 40px;">
	<ColorPicker {value} {label} {onValueChange} {options} />
</div>
