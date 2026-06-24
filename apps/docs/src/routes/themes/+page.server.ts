import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Themes gallery is disabled for now. Block direct access until it's reworked.
export const load: PageServerLoad = async () => {
	error(404, 'Not Found');
};
