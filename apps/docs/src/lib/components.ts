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
	'context-menu',
	'copy-button',
	'dropdown-menu',
	'hover-card',
	'input',
	'label',
	'modal',
	'pagination',
	'popover',
	'progress',
	'radio-group',
	'scroll-area',
	'select',
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
] as const;

export const sanitizeComponent = (name: string) => {
	return name
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};
