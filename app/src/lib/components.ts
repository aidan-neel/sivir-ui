export const components = [
	'alert',
	'alert-dialog',
	'badge',
	'breadcrumb',
	'button',
	'card',
	'checkbox',
	'combobox',
	'command',
	'context-menu',
	'dialog',
	'dropdown-menu',
	'input',
	'popover',
	'select',
	'sheet',
	'shortcut',
	'skeleton',
	'switch',
	'textarea',
	'toast',
	'tooltip',
].sort((a, b) => a.localeCompare(b));

export const sanitizeComponent = (name: string) => {
	return name
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};
