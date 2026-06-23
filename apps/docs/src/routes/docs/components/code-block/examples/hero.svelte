<script lang="ts">
	import { CodeBlock } from '@silk/ui/components/code-block';
	import { Button } from '@silk/ui/components/button';
	import * as Tooltip from '@silk/ui/components/tooltip';
	import Info from '@lucide/svelte/icons/info';
	import Sparkles from '@lucide/svelte/icons/sparkles';

	// Loaded as raw text so the sample `import` lines aren't seen by the bundler.
	import python from './snippets/quickstart.py.txt?raw';
	import javascript from './snippets/quickstart.js.txt?raw';
	import java from './snippets/quickstart.java.txt?raw';
	import go from './snippets/quickstart.go.txt?raw';
	import csharp from './snippets/quickstart.cs.txt?raw';
</script>

<CodeBlock
	class="max-w-2xl"
	value="javascript"
	tabs={[
		{ label: 'Python', lang: 'python', code: python },
		{ label: 'JavaScript', lang: 'javascript', code: javascript },
		{ label: 'Java', lang: 'java', code: java },
		{ label: 'Go', lang: 'go', code: go },
		{ label: 'C#', lang: 'csharp', code: csharp }
	]}
>
	{#snippet actions()}
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button variant="ghost" size="icon" aria-label="About this snippet">
					<Info size={15} />
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content>About this snippet</Tooltip.Content>
		</Tooltip.Root>
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button variant="ghost" size="icon" aria-label="Explain with AI">
					<Sparkles size={15} />
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content>Explain with AI</Tooltip.Content>
		</Tooltip.Root>
	{/snippet}
</CodeBlock>
