import { status } from 'elysia';
import { prisma } from '@lib/prisma';
import type { ThemesModel } from './model';
import { defaultThemes } from './defaults';

const DEFAULT_THEME_IDS = new Map(defaultThemes.map((theme) => [theme.slug, `default:${theme.slug}`]));
const DEFAULT_THEME_CREATED_AT = '2026-04-04T00:00:00.000Z';

function toDefaultThemeRecord(theme: ThemesModel['publishBody']) {
	return {
		id: DEFAULT_THEME_IDS.get(theme.slug) ?? `default:${theme.slug}`,
		...theme,
		createdAt: DEFAULT_THEME_CREATED_AT,
		updatedAt: DEFAULT_THEME_CREATED_AT
	};
}

export abstract class Themes {
	static async getAll() {
		const themes = await prisma.theme.findMany({
			orderBy: {
				name: 'asc'
			}
		});

		const publishedThemeSlugs = new Set(themes.map((theme) => theme.slug));
		const attachedDefaults = defaultThemes
			.filter((theme) => !publishedThemeSlugs.has(theme.slug))
			.map(toDefaultThemeRecord);

		return [...attachedDefaults, ...themes].sort((a, b) => a.name.localeCompare(b.name));
	}

	static async getBySlug(body: ThemesModel['getBySlugBody']) {
		const defaultTheme = defaultThemes.find((theme) => theme.slug === body.slug);
		if (defaultTheme) {
			return toDefaultThemeRecord(defaultTheme);
		}

		const theme = await prisma.theme.findUnique({
			where: { slug: body.slug }
		});

		if (!theme)
			throw status(
				404,
				'A theme with this slug does not exist.' satisfies ThemesModel['doesntExist']
			);

		return theme;
	}

	static async publish(body: ThemesModel['publishBody']) {
		const existingTheme = await prisma.theme.findUnique({
			where: {
				slug: body.slug
			},
			select: {
				id: true
			}
		});

		if (existingTheme)
			throw status(
				409,
				'A theme with this slug already exists, try another one.' satisfies ThemesModel['slugTaken']
			);

		await prisma.theme.create({
			data: {
				slug: body.slug,
				name: body.name,
				description: body.description,
				publisher: body.publisher,
				fontSans: body.fontSans,
				fontMono: body.fontMono,
				fontHeader: body.fontHeader,
				radiusBase: body.radiusBase,
				radiusSm: body.radiusSm,
				radiusMd: body.radiusMd,
				radiusLg: body.radiusLg,
				radiusXl: body.radiusXl,
				primaryButtonOutline: body.primaryButtonOutline,
				invertedPanels: body.invertedPanels,
				durationPreset: body.durationPreset,
				motion: body.motion,
				light: body.light,
				dark: body.dark
			}
		});

		return {
			success: true,
			message: 'Successfully published theme!' as const
		};
	}
}
