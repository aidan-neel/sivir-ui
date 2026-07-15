import { Elysia } from 'elysia';
import {
	publishRateLimitSchema,
	publishResponseSchema,
	slugConflictSchema,
	slugParamsSchema,
	themeSchema,
	themeListSchema,
	themeNotFoundSchema,
	themeRecordSchema
} from './model';
import { getThemeBySlug, listThemes, publishTheme } from './service';

const PUBLISH_LIMIT = 5;
const PUBLISH_WINDOW_MS = 10 * 60 * 1000;
const MAX_TRACKED_CLIENTS = 10_000;
const publishWindows = new Map<string, { count: number; resetAt: number }>();

function consumePublishAttempt(client: string, now = Date.now()): boolean {
	let current = publishWindows.get(client);
	if (!current || current.resetAt <= now) {
		if (publishWindows.size >= MAX_TRACKED_CLIENTS) {
			for (const [key, window] of publishWindows) {
				if (window.resetAt <= now) publishWindows.delete(key);
			}
			if (publishWindows.size >= MAX_TRACKED_CLIENTS) return false;
		}
		current = { count: 0, resetAt: now + PUBLISH_WINDOW_MS };
		publishWindows.set(client, current);
	}
	if (current.count >= PUBLISH_LIMIT) return false;
	current.count += 1;
	return true;
}

/** Test isolation for the in-memory, per-process publish limiter. */
export function resetPublishRateLimitForTests() {
	publishWindows.clear();
}

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
	.post(
		'/',
		({ body, request, server, status }) => {
			// This is deliberately per-instance and resets on restart. A multi-instance
			// deployment should replace it with a shared rate-limit store.
			const client = server?.requestIP(request)?.address ?? 'unknown';
			if (!consumePublishAttempt(client)) {
				return status(429, 'Too many publishes, try again later.' as const);
			}
			return publishTheme(body);
		},
		{
			body: themeSchema,
			detail: { summary: 'Publish a new theme to the registry.' },
			response: {
				200: publishResponseSchema,
				409: slugConflictSchema,
				429: publishRateLimitSchema
			}
		}
	);
