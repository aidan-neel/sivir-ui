import type { ThemeSpacing } from '@sivir/ui/themes/presets';

/** A labelled, range-bounded control for a single spacing token. */
export type SpacingField = {
	key: keyof ThemeSpacing;
	label: string;
	min: number;
	max: number;
	unit?: string;
};

/** A titled group of spacing controls, rendered as one section in the Padding tab. */
export type SpacingFieldGroup = {
	title: string;
	fields: SpacingField[];
};

/**
 * Single source of truth for the Studio's spacing controls. The set of keys here
 * must exactly equal `Object.keys(defaultSpacing)` — every editable spacing token
 * gets a control (no orphan token), and every control maps to a real token (no
 * dead control). `studio-spacing-fields.test.ts` enforces this invariant.
 */
export const spacingGroups: SpacingFieldGroup[] = [
	{
		title: 'Heights',
		fields: [
			{ key: 'buttonHeight', label: 'Button (default)', min: 24, max: 56 },
			{ key: 'buttonHeightSm', label: 'Button (small)', min: 20, max: 44 },
			{ key: 'buttonHeightLg', label: 'Button (large)', min: 28, max: 64 },
			{ key: 'fieldHeight', label: 'Input field', min: 24, max: 56 },
			{ key: 'menuItemHeight', label: 'Menu / select item', min: 20, max: 48 },
			{ key: 'iconButtonSize', label: 'Icon button', min: 20, max: 48 },
			{ key: 'textareaMinHeight', label: 'Textarea (min)', min: 48, max: 240 }
		]
	},
	{
		title: 'Switch',
		fields: [
			{ key: 'switchTrackWidth', label: 'Track width', min: 24, max: 64 },
			{ key: 'switchThumbSize', label: 'Thumb', min: 8, max: 28 },
			{ key: 'switchTrackPadding', label: 'Track padding', min: 0, max: 8 }
		]
	},
	{
		title: 'Button & field padding',
		fields: [
			{ key: 'buttonPaddingX', label: 'Button (X)', min: 4, max: 32 },
			{ key: 'buttonGap', label: 'Button icon gap', min: 0, max: 24 },
			{ key: 'fieldPaddingX', label: 'Field (X)', min: 4, max: 24 },
			{ key: 'fieldPaddingY', label: 'Field (Y)', min: 0, max: 20 },
			{ key: 'textareaPaddingY', label: 'Textarea (Y)', min: 0, max: 24 },
			{ key: 'badgePaddingX', label: 'Badge (X)', min: 2, max: 20 },
			{ key: 'badgePaddingY', label: 'Badge (Y)', min: 0, max: 12 }
		]
	},
	{
		title: 'Surface padding',
		fields: [
			{ key: 'cardPadding', label: 'Card', min: 8, max: 48 },
			{ key: 'panelPadding', label: 'Panel', min: 4, max: 24 }
		]
	},
	{
		title: 'Modal & overlay',
		fields: [
			{ key: 'modalPadding', label: 'Modal padding', min: 0, max: 48 },
			{ key: 'modalTitleDescriptionGap', label: 'Title ↔ description', min: 0, max: 24 },
			{ key: 'modalSectionGap', label: 'Section gap', min: 0, max: 32 },
			{ key: 'sheetBodyPadding', label: 'Sheet padding', min: 0, max: 48 },
			{ key: 'sheetHeaderPaddingBottom', label: 'Sheet header (bottom)', min: 0, max: 48 }
		]
	},
	{
		title: 'Menu padding',
		fields: [
			{ key: 'menuPadding', label: 'Menu surface', min: 0, max: 16 },
			{ key: 'menuItemPaddingX', label: 'Menu item (X)', min: 2, max: 16 },
			{ key: 'menuLabelPaddingX', label: 'Menu label (X)', min: 0, max: 16 },
			{ key: 'menuLabelPaddingY', label: 'Menu label (Y)', min: 0, max: 12 }
		]
	},
	{
		title: 'Tabs padding',
		fields: [
			{ key: 'tabsTriggerPaddingX', label: 'Trigger (X)', min: 4, max: 32 },
			{ key: 'tabsTriggerPaddingY', label: 'Trigger (Y)', min: 0, max: 16 },
			{ key: 'tabsListPadding', label: 'List padding', min: 0, max: 12 }
		]
	},
	{
		title: 'Toggle padding',
		fields: [
			{ key: 'togglePaddingSm', label: 'Toggle (small)', min: 0, max: 20 },
			{ key: 'togglePaddingMd', label: 'Toggle (default)', min: 0, max: 24 },
			{ key: 'togglePaddingLg', label: 'Toggle (large)', min: 0, max: 32 }
		]
	},
	{
		title: 'Component padding',
		fields: [
			{ key: 'toastPaddingX', label: 'Toast (X)', min: 4, max: 32 },
			{ key: 'toastPaddingY', label: 'Toast (Y)', min: 4, max: 32 },
			{ key: 'colorPickerPadding', label: 'Color picker', min: 0, max: 24 }
		]
	}
];
