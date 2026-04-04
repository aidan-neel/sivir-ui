import { Elysia } from 'elysia';
import { openapi, fromTypes } from '@elysiajs/openapi';

import { themesController } from './services/themes';

const app = new Elysia()
	.use(
		openapi({
			path: '/openapi'
		})
	)
	.use(themesController)
	.get('/', () => 'Hello Elysia')
	.listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
