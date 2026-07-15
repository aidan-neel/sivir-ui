<script lang="ts">
	import { Panel } from '@sivir/ui/components/panel';
</script>

<!-- The frame sits a hair darker than a card-coloured inner surface, so nested
     content reads as a distinct inset (the pattern the docs preview uses). -->
<Panel
	class="w-full max-w-sm bg-[color-mix(in_srgb,var(--color-card)_97%,var(--color-foreground))]"
>
	<div class="rounded-[var(--radius-md)] bg-card p-4">
		<p class="m-0 text-[0.85rem] text-foreground-muted">
			Inner content on <code class="font-mono text-foreground">--color-card</code>, framed by the
			Panel.
		</p>
	</div>
</Panel>
