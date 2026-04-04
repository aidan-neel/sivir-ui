<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import RotateCw from '@lucide/svelte/icons/rotate-cw';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import * as Select from '$lib/silk/components/select';
	import type { ThemeDraft, ThemeDurationPreset } from '$lib/silk/themes/presets';

	type FontOption = { label: string; value: string };
	type RadiusOption = { label: string; value: string };
	type DurationOption = { label: string; value: string };
	type PanelStyleOption = { label: string; value: 'standard' | 'inverted' };
	type NumericMotionKey = 'panelX' | 'panelBlur' | 'panelScaleStart' | 'sheetOffset' | 'overlayBlur';
	type MotionField = {
		key: NumericMotionKey;
		label: string;
		min: number;
		max: number;
		step: number;
		suffix?: string;
	};
	type AccentOption = {
		label: string;
		value: string;
		light: string;
		dark: string;
	};

	type Props = {
		editorName: string;
		activePresetName: string;
		selectedPresetSlug: string;
		activeAccentValue: string;
		accentOptions: AccentOption[];
		themesCatalog: ThemeDraft[];
		editorTheme: ThemeDraft;
		headerFontSelection: string;
		bodyFontSelection: string;
		radiusOptions: RadiusOption[];
		durationPresets: ThemeDurationPreset[];
		panelStyleOptions: PanelStyleOption[];
		fontOptions: FontOption[];
		durationOptions: DurationOption[];
		motionFields: MotionField[];
		undoDisabled: boolean;
		redoDisabled: boolean;
		loadPreset: (theme: ThemeDraft) => void;
		updateEditorName: (value: string) => void;
		undoHistory: () => void;
		redoHistory: () => void;
		updateRadius: (value: string) => void;
		updateDurationPreset: (value: ThemeDurationPreset['slug']) => void;
		updatePanelStyle: (value: PanelStyleOption['value']) => void;
		updatePrimaryButtonOutline: (value: boolean) => void;
		updateHeaderFont: (label: string) => void;
		updateBodyFont: (label: string) => void;
		updateMotionDuration: (
			key: 'panelDuration' | 'sheetDuration' | 'overlayDuration',
			value: string
		) => void;
		updateMotionField: (key: NumericMotionKey, value: number) => void;
		applyAccentColor: (option: AccentOption) => void;
		openAdvancedOptions: () => void;
	};

	let {
		editorName = $bindable(),
		activePresetName,
		selectedPresetSlug,
		activeAccentValue,
		accentOptions,
		themesCatalog,
		editorTheme,
		headerFontSelection,
		bodyFontSelection,
		radiusOptions,
		durationPresets,
		panelStyleOptions,
		fontOptions,
		durationOptions,
		motionFields,
		undoDisabled,
		redoDisabled,
		loadPreset,
		updateEditorName,
		undoHistory,
		redoHistory,
		updateRadius,
		updateDurationPreset,
		updateHeaderFont,
		updateBodyFont,
		applyAccentColor,
		openAdvancedOptions
	}: Props = $props();
</script>

