<script lang="ts">
	import CodeBlock from '$lib/components/docs/code-block.svelte';
	import ColorPicker from '$lib/components/themes/color-picker.svelte';
	import PageHeader from '$lib/components/docs/page-header.svelte';

	let previewColor = $state('#155eef');
</script>

<main class="flex w-full flex-col pb-12">
	<PageHeader title="Custom Theming" description="Build themes that scale past just color swaps" compact={true} />

	<section class="flex flex-col gap-1 mt-6">
		<p class="text-2xl font-semibold">1. Start with semantic tokens</p>
		<p class="text-base py-4">
			Define your brand colors, surfaces, radii, and ring values with `@theme`. Those feed the
			entire component system automatically.
		</p>
		<CodeBlock
			code={`@theme {
	--font-sans: 'Geist';
	--color-background: #ffffff;
	--color-border: #dedede;
	--color-input: #d9d9d9;
	--color-primary: #2685d9;
	--color-foreground: #171717;
	--color-foreground-btn: #ffffff;
	--color-secondary: #ececec;
	--color-popover: #ffffff;
	--color-card: #f6f6f6;
	--radius-lg: 0.75rem;
	--color-ring: rgb(38 133 217 / 0.24);
}

.dark {
	--color-background: #0f0f10;
	--color-border: #222224;
	--color-input: #2f2f33;
	--color-primary: #4da3f0;
	--color-foreground: #f2f2f2;
	--color-foreground-btn: #071018;
	--color-secondary: #18181b;
	--color-popover: #151518;
	--color-card: #131316;
	--color-ring: rgb(77 163 240 / 0.3);
}`}
			class="p-3 max-h-[35rem]"
			lang="css"
		/>
	</section>

	<section class="flex flex-col gap-1 mt-6">
		<p class="text-2xl font-semibold">2. Override component tokens when needed</p>
		<p class="text-base py-4">
			You can go deeper without forking components by overriding tokens like
			`--button-primary-bg`, `--field-height`, `--panel-radius`, or `--toast-shadow`.
		</p>
		<CodeBlock
			code={`:root {
	--button-radius: 999px;
	--button-height: 2.6rem;
	--button-primary-bg: #101828;
	--button-primary-hover-bg: #1d2939;

	--field-radius: 1rem;
	--field-height: 3rem;

	--panel-radius: 1.25rem;
	--panel-shadow: 0 24px 80px rgb(0 0 0 / 0.16);

	--toast-radius: 1rem;
}`}
			class="p-3 max-h-[25rem]"
			lang="css"
		/>
	</section>

	<section class="flex flex-col gap-1 mt-6">
		<p class="text-2xl font-semibold">3. Target individual primitives</p>
		<p class="text-base py-4">
			Major components render `data-ui` hooks so one-off adjustments stay local and explicit.
		</p>
		<CodeBlock
			code={`[data-ui='button'][data-variant='primary'] {
	text-transform: uppercase;
}

[data-ui='dialog-content'] {
	--panel-radius: 1.5rem;
}

[data-ui='switch'] {
	--switch-track-active-bg: #111827;
}`}
			class="p-3 max-h-[20rem]"
			lang="css"
		/>
	</section>

	<section class="flex flex-col gap-3 mt-8">
		<p class="text-2xl font-semibold">4. Use the theme editor primitives</p>
		<p class="text-base py-1">
			The same color picker used on the Themes page is available for editor-style tooling and
			internal theme controls.
		</p>
		<div class="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--card-radius)] shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)] rounded-xl p-4">
			<ColorPicker
				label="Primary"
				value={previewColor}
				onValueChange={(value) => {
					previewColor = value;
				}}
			/>
		</div>
	</section>

	<section class="flex flex-col gap-1 mt-6">
		<p class="text-2xl font-semibold">Install a theme</p>
		<p class="text-base py-4">
			Use the CLI to install a theme to your project. A list of themes with previews is available
			<a href="/themes" class="underline font-medium">here</a>.
		</p>
		<CodeBlock code={'npx @aidan-neel/ui theme install [name]'} lang="shell" />
		<p class="text-base py-4">
			After installing, import your chosen theme in the main CSS file.
		</p>
		<CodeBlock
			code={`/* Chosen Theme */
@import './themes/default.css';`}
			lang="css"
		/>
	</section>
</main>
