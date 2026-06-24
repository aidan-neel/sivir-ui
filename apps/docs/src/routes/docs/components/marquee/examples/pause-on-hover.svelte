<script lang="ts">
	import { Marquee } from '@silk/ui/components/marquee';

	const logos = [
		'Linear',
		'Vercel',
		'Anthropic',
		'Cursor',
		'Raycast',
		'Tailwind',
		'GitHub',
		'Notion'
	];
</script>

<div
	class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-sm)]"
>
	<div class="relative flex min-h-[6rem] items-center bg-secondary/40 px-6">
		<Marquee pauseOnHover class="py-4">
			{#each logos as logo (logo)}
				<span class="text-[0.86rem] font-[var(--font-weight-label,500)] text-foreground"
					>{logo}</span
				>
			{/each}
		</Marquee>
	</div>
</div>
