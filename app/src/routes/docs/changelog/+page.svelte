<script lang="ts">
	import PageHeader from '$lib/components/docs/page-header.svelte';
</script>

<main class="flex w-full flex-col pb-12">
	<PageHeader
		title="Changelog"
		description="Recent updates across components, theming, docs, and interaction polish."
		compact={true}
	/>

	<section class="mt-6 flex flex-col gap-6">
		<div class="border-b border-border-strong/60 pb-4">
			<p class="docs-section-heading">April 2026</p>
			<p class="mt-2 text-base leading-7 text-foreground-muted">
				A broader polish pass across interaction states, mobile behavior, theme tooling, and the docs
				experience.
			</p>
		</div>

		<div class="grid gap-4">
			<article class="rounded-lg border border-border bg-[var(--card-bg)] p-5 shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)]">
				<h2 class="docs-subsection-heading">
					Accessibility and interaction pass
				</h2>
				<p class="mt-3 text-base leading-7 text-foreground-muted">
					Dialogs, sheets, popovers, menus, selects, and comboboxes were tightened up with better
					focus behavior, improved WAI-ARIA coverage, toggleable trigger behavior, and cleaner mobile
					interaction handling.
				</p>
			</article>

			<article class="rounded-lg border border-border bg-[var(--card-bg)] p-5 shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)]">
				<h2 class="docs-subsection-heading">
					Theme studio improvements
				</h2>
				<p class="mt-3 text-base leading-7 text-foreground-muted">
					The themes page now has a stronger preset gallery, a broader motion model, base palette
					automation, a redesigned color picker, and a layout that is much closer to the visual
					structure of the home page.
				</p>
			</article>

			<article class="rounded-lg border border-border bg-[var(--card-bg)] p-5 shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)]">
				<h2 class="docs-subsection-heading">
					Mobile and docs cleanup
				</h2>
				<p class="mt-3 text-base leading-7 text-foreground-muted">
					The mobile navbar sheet, toast placement, component docs layout, import sections, and
					several side-scrolling docs views were refined to feel more stable and usable on smaller
					screens.
				</p>
			</article>
		</div>
	</section>

	<section class="mt-10 flex flex-col gap-4">
		<div class="border-b border-border-strong/60 pb-4">
			<p class="docs-section-heading">April 2025</p>
			<p class="mt-2 text-base leading-7 text-foreground-muted">
				The initial public release of the library and CLI-driven component workflow.
			</p>
		</div>

		<div class="rounded-lg border border-border bg-[var(--card-bg)] p-5 shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)]">
			<h2 class="docs-subsection-heading">v1.0.0</h2>
			<p class="mt-3 text-base leading-7 text-foreground-muted">
				The first release established the core component collection, CLI installation flow, and the
				initial docs and theme foundation.
			</p>
			<p class="mt-3 text-base leading-7 text-foreground-muted">
				Start with the <a href="/docs/installation" class="font-medium underline">installation</a>
				page, then browse the
				<a href="/docs/components/alert" class="font-medium underline">components</a> or explore the
				<a href="/themes" class="font-medium underline">preset gallery</a>.
			</p>
		</div>
	</section>
</main>
