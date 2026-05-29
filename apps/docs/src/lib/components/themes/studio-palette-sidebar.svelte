<script lang="ts">
	import { Button } from '@silk/ui/components/button';
	import { ColorPicker, type ColorOption } from '@silk/ui/components/color-picker';
	import type { ThemeBasePalette, ThemeDraft } from '@silk/ui/themes/presets';

	type AccentOption = { label: string; value: string; light: string; dark: string };
	type BasePaletteKey = keyof ThemeBasePalette;

	type Props = {
		activeAccentValue: string;
		accentOptions: AccentOption[];
		lightBasePalette: ThemeBasePalette;
		darkBasePalette: ThemeBasePalette;
		lightBackgroundOptions: ColorOption[];
		lightSurfaceOptions: ColorOption[];
		lightTextOptions: ColorOption[];
		lightPrimaryOptions: ColorOption[];
		lightBorderOptions: ColorOption[];
		darkBackgroundOptions: ColorOption[];
		darkSurfaceOptions: ColorOption[];
		darkTextOptions: ColorOption[];
		darkPrimaryOptions: ColorOption[];
		darkBorderOptions: ColorOption[];
		editorTheme: ThemeDraft;
		applyAccentColor: (option: AccentOption) => void;
		applyBasePalette: (mode: 'light' | 'dark') => void;
		updateBasePalette: (mode: 'light' | 'dark', key: BasePaletteKey, value: string) => void;
		updatePaletteToken: (mode: 'light' | 'dark', key: 'border', value: string) => void;
	};

	let {
		activeAccentValue,
		accentOptions,
		lightBasePalette,
		darkBasePalette,
		lightBackgroundOptions,
		lightSurfaceOptions,
		lightTextOptions,
		lightPrimaryOptions,
		lightBorderOptions,
		darkBackgroundOptions,
		darkSurfaceOptions,
		darkTextOptions,
		darkPrimaryOptions,
		darkBorderOptions,
		editorTheme,
		applyAccentColor,
		applyBasePalette,
		updateBasePalette,
		updatePaletteToken
	}: Props = $props();
</script>

<div class="flex h-full flex-col overflow-hidden">
	<div class="shrink-0 border-b border-border/60 px-4 py-3.5">
		<p class="text-sm [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] text-foreground">Palette</p>
		<p class="mt-0.5 text-sm [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted">Colors and accent for this theme</p>
	</div>

	<div class="flex-1 overflow-y-auto">
		<!-- Accent -->
		<div class="border-b border-border/60 p-4">
			<p class="mb-3 text-sm [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">Accent</p>
			<div class="grid grid-cols-3 gap-2">
				{#each accentOptions as option}
					{@const isActive = activeAccentValue === option.value}
					<button
						type="button"
						class="group flex flex-col items-center gap-2 rounded-[var(--radius-md)] px-2 py-3 transition-colors hover:bg-secondary/50 {isActive
							? 'bg-secondary/60'
							: ''}"
						onclick={() => applyAccentColor(option)}
						aria-pressed={isActive}
					>
						<div
							class="size-8 rounded-full border-[3px] shadow-sm transition-transform group-hover:scale-105 {isActive
								? 'scale-105 border-white shadow-md'
								: 'border-transparent'}"
							style="background:{option.light};"
						></div>
						<span
							class="text-sm {isActive ? '[font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground' : 'text-foreground-muted'}"
							>{option.label}</span
						>
					</button>
				{/each}
			</div>
		</div>

		<!-- Light mode -->
		<div class="border-b border-border/60 p-4">
			<div class="mb-3 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<div class="size-3.5 rounded-full border border-border/60 bg-white shadow-sm"></div>
					<span class="text-sm [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground">Light</span>
				</div>
				<Button
					variant="secondary"
					class="h-7 px-3 text-sm"
					onclick={() => applyBasePalette('light')}
				>
					Generate
				</Button>
			</div>
			<div class="space-y-3">
				<ColorPicker
					label="Background"
					value={lightBasePalette.background}
					onValueChange={(v) => updateBasePalette('light', 'background', v)}
					options={lightBackgroundOptions}
				/>
				<ColorPicker
					label="Card"
					value={lightBasePalette.card}
					onValueChange={(v) => updateBasePalette('light', 'card', v)}
					options={lightSurfaceOptions}
				/>
				<ColorPicker
					label="Text"
					value={lightBasePalette.text}
					onValueChange={(v) => updateBasePalette('light', 'text', v)}
					options={lightTextOptions}
				/>
				<ColorPicker
					label="Primary"
					value={lightBasePalette.primary}
					onValueChange={(v) => updateBasePalette('light', 'primary', v)}
					options={lightPrimaryOptions}
				/>
				<ColorPicker
					label="Border"
					value={editorTheme.light.border}
					onValueChange={(v) => updatePaletteToken('light', 'border', v)}
					options={lightBorderOptions}
				/>
			</div>
		</div>

		<!-- Dark mode -->
		<div class="p-4">
			<div class="mb-3 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<div class="size-3.5 rounded-full border border-border/60 bg-[#0f172a] shadow-sm"></div>
					<span class="text-sm [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground">Dark</span>
				</div>
				<Button
					variant="secondary"
					class="h-7 px-3 text-sm"
					onclick={() => applyBasePalette('dark')}
				>
					Generate
				</Button>
			</div>
			<div class="space-y-3">
				<ColorPicker
					label="Background"
					value={darkBasePalette.background}
					onValueChange={(v) => updateBasePalette('dark', 'background', v)}
					options={darkBackgroundOptions}
				/>
				<ColorPicker
					label="Card"
					value={darkBasePalette.card}
					onValueChange={(v) => updateBasePalette('dark', 'card', v)}
					options={darkSurfaceOptions}
				/>
				<ColorPicker
					label="Text"
					value={darkBasePalette.text}
					onValueChange={(v) => updateBasePalette('dark', 'text', v)}
					options={darkTextOptions}
				/>
				<ColorPicker
					label="Primary"
					value={darkBasePalette.primary}
					onValueChange={(v) => updateBasePalette('dark', 'primary', v)}
					options={darkPrimaryOptions}
				/>
				<ColorPicker
					label="Border"
					value={editorTheme.dark.border}
					onValueChange={(v) => updatePaletteToken('dark', 'border', v)}
					options={darkBorderOptions}
				/>
			</div>
		</div>
	</div>
</div>
