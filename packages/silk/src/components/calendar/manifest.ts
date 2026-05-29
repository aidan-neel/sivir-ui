import type { Manifest } from '@silk/ui/_manifest/types';

/**
 * Calendar.
 *
 * 1.0.0 -- initial. No keyboard navigation.
 * 2.0.0: WAI-ARIA grid keyboard pattern. Arrow keys move focus one day;
 *        ArrowUp/Down by week; Home/End to start/end of week;
 *        PageUp/PageDown by month; Shift+PageUp/Down by year. Roving
 *        tabindex via `focusedDate`.
 */
export const manifest: Manifest = {
	name: 'calendar',
	version: '2.0.0',
	visibility: 'public',
	description:
		'Date-picker grid with WAI-ARIA grid keyboard navigation. value bindable, min/max bounds, weekStartsOn config.',
	role: 'grid',
	files: [
		'components/calendar/calendar.svelte',
		'components/calendar/index.ts',
		'components/calendar/manifest.ts'
	],
	components: [],
	shared: ['utils.cn'],
	peerDependencies: {
		'@lucide/svelte': '^1.0.0',
		clsx: '^2.0.0',
		'tailwind-merge': '^3.0.0',
		svelte: '^5.0.0'
	}
};
