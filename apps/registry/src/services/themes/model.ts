import { t, type Static } from 'elysia';

export const themeSchema = t.Object({
	version: t.Literal(2),
	slug: t.String({ minLength: 1, pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' }),
	name: t.String({ minLength: 1 }),
	description: t.String(),
	publisher: t.Optional(t.String()),
	brand: t.String({ pattern: '^#[0-9a-fA-F]{6}$' }),
	neutral: t.Union([t.Literal('cool'), t.Literal('true'), t.Literal('warm')]),
	radius: t.Union([t.Literal('sharp'), t.Literal('default'), t.Literal('rounded')]),
	density: t.Union([t.Literal('compact'), t.Literal('default'), t.Literal('comfortable')]),
	motion: t.Union([
		t.Literal('none'),
		t.Literal('subtle'),
		t.Literal('default'),
		t.Literal('expressive')
	]),
	fontSans: t.String({ minLength: 1 }),
	fontMono: t.String({ minLength: 1 }),
	fontHeader: t.String({ minLength: 1 })
});

export const themeRecordSchema = t.Intersect([
	themeSchema,
	t.Object({
		id: t.String(),
		createdAt: t.String(),
		updatedAt: t.String()
	})
]);

export const themeListSchema = t.Array(themeRecordSchema);

export const slugParamsSchema = t.Object({
	slug: t.String({ minLength: 1 })
});

export const publishResponseSchema = t.Object({
	success: t.Literal(true),
	message: t.Literal('Successfully published theme!')
});

export const slugConflictSchema = t.Union([
	t.Literal('A theme with this slug already exists, try another one.'),
	t.Literal('This slug is reserved for a built-in theme.')
]);
export const themeNotFoundSchema = t.Literal('A theme with this slug does not exist.');

export type Theme = Static<typeof themeSchema>;
export type ThemeRecord = Static<typeof themeRecordSchema>;
