import { error } from '@sveltejs/kit';
import { dev } from '$app/env';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = () => {
    if (!dev) {
        error(404, 'Not found');
    }
};
