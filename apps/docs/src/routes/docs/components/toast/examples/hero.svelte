<script lang="ts">
	import { Button } from '@silk/ui/components/button';
	import { toast } from '@silk/ui/components/toast';
</script>

<div class="flex items-center justify-center">
	<Button
		onclick={() =>
			toast.success('Deployment ready', {
				description: 'silk-ui.vercel.app is now live.',
				actions: [
					{
						label: 'Visit',
						callback: () => {
							window.open('https://vercel.com', '_blank');
						}
					}
				]
			})}>Deploy</Button
	>
</div>
