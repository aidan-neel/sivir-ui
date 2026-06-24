<script lang="ts">
	import { Textarea } from '@silk/ui/components/textarea';

	let value = $state(
		"Silk's textarea uses the same field tokens as Input — labels, descriptions, and focus rings stay consistent."
	);
</script>

<div class="w-full max-w-sm">
	<Textarea bind:value label="Message" />
</div>