<div class="sticky top-4 max-h-[calc(100vh-5rem)] overflow-y-auto pr-1">
	<div class="rounded-[1.6rem] border border-border/60 bg-background/86 p-3 text-foreground shadow-[0_10px_32px_rgba(15,23,42,0.08)] backdrop-blur">
		<div class="rounded-[1rem] border border-border/60 bg-card/55 p-3">
			<div class="flex items-center justify-between gap-3">
				<div>
					<p class="text-xs uppercase tracking-[0.16em] text-foreground-muted">Studio</p>
					<p class="mt-1 text-sm font-medium text-foreground">{activePresetName}</p>
				</div>
				<Sparkles size={16} class="text-primary" />
			</div>
			<p class="text-xs text-foreground-muted">Theme name</p>
			<input
				class="mt-1 w-full bg-transparent text-[1.05rem] font-medium text-foreground outline-none placeholder:text-foreground-muted"
				bind:value={editorName}
				placeholder="Untitled Theme"
				oninput={(event) => updateEditorName((event.currentTarget as HTMLInputElement).value)}
			/>
		</div>

		<div class="mt-3 space-y-3 rounded-[1rem] border border-border/60 bg-card/55 p-3">
			<div class="flex items-center justify-between gap-2">
				<p class="text-xs uppercase tracking-[0.14em] text-foreground-muted">Quick actions</p>
				<div class="flex gap-2">
					<button
						type="button"
						class="flex size-8 items-center justify-center rounded-full border border-border/60 bg-background/80 text-foreground disabled:opacity-35"
						onclick={undoHistory}
						disabled={undoDisabled}
						aria-label="Undo"
					>
						<RotateCcw size={14} />
					</button>
					<button
						type="button"
						class="flex size-8 items-center justify-center rounded-full border border-border/60 bg-background/80 text-foreground disabled:opacity-35"
						onclick={redoHistory}
						disabled={redoDisabled}
						aria-label="Redo"
					>
						<RotateCw size={14} />
					</button>
				</div>
			</div>

			<a
				href="/themes"
				class="flex items-center justify-center gap-2 rounded-[0.95rem] border border-border/60 bg-background/80 px-4 py-2.5 text-sm font-medium text-foreground"
			>
				<ChevronLeft size={14} />
				Back
			</a>
		</div>

		<div class="mt-3 space-y-3 rounded-[1rem] border border-border/60 bg-card/55 p-3">
			<div class="grid gap-2">
				<p class="text-xs uppercase tracking-[0.14em] text-foreground-muted">Preset</p>
				<Select.Root value={selectedPresetSlug} class="">
					<Select.Trigger class="w-full" variant="outlined">Choose a preset</Select.Trigger>
					<Select.Content class="">
						{#each themesCatalog as preset}
							<Select.Item value={preset.slug} onclick={() => loadPreset(preset)}>
								{preset.name}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div>
				<p class="text-xs uppercase tracking-[0.14em] text-foreground-muted">Accent</p>
				<Select.Root value={activeAccentValue} class="">
					<Select.Trigger class="mt-2 w-full" variant="outlined">Choose an accent</Select.Trigger>
					<Select.Content class="">
						{#each accentOptions as option}
							<Select.Item value={option.value} onclick={() => applyAccentColor(option)}>
								{option.label}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<div class="mt-3 grid grid-cols-3 gap-2">
					{#each accentOptions as option}
						<button
							type="button"
							class={`rounded-[0.95rem] border px-2 py-2 text-center text-xs font-medium transition ${
								activeAccentValue === option.value
									? 'border-primary/30 bg-primary/10 text-foreground'
									: 'border-border/50 bg-background/70 text-foreground'
							}`}
							onclick={() => applyAccentColor(option)}
						>
							<div class="mx-auto mb-2 size-5 rounded-full border border-black/5" style={`background:${option.light};`}></div>
							{option.label}
						</button>
					{/each}
				</div>
			</div>

			<div class="grid gap-3">
				<div class="grid gap-2">
					<p class="text-xs uppercase tracking-[0.14em] text-foreground-muted">Heading font</p>
					<Select.Root value={headerFontSelection} class="">
						<Select.Trigger class="w-full" variant="outlined">Choose heading font</Select.Trigger>
						<Select.Content class="">
							{#each fontOptions as option}
								<Select.Item value={option.label} onclick={() => updateHeaderFont(option.label)}>
									{option.label}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<div class="grid gap-2">
					<p class="text-xs uppercase tracking-[0.14em] text-foreground-muted">Body font</p>
					<Select.Root value={bodyFontSelection} class="">
						<Select.Trigger class="w-full" variant="outlined">Choose body font</Select.Trigger>
						<Select.Content class="">
							{#each fontOptions as option}
								<Select.Item value={option.label} onclick={() => updateBodyFont(option.label)}>
									{option.label}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<div class="grid gap-2">
					<p class="text-xs uppercase tracking-[0.14em] text-foreground-muted">Radius</p>
					<Select.Root value={editorTheme.radiusBase} class="">
						<Select.Trigger class="w-full" variant="outlined">Choose radius</Select.Trigger>
						<Select.Content class="">
							{#each radiusOptions as option}
								<Select.Item value={option.value} onclick={() => updateRadius(option.value)}>
									{option.label}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<div class="grid gap-2">
					<p class="text-xs uppercase tracking-[0.14em] text-foreground-muted">Motion</p>
					<Select.Root value={editorTheme.durationPreset} class="">
						<Select.Trigger class="w-full" variant="outlined">Choose motion preset</Select.Trigger>
						<Select.Content class="">
							{#each durationPresets as preset}
								<Select.Item value={preset.slug} onclick={() => updateDurationPreset(preset.slug)}>
									{preset.name}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			</div>

			<button
				type="button"
				class="mt-2 w-full rounded-[1rem] bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
				onclick={openAdvancedOptions}
			>
				More options
			</button>
		</div>
	</div>
</div>
