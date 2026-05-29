import { status } from 'elysia';
import { prisma } from '@lib/prisma';
import type { ThemeDraft, ThemeMotion, ThemePalette, ThemeRecord } from './model';
import { defaultThemeRecord, defaultThemes, findDefaultTheme, isDefaultSlug } from './defaults';

type PersistedTheme = Awaited<ReturnType<typeof prisma.theme.findFirst>>;

const FALLBACK_INFO_LIGHT = '#2563eb';
const FALLBACK_INFO_DARK = '#60a5fa';

function toIso(value: Date | string): string {
	return value instanceof Date ? value.toISOString() : value;
}

function normalizePalette(palette: unknown, fallbackInfo: string): ThemePalette {
	const value = palette as Partial<ThemePalette> & {
		info?: string;
		panel?: string;
		modal?: string;
	};
	const panel = value.panel ?? value.card ?? '#ffffff';
	const modal = value.modal ?? panel;
	return {
		...(value as ThemePalette),
		info: value.info ?? fallbackInfo,
		panel,
		modal
	};
}

function serialize(theme: NonNullable<PersistedTheme>): ThemeRecord {
	// Cast through `any` because the generated Prisma client lags the schema
	// until `prisma generate` runs. After that this can be removed.
	const t = theme as unknown as Record<string, unknown> & NonNullable<PersistedTheme>;
	const { publisher, motion, light, dark, createdAt, updatedAt, ...rest } = t;
	const typography = t.typography;
	const record: ThemeRecord = {
		...(rest as unknown as ThemeRecord),
		motion: motion as ThemeMotion,
		light: normalizePalette(light, FALLBACK_INFO_LIGHT),
		dark: normalizePalette(dark, FALLBACK_INFO_DARK),
		createdAt: toIso(createdAt as Date | string),
		updatedAt: toIso(updatedAt as Date | string)
	};
	if (publisher) record.publisher = publisher as string;
	if (typography) record.typography = typography as ThemeRecord['typography'];
	return record;
}

export async function listThemes(): Promise<ThemeRecord[]> {
	const [rows, hidden] = await Promise.all([
		prisma.theme.findMany({ orderBy: { name: 'asc' } }),
		prisma.hiddenDefault.findMany({ select: { slug: true } })
	]);
	const published = rows.map(serialize);
	const publishedSlugs = new Set(published.map((theme) => theme.slug));
	const hiddenSlugs = new Set(hidden.map((row) => row.slug));

	const unshadowedDefaults = defaultThemes
		.filter((theme) => !publishedSlugs.has(theme.slug) && !hiddenSlugs.has(theme.slug))
		.map(defaultThemeRecord);

	return [...unshadowedDefaults, ...published].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getThemeBySlug(slug: string): Promise<ThemeRecord> {
	const builtIn = findDefaultTheme(slug);
	if (builtIn) return defaultThemeRecord(builtIn);

	const theme = await prisma.theme.findUnique({ where: { slug } });
	if (!theme) {
		throw status(404, 'A theme with this slug does not exist.' as const);
	}

	return serialize(theme);
}

export async function publishTheme(input: ThemeDraft) {
	if (isDefaultSlug(input.slug)) {
		throw status(409, 'This slug is reserved for a built-in theme.' as const);
	}

	const existing = await prisma.theme.findUnique({
		where: { slug: input.slug },
		select: { id: true }
	});
	if (existing) {
		throw status(409, 'A theme with this slug already exists, try another one.' as const);
	}

	// Cast through `any` because the generated Prisma client lags the schema
	// until `prisma generate` runs. The `typography` column exists in the DB
	// (schema.prisma) but the regenerated types haven't propagated yet.
	await prisma.theme.create({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		data: {
			...input,
			light: normalizePalette(input.light, FALLBACK_INFO_LIGHT),
			dark: normalizePalette(input.dark, FALLBACK_INFO_DARK),
			publisher: input.publisher ?? null,
			typography: input.typography ?? null
		} as never
	});

	return {
		success: true as const,
		message: 'Successfully published theme!' as const
	};
}
