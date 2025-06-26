import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST({ request }) {
	const body = await request.json();
	if (!body.name || !body.css) {
		return json({ error: 'invalid body' }, { status: 400 });
	}

	try {
		await prisma.theme.create({
			data: {
				name: body.name,
				css: body.css
			}
		});
		return json({ message: 'theme saved' });
	} catch (err) {
		return json({ error: 'db error' }, { status: 500 });
	}
}
