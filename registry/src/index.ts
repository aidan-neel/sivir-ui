import { Elysia } from 'elysia';
import { openapi, fromTypes } from '@elysiajs/openapi';

import { themes } from './services/themes';

const app = new Elysia()
	.use(
		openapi({
			references: fromTypes(),
			path: '/openapi'
		})
	)
	.use(themes)
	.get('/', () => 'Hello Elysia')
	.listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
