import { t, type Static } from 'elysia';

// `panel` and `modal` are tolerated as optional so older clients (and themes
// authored before those tokens existed) still pass validation. They get
// backfilled in `normalizePalette` before storage / serialization.
export const paletteSchema = t.Object({
	background: t.String(),
	border: t.String(),
	borderStrong: t.String(),
	input: t.String(),
	primary: t.String(),
	info: t.String(),
	foregroundOpposite: t.String(),
	foreground: t.String(),
	muted: t.String(),
	panel: t.Optional(t.String()),
	modal: t.Optional(t.String()),
	foregroundMuted: t.String(),
	foregroundButton: t.String(),
	secondary: t.String(),
	card: t.String(),
	accent: t.String(),
	alternate: t.String(),
	success: t.String(),
	warning: t.String(),
	error: t.String(),
	destructive: t.String(),
	overlay: t.String(),
	ring: t.String()
});

export const motionSchema = t.Object({
	panelDuration: t.String(),
	panelX: t.Number(),
	panelBlur: t.Number(),
	panelScaleStart: t.Number(),
	sheetDuration: t.String(),
	sheetOffset: t.Number(),
	overlayDuration: t.String(),
	overlayBlur: t.Number(),
	panelEasing: t.Optional(t.String())
});

// Free-form slug so new presets (crisp, swift, gentle, dramatic, glide, none,
// or anything the user invents in the studio) round-trip without a registry
// schema update.
export const durationPresetSlugSchema = t.String({ minLength: 1 });

export const typographySchema = t.Object({
	weightHeader: t.Number({ minimum: 100, maximum: 900 }),
	weightBody: t.Number({ minimum: 100, maximum: 900 }),
	weightLabel: t.Number({ minimum: 100, maximum: 900 }),
	weightButton: t.Number({ minimum: 100, maximum: 900 }),
	weightBadge: t.Number({ minimum: 100, maximum: 900 })
});

const themeSharedFields = {
	name: t.String({ minLength: 1 }),
	description: t.String(),
	publisher: t.Optional(t.String()),
	fontSans: t.String(),
	fontMono: t.String(),
	fontHeader: t.String(),
	radiusBase: t.String(),
	radiusSm: t.String(),
	radiusMd: t.String(),
	radiusLg: t.String(),
	radiusXl: t.String(),
	primaryButtonOutline: t.Boolean(),
	invertedPanels: t.Boolean(),
	durationPreset: durationPresetSlugSchema,
	motion: motionSchema,
	light: paletteSchema,
	dark: paletteSchema,
	/** Optional — older themes from before the typography field exists round-trip without it. */
	typography: t.Optional(typographySchema)
};

export const themeDraftSchema = t.Object({
	slug: t.String({ minLength: 1, pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' }),
	...themeSharedFields
});

export const themeRecordSchema = t.Object({
	id: t.String(),
	slug: t.String(),
	...themeSharedFields,
	createdAt: t.String(),
	updatedAt: t.String()
});

export const themeListSchema = t.Array(themeRecordSchema);

export const slugParamsSchema = t.Object({
	slug: t.String({ minLength: 1 })
});

export const publishResponseSchema = t.Object({
	success: t.Literal(true),
	message: t.Literal('Successfully published theme!')
});

export const slugConflictSchema = t.Union([
	t.Literal('A theme with this slug already exists, try another one.'),
	t.Literal('This slug is reserved for a built-in theme.')
]);
export const themeNotFoundSchema = t.Literal('A theme with this slug does not exist.');

export type ThemePalette = Static<typeof paletteSchema>;
export type ThemeMotion = Static<typeof motionSchema>;
export type ThemeDurationPresetSlug = Static<typeof durationPresetSlugSchema>;
export type ThemeDraft = Static<typeof themeDraftSchema>;
export type ThemeRecord = Static<typeof themeRecordSchema>;
