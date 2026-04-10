<script lang="ts">
	import { ColorPicker } from '$lib/silk/components/color-picker';
	import type { ColorOption } from '$lib/silk/components/color-picker';

	type Props = {
		value: string;
		label: string;
		onValueChange?: (value: string) => void;
		swatches?: ColorOption[];
		showSelect?: boolean;
		class?: string;
	};

	let { value, label, onValueChange, swatches, showSelect, class: className }: Props = $props();
</script>

<ColorPicker {value} {label} {onValueChange} options={swatches} {showSelect} class={className} />
