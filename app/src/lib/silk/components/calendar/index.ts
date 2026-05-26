import type { DefaultProps } from '$lib/silk/utils';
import Calendar from './calendar.svelte';

export type CalendarProps = {
	value?: Date;
	min?: Date;
	max?: Date;
	weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
	onValueChange?: (date: Date) => void;
} & DefaultProps;

export { Calendar };
export default Calendar;
