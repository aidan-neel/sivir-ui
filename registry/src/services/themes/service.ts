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
	const value = palette as ThemePalette & { info?: string };
	return value.info ? value : { ...value, info: fallbackInfo };
}

function serialize(theme: NonNullable<PersistedTheme>): ThemeRecord {
	const { publisher, motion, light, dark, createdAt, updatedAt, ...rest } = theme;
	const record: ThemeRecord = {
		...rest,
		motion: motion as ThemeMotion,
		light: normalizePalette(light, FALLBACK_INFO_LIGHT),
		dark: normalizePalette(dark, FALLBACK_INFO_DARK),
		createdAt: toIso(createdAt),
		updatedAt: toIso(updatedAt)
	};
	if (publisher) record.publisher = publisher;
	return record;
}

export async function listThemes(): Promise<ThemeRecord[]> {
	const rows = await prisma.theme.findMany({ orderBy: { name: 'asc' } });
	const published = rows.map(serialize);
	const publishedSlugs = new Set(published.map((theme) => theme.slug));

	const unshadowedDefaults = defaultThemes
		.filter((theme) => !publishedSlugs.has(theme.slug))
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

	await prisma.theme.create({
		data: {
			...input,
			publisher: input.publisher ?? null
		}
	});

	return {
		success: true as const,
		message: 'Successfully published theme!' as const
	};
}
