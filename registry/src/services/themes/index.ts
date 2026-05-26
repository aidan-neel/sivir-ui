import { Elysia } from 'elysia';
import {
	publishResponseSchema,
	slugConflictSchema,
	slugParamsSchema,
	themeDraftSchema,
	themeListSchema,
	themeNotFoundSchema,
	themeRecordSchema
} from './model';
import { getThemeBySlug, listThemes, publishTheme } from './service';

export const themesController = new Elysia({
	prefix: '/themes',
	tags: ['themes']
})
	.get('/', () => listThemes(), {
		detail: { summary: 'List every built-in and published theme.' },
		response: { 200: themeListSchema }
	})
	.get('/:slug', ({ params }) => getThemeBySlug(params.slug), {
		params: slugParamsSchema,
		detail: { summary: 'Fetch a theme by its slug.' },
		response: {
			200: themeRecordSchema,
			404: themeNotFoundSchema
		}
	})
	.post('/', ({ body }) => publishTheme(body), {
		body: themeDraftSchema,
		detail: { summary: 'Publish a new theme to the registry.' },
		response: {
			200: publishResponseSchema,
			409: slugConflictSchema
		}
	});
