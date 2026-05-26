import { Elysia } from 'elysia';
import { openapi } from '@elysiajs/openapi';

import { themesController } from './services/themes';

const port = Number(process.env.PORT ?? 4100);

const app = new Elysia()
	.use(
		openapi({
			path: '/openapi'
		})
	)
	.use(themesController)
	.get('/', () => 'Hello Elysia')
	.listen(port);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
