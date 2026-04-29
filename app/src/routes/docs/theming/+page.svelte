<script lang="ts">
	import CodeBlock from '$lib/components/docs/code-block.svelte';
	import ColorPicker from '$lib/components/themes/color-picker.svelte';
	import PageHeader from '$lib/components/docs/page-header.svelte';

	let previewColor = $state('#155eef');
</script>

<main class="flex w-full flex-col pb-12">
	<PageHeader
		title="Custom Theming"
		description="Build a theme system that controls color, shape, motion, and surface tone from a cleaner foundation."
		compact={true}
	/>

	<section class="grid gap-4 pt-6">
		<p class="text-base leading-7 text-foreground-muted">
			Silk UI is designed so the whole interface moves together when you change a small set of core
			tokens. Start with semantic values like background, card, panel, text, primary, ring, and
			radius. Those feed the primitives first. Component-specific tokens come second.
		</p>
		<div
			class="rounded-lg border border-border bg-[var(--card-bg)] p-5 shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)]"
		>
			<p class="text-sm font-semibold uppercase tracking-[0.12em] text-foreground-muted">
				Theming layers
			</p>
			<div class="mt-4 grid gap-3">
				<p class="text-sm leading-6 text-foreground-muted">
					1. Semantic tokens shape the overall brand and surface language.
				</p>
				<p class="text-sm leading-6 text-foreground-muted">
					2. Component tokens let you refine controls without forking them.
				</p>
				<p class="text-sm leading-6 text-foreground-muted">
					3. `data-ui` hooks give you local overrides when a specific primitive needs extra care.
				</p>
			</div>
		</div>
	</section>

	<section class="mt-8 flex flex-col gap-2">
		<p class="docs-section-heading">1. Start with semantic tokens</p>
		<p class="text-base leading-7 text-foreground-muted">
			Think in terms of the whole interface, not isolated components. If your background, cards,
			text, and primary accent are balanced, a lot of the library will already feel cohesive.
		</p>
		<CodeBlock
			code={`@theme {
	--font-sans: 'Geist';
	--font-mono: 'Geist Mono';
	--font-header: 'Geist';

	--color-background: #fcfcfd;
	--color-foreground: #101828;
	--color-foreground-muted: #667085;
	--color-primary: #155eef;
	--color-border: #dde2ea;
	--color-input: #c9d1dc;
	--color-secondary: #f2f4f7;
	--color-panel: #ffffff;
	--color-card: #ffffff;
	--color-ring: rgb(21 94 239 / 0.18);

	--radius-lg: 0.55rem;
	--radius-xl: 0.67rem;
}

.dark {
	--color-background: #0d1118;
	--color-foreground: #f5f7fb;
	--color-foreground-muted: #98a2b3;
	--color-primary: #7aa2ff;
	--color-border: #27303f;
	--color-input: #334155;
	--color-secondary: #141b26;
	--color-panel: #171f2b;
	--color-card: #1a2431;
	--color-ring: rgb(122 162 255 / 0.22);
}`}
			class="p-3 max-h-[35rem]"
			lang="css"
		/>
	</section>

	<section class="mt-8 flex flex-col gap-2">
		<p class="docs-section-heading">2. Shape the interaction feel</p>
		<p class="text-base leading-7 text-foreground-muted">
			Theming is more than color. Radius, panel shadows, overlay blur, and motion timing change how
			the UI feels just as much as hue does.
		</p>
		<CodeBlock
			code={`:root {
	--button-radius: 999px;
	--button-height: 2.6rem;
	--button-primary-bg: #155eef;
	--button-primary-hover-bg: #0f4fd6;

	--field-radius: 0.8rem;
	--field-height: 2.75rem;

	--panel-radius: 0.9rem;
	--panel-shadow: 0 18px 42px rgb(16 24 40 / 0.12);

	--motion-duration-panel: 240ms;
	--motion-duration-sheet: 320ms;
	--motion-overlay-blur: 6px;
}`}
			class="p-3 max-h-[25rem]"
			lang="css"
		/>
	</section>

	<section class="mt-8 flex flex-col gap-2">
		<p class="docs-section-heading">3. Override one primitive at a time when needed</p>
		<p class="text-base leading-7 text-foreground-muted">
			When a single component needs to break from the system a bit, reach for the exposed hooks
			before you rewrite the component. That keeps customizations explicit and easier to maintain.
		</p>
		<CodeBlock
			code={`[data-ui='button'][data-variant='primary'] {
	letter-spacing: 0.01em;
}

[data-ui='dialog-content'] {
	--panel-radius: 1rem;
	--panel-padding-lg: 1.5rem;
}

[data-ui='toast'] {
	--color-border: color-mix(in srgb, var(--color-primary) 24%, var(--color-border));
}

[data-ui='dropdown-menu-content'] {
	--color-panel: color-mix(in srgb, var(--color-panel) 90%, white);
}`}
			class="p-3 max-h-[20rem]"
			lang="css"
		/>
	</section>

	<section class="mt-8 flex flex-col gap-3">
		<p class="docs-section-heading">4. Use the theme editor primitives</p>
		<p class="text-base leading-7 text-foreground-muted">
			The same editor tooling used on the Themes page is available inside the app, so if you are
			building internal theme controls or a preset manager, you can reuse the same pieces.
		</p>
		<div
			class="rounded-lg border border-border bg-[var(--card-bg)] p-4 shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)]"
		>
			<ColorPicker
				label="Primary"
				value={previewColor}
				onValueChange={(value) => {
					previewColor = value;
				}}
			/>
		</div>
	</section>

	<section class="mt-8 flex flex-col gap-2">
		<p class="docs-section-heading">5. Install a preset, then customize from there</p>
		<p class="text-base leading-7 text-foreground-muted">
			If you do not want to start from zero, install a preset and tune it. The preset gallery lives
			on the <a href="/themes" class="font-medium underline">themes page</a>.
		</p>
		<CodeBlock code={'npx @aidan-neel/ui theme install [name]'} lang="shell" />
		<p class="text-base leading-7 text-foreground-muted">
			After installing, import your chosen file in your main stylesheet and continue overriding
			tokens as needed.
		</p>
		<CodeBlock
			code={`/* Chosen Theme */
@import './themes/default.css';`}
			lang="css"
		/>
	</section>
</main>
