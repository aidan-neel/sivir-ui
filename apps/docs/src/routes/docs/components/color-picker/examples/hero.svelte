<script lang="ts">
	import { ColorPicker } from '@silk/ui/components/color-picker';

	let value = $state('#5e6ad2');
</script>

<div class="flex items-center justify-center">
	<ColorPicker {value} onValueChange={(v) => (value = v)} />
</div>
