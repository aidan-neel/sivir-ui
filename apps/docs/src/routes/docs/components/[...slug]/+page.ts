import { redirect } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';

const markdownFiles = import.meta.glob('/src/lib/content/*.svx');

type Dependency = {
	name: string;
	url: string;
};

interface Component {
	default: string;
	metadata: {
		title: string;
		description?: string;
		component?: boolean;
		source?: string;
		dependencies?: Dependency[];
	};
}

export const load: PageLoad = async (event) => {
	if (event.params.slug === 'components') {
		redirect(303, '/docs/components/alert');
	}

	const filePath = `/src/lib/content/${event.params.slug}.svx`;

	if (!(filePath in markdownFiles)) {
		throw new Error('Content not found');
	}

	const component: Component = (await markdownFiles[filePath]()) as Component;
	return { content: component.default, metadata: component.metadata };
};

export const entries: EntryGenerator = () => {
	console.info('Prerendering /docs');
	const modules = import.meta.glob('/src/lib/content/*.svx');
	const entries = [];

	for (const path of Object.keys(modules)) {
		const slug = path.replace('/src/lib/content/', '').replace('.svx', '').replace('/index', '');

		entries.push({ slug });
	}

	return entries;
};
