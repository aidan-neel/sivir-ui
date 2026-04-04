import { Elysia } from 'elysia';
import { ThemesModel } from './model';
import { Themes } from './service';

export const themesController = new Elysia({ prefix: '/themes' });

/* Create a theme and save to database. */
themesController.post(
	'/',
	async ({ body }) => {
		const res = await Themes.publish(body);
		return res;
	},
	{
		body: ThemesModel.publishBody,
		response: {
			200: ThemesModel.publishResponse,
			409: ThemesModel.slugTaken
		}
	}
);

/* Fetch all themes. */
themesController.get('/', async () => {
	return await Themes.getAll();
});

/* Fetch theme by slug. */
themesController.get(
	'/:slug',
	async ({ params }) => {
		const res = await Themes.getBySlug(params);
		return res;
	},
	{
		params: ThemesModel.getBySlugBody,
		response: {
			200: ThemesModel.getBySlugResponse,
			404: ThemesModel.doesntExist
		}
	}
);
