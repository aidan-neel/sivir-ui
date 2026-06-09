<script lang="ts">
	import * as Alert from '@silk/ui/components/alert';

	let { variant = 'info' as 'info' | 'error' | 'success' | 'warning' } = $props();
</script>

<Alert.Root {variant}>
	<Alert.Title>Heads up</Alert.Title>
	<Alert.Description>Something happened that you should know about.</Alert.Description>
</Alert.Root>
