import { Elysia } from 'elysia';
import { ThemesModel } from './model';
import { Themes } from './service';

export const themes = new Elysia({ prefix: '/themes' }).post(
	'/publish',
	async ({ body, cookie: { session } }) => {
		const res = await Themes.publish(body);
		return res;
	},
	{
		body: ThemesModel.publishBody,
		response: {
			200: ThemesModel.publishResponse,
			409: ThemesModel.nameTaken
		}
	}
);
