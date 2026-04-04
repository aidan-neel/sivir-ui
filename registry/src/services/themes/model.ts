import { t, type UnwrapSchema } from 'elysia';

const ThemePalette = t.Object({
	background: t.String(),
	border: t.String(),
	borderStrong: t.String(),
	input: t.String(),
	primary: t.String(),
	foregroundOpposite: t.String(),
	foreground: t.String(),
	muted: t.String(),
	popover: t.String(),
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

const ThemeMotion = t.Object({
	panelDuration: t.String(),
	panelX: t.Number(),
	panelBlur: t.Number(),
	panelScaleStart: t.Number(),
	sheetDuration: t.String(),
	sheetOffset: t.Number(),
	overlayDuration: t.String(),
	overlayBlur: t.Number()
});

const ThemeDurationPresetSlug = t.Union([
	t.Literal('default'),
	t.Literal('snappy'),
	t.Literal('instant'),
	t.Literal('smooth')
]);

export const ThemesModel = {
	publishBody: t.Object({
		slug: t.String(),
		name: t.String(),
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
		durationPreset: ThemeDurationPresetSlug,
		motion: ThemeMotion,
		light: ThemePalette,
		dark: ThemePalette
	}),
	publishResponse: t.Object({
		success: t.Boolean(),
		message: t.Literal('Successfully published theme!')
	}),

	getBySlugBody: t.Object({
		slug: t.String()
	}),

	getBySlugResponse: t.Object({
		id: t.String(),
		slug: t.String(),
		name: t.String(),
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
		durationPreset: ThemeDurationPresetSlug,
		motion: ThemeMotion,
		light: ThemePalette,
		dark: ThemePalette,
		createdAt: t.String(),
		updatedAt: t.String()
	}),

	slugTaken: t.Literal('A theme with this slug already exists, try another one.'),
	doesntExist: t.Literal('A theme with this slug does not exist.')
};

export type ThemesModel = {
	[k in keyof typeof ThemesModel]: UnwrapSchema<(typeof ThemesModel)[k]>;
};
