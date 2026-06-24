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

<div class="relative">
	<div
		class="absolute inset-x-10 -top-4 -z-10 h-32 rounded-full bg-[radial-gradient(60%_60%_at_50%_50%,color-mix(in_srgb,var(--color-primary)_18%,transparent),transparent_70%)] blur-2xl"
	></div>
	<div
		class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-sm)]"
	>
		<div
			class="relative flex min-h-[10rem] items-center border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_60%,transparent),transparent_70%)]"
		>
			<Marquee pauseOnHover duration="28s" class="py-8">
				{#each logos as logo (logo)}
					<span
						class="rounded-[var(--radius-md)] border border-border bg-card px-4 py-2 text-[0.86rem] font-[var(--font-weight-label,500)] text-foreground"
						>{logo}</span
					>
				{/each}
			</Marquee>
			<div
				class="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-card to-transparent"
			></div>
			<div
				class="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-card to-transparent"
			></div>
		</div>
	</div>
</div>
