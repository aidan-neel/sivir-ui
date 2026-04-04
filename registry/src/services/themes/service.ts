import { status } from 'elysia';
import { prisma } from '@lib/prisma';
import type { ThemesModel } from './model';

export abstract class Themes {
	static async getAll() {
		return await prisma.theme.findMany();
	}

	static async getBySlug(body: ThemesModel['getBySlugBody']) {
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
