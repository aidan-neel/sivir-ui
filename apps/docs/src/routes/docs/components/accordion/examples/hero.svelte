<script lang="ts">
	import * as Accordion from '@silk/ui/components/accordion';
</script>

<div class="w-full max-w-md">
	<Accordion.Root type="single" value="item-1">
		<Accordion.Item value="item-1">
			<Accordion.Trigger>Is it accessible?</Accordion.Trigger>
			<Accordion.Content
				>Yes — the trigger is a real button with `aria-expanded` and `aria-controls`, and the
				content has `role="region"`.</Accordion.Content
			>
		</Accordion.Item>
		<Accordion.Item value="item-2">
			<Accordion.Trigger>Does it animate?</Accordion.Trigger>
			<Accordion.Content
				>Yes — height is animated via CSS grid-template-rows. No JS measurement, no jank.</Accordion.Content
			>
		</Accordion.Item>
		<Accordion.Item value="item-3">
			<Accordion.Trigger>Does it theme?</Accordion.Trigger>
			<Accordion.Content
				>Yes — open the theme studio and watch the chevron, duration, and colors update live.</Accordion.Content
			>
		</Accordion.Item>
	</Accordion.Root>
</div>
