export const components = [
	'button',
	'alert-dialog',
	'toast',
	'popover',
	'alert',
	'badge',
	'card',
	'input',
	'checkbox'
].sort((a, b) => a.localeCompare(b));

export const sanitizeComponent = (name: string) => {
	return name
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};
