import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET({ params }) {
	const { name } = params;

	try {
		const theme = await prisma.theme.findUnique({
			where: { name }
		});

		if (!theme) {
			return json({ error: 'theme not found' }, { status: 404 });
		}

		return json(theme);
	} catch (err) {
		return json({ error: 'db error' }, { status: 500 });
	}
}
