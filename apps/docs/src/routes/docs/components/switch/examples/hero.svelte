<script lang="ts">
	import { Switch } from '@silk/ui/components/switch';

	let enabled = $state(true);
</script>

<Switch bind:switched={enabled} label="Push notifications" />
