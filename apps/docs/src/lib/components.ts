export const components = [
	'accordion',
	'alert',
	'alert-dialog',
	'avatar',
	'badge',
	'breadcrumb',
	'button',
	'card',
	'checkbox',
	'code-block',
	'collapsible',
	'color-picker',
	'combobox',
	'command',
	'copy-button',
	'context-menu',
	'dropdown-menu',
	'hover-card',
	'input',
	'label',
	'marquee',
	'modal',
	'pagination',
	'popover',
	'progress',
	'radio-group',
	'scroll-area',
	'select',
	'separator',
	'sheet',
	'shortcut',
	'skeleton',
	'slider',
	'switch',
	'tabs',
	'textarea',
	'toast',
	'toggle',
	'toggle-group',
	'tooltip'
].sort((a, b) => a.localeCompare(b));

export const sanitizeComponent = (name: string) => {
	return name
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};
