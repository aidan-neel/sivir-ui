<script lang="ts">
	import { Button } from '@silk/ui/components/button';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';

	/** Standard "restyle in the studio" call-to-action that closes every page. */
</script>

<section
	class="flex flex-col items-start justify-between gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-6 sm:flex-row sm:items-center"
>
	<div class="flex flex-col gap-1">
		<p
			class="m-0 text-[1rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
			style="font-family: var(--font-header);"
		>
			Want to make it yours?
		</p>
		<p class="m-0 text-[0.86rem] text-foreground-muted">
			Every Silk component reads from your theme tokens — open the studio to restyle them.
		</p>
	</div>
	<Button href="/themes/studio">
		Open theme studio
		<ArrowRight size={14} />
	</Button>
</section>
