<script lang="ts">
	import { CodeBlock } from '@silk/ui/components/code-block';
	import { Button } from '@silk/ui/components/button';
	import * as Tooltip from '@silk/ui/components/tooltip';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import RefreshCw from '@lucide/svelte/icons/refresh-cw';

	const code = `SELECT id, email, created_at
FROM users
WHERE created_at > now() - interval '7 days'
ORDER BY created_at DESC
LIMIT 50;`;
</script>

<CodeBlock class="max-w-xl" {code} lang="sql">
	{#snippet actions()}
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button variant="ghost" size="icon" aria-label="Run query">
					<RefreshCw size={15} />
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content>Run query</Tooltip.Content>
		</Tooltip.Root>
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button variant="ghost" size="icon" aria-label="Open in editor">
					<ExternalLink size={15} />
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content>Open in editor</Tooltip.Content>
		</Tooltip.Root>
	{/snippet}
</CodeBlock>
