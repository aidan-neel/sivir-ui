export const components = [
	'alert',
	'alert-dialog',
	'badge',
	'breadcrumb',
	'button',
	'card',
	'checkbox',
	'color-picker',
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
	'tabs',
	'textarea',
	'toast',
	'tooltip'
].sort((a, b) => a.localeCompare(b));

export const sanitizeComponent = (name: string) => {
	return name
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};
