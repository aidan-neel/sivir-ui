<script lang="ts">
	import PageHeader from '$lib/components/docs/page-header.svelte';
</script>

<main class="flex w-full flex-col pb-12">
	<PageHeader
		title="Introduction"
		description="A calmer way to build polished Svelte interfaces without giving up ownership."
		compact={true}
	/>

	<section class="grid gap-4 pt-6">
		<p class="text-base leading-7 text-foreground-muted">
			Silk UI is a collection of design-forward Svelte 5 components built for teams that want a
			strong baseline without locking themselves into someone else’s design system. The defaults are
			intentional, the surfaces are calmer, and the theming model is deep enough to keep growing
			with your product.
		</p>
		<p class="text-base leading-7 text-foreground-muted">
			This is not a traditional package where the entire UI layer lives behind a dependency wall.
			You add the parts you need, keep the code in your app, and shape it from there. That means
			you get faster adoption up front and more freedom later when your product inevitably starts
			asking for something more specific.
		</p>
	</section>

	<section class="mt-8 grid gap-4 md:grid-cols-3">
		<div class="rounded-lg border border-border bg-[var(--card-bg)] p-4 shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)]">
			<p class="text-sm font-semibold text-foreground">Copyable primitives</p>
			<p class="mt-2 text-sm leading-6 text-foreground-muted">
				Bring in a component, own the code, and keep shipping without fighting opaque internals.
			</p>
		</div>
		<div class="rounded-lg border border-border bg-[var(--card-bg)] p-4 shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)]">
			<p class="text-sm font-semibold text-foreground">Token-first theming</p>
			<p class="mt-2 text-sm leading-6 text-foreground-muted">
				Adjust the overall mood with semantic tokens, then go deeper with component-level variables
				only when you need to.
			</p>
		</div>
		<div class="rounded-lg border border-border bg-[var(--card-bg)] p-4 shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)]">
			<p class="text-sm font-semibold text-foreground">Polished interaction states</p>
			<p class="mt-2 text-sm leading-6 text-foreground-muted">
				Menus, dialogs, sheets, focus states, and overlays are tuned to feel deliberate instead of
				unfinished.
			</p>
		</div>
	</section>

	<section class="mt-8 grid gap-4">
		<div>
			<h2 class="text-2xl font-semibold tracking-[-0.03em] text-foreground">
				How to think about Silk UI
			</h2>
			<p class="mt-3 text-base leading-7 text-foreground-muted">
				The fastest way to get value from the library is to treat it like a stronger starting point,
				not a finished brand. Pull in a component, use the default structure, and then make it feel
				more like your product through theme tokens, component tokens, and selective edits.
			</p>
		</div>

		<div class="rounded-lg border border-border bg-[var(--card-bg)] p-5 shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)]">
			<p class="text-sm font-semibold uppercase tracking-[0.12em] text-foreground-muted">
				Recommended flow
			</p>
			<div class="mt-4 grid gap-3">
				<p class="text-sm leading-6 text-foreground-muted">
					1. Start with the <a href="/docs/installation" class="font-medium underline">installation</a>
					guide and add one or two components.
				</p>
				<p class="text-sm leading-6 text-foreground-muted">
					2. Set your baseline tokens in <a href="/docs/theming" class="font-medium underline"
						>theming</a
					> so the whole system moves together.
				</p>
				<p class="text-sm leading-6 text-foreground-muted">
					3. Use the <a href="/themes" class="font-medium underline">themes page</a> to test colors,
					motion, and surfaces before you lock anything in.
				</p>
				<p class="text-sm leading-6 text-foreground-muted">
					4. Reach for per-component overrides only when a product-specific pattern truly needs it.
				</p>
			</div>
		</div>
	</section>

	<section class="mt-8 grid gap-4">
		<div>
			<h2 class="text-2xl font-semibold tracking-[-0.03em] text-foreground">
				What it is not
			</h2>
			<p class="mt-3 text-base leading-7 text-foreground-muted">
				Silk UI is not trying to be a giant abstraction layer that decides the shape of your app for
				you. It is also not a “set it and forget it” drop-in where the defaults should never be
				touched. The goal is a better baseline, better tokens, and better interaction quality, while
				still leaving enough room for your product to become itself.
			</p>
		</div>
	</section>
</main>
