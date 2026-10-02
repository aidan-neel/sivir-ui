import type { components } from './components';

export type ComponentSlug = (typeof components)[number];

export type ComponentPart = {
    name: string;
    description: string;
};

export const componentAnatomy = {
    accordion: [
        { name: 'Accordion.Root', description: 'Groups collapsible sections.' },
        { name: 'Accordion.Item', description: 'Defines a collapsible section.' },
        { name: 'Accordion.Trigger', description: 'Toggles its item.' },
        { name: 'Accordion.Content', description: "Contains an item's collapsible content." }
    ],
    alert: [
        { name: 'Alert.Root', description: 'Provides the alert container.' },
        { name: 'Alert.Title', description: 'Renders the alert heading.' },
        { name: 'Alert.Description', description: 'Renders the alert details.' }
    ],
    'alert-dialog': [
        { name: 'AlertDialog.Root', description: 'Controls alert dialog state.' },
        { name: 'AlertDialog.Trigger', description: 'Opens the alert dialog.' },
        { name: 'AlertDialog.Content', description: 'Renders the dialog surface.' },
        { name: 'AlertDialog.Header', description: 'Groups dialog heading content.' },
        { name: 'AlertDialog.Title', description: 'Renders the dialog title.' },
        { name: 'AlertDialog.Description', description: 'Renders the dialog description.' },
        { name: 'AlertDialog.Exit', description: 'Closes the dialog without confirming.' },
        { name: 'AlertDialog.Footer', description: 'Groups dialog actions.' },
        { name: 'AlertDialog.Confirm', description: 'Confirms and closes the dialog.' }
    ],
    attachment: [
        {
            name: 'Attachment.Root',
            description: 'Manages selected files and accepts drops and pastes.'
        },
        { name: 'Attachment.Trigger', description: 'Opens the file picker.' },
        { name: 'Attachment.List', description: 'Lists selected files.' },
        { name: 'Attachment.Item', description: 'Holds one file and its upload state.' },
        { name: 'Attachment.Preview', description: 'Shows an image thumbnail or file icon.' },
        { name: 'Attachment.Name', description: 'Shows the file name.' },
        { name: 'Attachment.Status', description: 'Shows size, progress, or the outcome.' },
        { name: 'Attachment.Remove', description: 'Removes the file.' }
    ],
    avatar: [
        { name: 'Avatar.Root', description: 'Sets the size and shape.' },
        { name: 'Avatar.Image', description: 'Renders the image and reports when it loads.' },
        {
            name: 'Avatar.Fallback',
            description: 'Shows until the image loads, or stays if it fails.'
        }
    ],
    badge: [{ name: 'Badge', description: 'Renders a short label, or a link when given href.' }],
    breadcrumb: [
        { name: 'Breadcrumb.Root', description: 'Lays out items and separators in a row.' },
        {
            name: 'Breadcrumb.Item',
            description: 'Renders a link, styled as current when it matches the path.'
        },
        {
            name: 'Breadcrumb.Separator',
            description: 'Renders a chevron, or your own separator content.'
        }
    ],
    button: [{ name: 'Button', description: 'Triggers an action or navigation.' }],
    card: [
        { name: 'Card.Root', description: 'Renders the surface and sets its variant.' },
        { name: 'Card.Header', description: 'Groups the title and description.' },
        { name: 'Card.Title', description: 'Renders the card heading.' },
        { name: 'Card.Description', description: 'Renders muted text under the title.' },
        { name: 'Card.Content', description: 'Renders the card body.' },
        {
            name: 'Card.Footer',
            description:
                'Aligns actions to the end; in the inset variant, renders below the surface.'
        }
    ],
    checkbox: [{ name: 'Checkbox', description: 'Selects or clears a boolean value.' }],
    'code-block': [
        { name: 'CodeBlock.Root', description: 'Provides code block state and layout.' },
        { name: 'CodeBlock.Header', description: 'Renders the code block header.' },
        { name: 'CodeBlock.List', description: 'Groups code language tabs.' },
        { name: 'CodeBlock.Trigger', description: 'Selects a code language tab.' },
        { name: 'CodeBlock.Actions', description: 'Groups code block actions.' },
        { name: 'CodeBlock.Copy', description: 'Copies the active code snippet.' },
        { name: 'CodeBlock.Content', description: 'Renders a code snippet panel.' },
        { name: 'CodeBlock', description: 'Renders a high-level code block.' }
    ],
    collapsible: [
        { name: 'Collapsible.Root', description: 'Controls collapsible content state.' },
        { name: 'Collapsible.Trigger', description: 'Toggles the content.' },
        { name: 'Collapsible.Content', description: 'Contains collapsible content.' }
    ],
    'color-picker': [
        { name: 'ColorPicker.Root', description: 'Controls color picker state.' },
        { name: 'ColorPicker.Trigger', description: 'Opens the color picker.' },
        { name: 'ColorPicker.Content', description: 'Renders color selection controls.' }
    ],
    combobox: [
        { name: 'Combobox.Root', description: 'Holds the selected value and open state.' },
        {
            name: 'Combobox.Content',
            description: 'Renders the menu and, optionally, its search field.'
        },
        { name: 'Combobox.Trigger', description: 'Shows the selection and takes the search text.' },
        { name: 'Combobox.Results', description: 'Lists matching items.' },
        { name: 'Combobox.Item', description: 'Defines a selectable item.' },
        { name: 'Combobox.Label', description: 'Labels a group of items in the menu.' }
    ],
    command: [
        { name: 'Command.Root', description: 'Provides command menu state.' },
        { name: 'Command.Content', description: 'Contains command menu controls.' },
        { name: 'Command.Trigger', description: 'Opens the command menu.' },
        { name: 'Command.Separator', description: 'Separates command menu items.' },
        { name: 'Command.Results', description: 'Lists matching commands.' },
        { name: 'Command.Search', description: 'Filters command items.' },
        { name: 'Command.Item', description: 'Defines a command action.' },
        { name: 'Command.Group', description: 'Groups command items.' },
        {
            name: 'Command.Header',
            description: 'Renders a row in the modal frame above the palette.'
        },
        {
            name: 'Command.Footer',
            description: 'Renders a row in the modal frame below the results.'
        }
    ],
    'context-menu': [
        { name: 'ContextMenu.Root', description: 'Provides context menu state.' },
        { name: 'ContextMenu.Trigger', description: 'Wraps the area that opens the menu.' },
        { name: 'ContextMenu.Content', description: 'Renders the menu surface.' },
        { name: 'ContextMenu.Item', description: 'Renders a menu action.' },
        { name: 'ContextMenu.CheckboxItem', description: 'Renders a checkable menu item.' },
        { name: 'ContextMenu.Separator', description: 'Separates menu items.' },
        { name: 'ContextMenu.Sub', description: 'Provides submenu state.' },
        { name: 'ContextMenu.SubTrigger', description: 'Opens a submenu.' },
        { name: 'ContextMenu.SubContent', description: 'Renders a submenu surface.' }
    ],
    conversation: [
        { name: 'Conversation.Root', description: 'Follows new output until the user scrolls up.' },
        { name: 'Conversation.Content', description: 'Scrolls the list of messages.' },
        {
            name: 'Conversation.Empty',
            description: 'Shows a title and prompt before any messages.'
        },
        { name: 'Conversation.ScrollButton', description: 'Scrolls to the latest message.' }
    ],
    'copy-button': [{ name: 'CopyButton', description: 'Copies text to the clipboard.' }],
    'dropdown-menu': [
        { name: 'DropdownMenu.Root', description: 'Provides dropdown menu state.' },
        { name: 'DropdownMenu.Trigger', description: 'Opens the dropdown menu.' },
        { name: 'DropdownMenu.Content', description: 'Renders the menu surface.' },
        { name: 'DropdownMenu.Label', description: 'Labels a menu section.' },
        { name: 'DropdownMenu.Item', description: 'Renders a menu action.' },
        { name: 'DropdownMenu.CheckboxItem', description: 'Renders a checkable menu item.' },
        { name: 'DropdownMenu.RadioGroup', description: 'Manages a single-selection group.' },
        { name: 'DropdownMenu.RadioItem', description: 'Renders a radio option.' },
        { name: 'DropdownMenu.Separator', description: 'Separates menu items.' },
        { name: 'DropdownMenu.Sub', description: 'Provides submenu state.' },
        { name: 'DropdownMenu.SubTrigger', description: 'Opens a submenu.' },
        { name: 'DropdownMenu.SubContent', description: 'Renders a submenu surface.' }
    ],
    'file-diff': [
        {
            name: 'FileDiff.Root',
            description: 'Holds the file, language, and counts; renders everything when given diff.'
        },
        {
            name: 'FileDiff.TopBar',
            description: 'Renders the file path and counts, or your own children.'
        },
        { name: 'FileDiff.Filename', description: 'Renders the file path.' },
        { name: 'FileDiff.PlusMinus', description: 'Renders the addition and deletion counts.' },
        { name: 'FileDiff.Content', description: 'Contains the scrollable diff rows.' },
        { name: 'FileDiff.Row', description: 'Renders one highlighted diff row.' },
        { name: 'FileDiff.LineNumber', description: 'Renders one gutter line number.' }
    ],
    'fullscreen-nav': [
        { name: 'FullscreenNav.Root', description: 'Controls fullscreen navigation state.' },
        { name: 'FullscreenNav.Trigger', description: 'Opens fullscreen navigation.' },
        { name: 'FullscreenNav.Content', description: 'Renders navigation content.' },
        { name: 'FullscreenNav.Close', description: 'Closes fullscreen navigation.' },
        { name: 'FullscreenNav.Group', description: 'Groups navigation links.' },
        { name: 'FullscreenNav.Link', description: 'Renders a navigation link.' }
    ],
    gauge: [{ name: 'Gauge', description: 'Displays a value as a filled arc.' }],
    'hover-card': [
        { name: 'HoverCard.Root', description: 'Controls hover card state.' },
        { name: 'HoverCard.Trigger', description: 'Opens the hover card.' },
        { name: 'HoverCard.Content', description: 'Renders hover card content.' },
        { name: 'HoverCard.Title', description: 'Renders the hover card title.' },
        { name: 'HoverCard.Description', description: 'Renders the hover card description.' }
    ],
    input: [{ name: 'Input', description: 'Accepts a single-line value.' }],
    label: [{ name: 'Label', description: 'Labels a form control.' }],
    markdown: [{ name: 'Markdown', description: 'Renders GitHub-flavored Markdown.' }],
    message: [
        { name: 'Message.Root', description: 'Aligns and styles one message by sender.' },
        {
            name: 'Message.Content',
            description: 'Holds the message text, as a bubble for the user.'
        },
        { name: 'Message.Actions', description: 'Holds buttons such as copy, shown on hover.' }
    ],
    modal: [
        { name: 'Modal.Root', description: 'Controls modal state.' },
        { name: 'Modal.Trigger', description: 'Opens the modal.' },
        { name: 'Modal.Content', description: 'Renders the modal surface.' },
        { name: 'Modal.Header', description: 'Groups modal heading content.' },
        { name: 'Modal.Title', description: 'Renders the modal title.' },
        { name: 'Modal.Description', description: 'Renders the modal description.' },
        { name: 'Modal.Body', description: 'Renders the modal body.' },
        { name: 'Modal.Footer', description: 'Groups modal actions.' },
        { name: 'Modal.Close', description: 'Closes the modal.' },
        { name: 'Modal.Confirm', description: 'Confirms and closes the modal.' }
    ],
    pagination: [{ name: 'Pagination', description: 'Navigates paginated content.' }],
    popover: [
        { name: 'Popover.Root', description: 'Controls popover state.' },
        { name: 'Popover.Trigger', description: 'Opens the popover.' },
        { name: 'Popover.Content', description: 'Renders the popover surface.' },
        { name: 'Popover.Title', description: 'Renders the popover title.' }
    ],
    progress: [{ name: 'Progress', description: 'Fills to value out of max, or loops.' }],
    composer: [
        { name: 'Composer.Root', description: 'Submits the prompt and tracks its status.' },
        { name: 'Composer.Input', description: 'Grows with the prompt text.' },
        { name: 'Composer.Toolbar', description: 'Holds the actions and submit button.' },
        {
            name: 'Composer.Actions',
            description: 'Holds controls such as attach or model pickers.'
        },
        { name: 'Composer.Submit', description: 'Sends, queues, or stops the prompt.' }
    ],
    question: [
        { name: 'Question.Root', description: 'Holds the answer and validates it on submit.' },
        {
            name: 'Question.Content',
            description: 'Groups the question and animates between steps.'
        },
        { name: 'Question.Title', description: 'Shows the question.' },
        { name: 'Question.Description', description: 'Adds context below the question.' },
        { name: 'Question.Options', description: 'Lists the answer choices.' },
        { name: 'Question.Option', description: 'One choice, with an optional description.' },
        { name: 'Question.Input', description: 'Collects a written answer.' },
        { name: 'Question.Actions', description: 'Holds the cancel and submit buttons.' },
        { name: 'Question.Cancel', description: 'Calls onCancel.' },
        { name: 'Question.Submit', description: 'Submits the answer.' }
    ],
    'radio-group': [
        { name: 'RadioGroup.Root', description: 'Manages a single selection.' },
        { name: 'RadioGroup.Item', description: 'Defines a radio option.' }
    ],
    reasoning: [
        { name: 'Reasoning.Root', description: 'Holds the open and streaming state.' },
        {
            name: 'Reasoning.Trigger',
            description: 'Shows Thinking or the duration and toggles the trace.'
        },
        { name: 'Reasoning.Content', description: 'Holds the reasoning trace.' }
    ],
    'response-stream': [
        {
            name: 'ResponseStream',
            description:
                'Reveals response text at a steady pace, with a dot indicator before the first chunk.'
        }
    ],
    'reorder-list': [
        {
            name: 'ReorderList',
            description: 'Reorders controlled items with pointer or keyboard input.'
        }
    ],
    'scroll-area': [{ name: 'ScrollArea', description: 'Provides a scrollable content area.' }],
    'show-more': [
        { name: 'ShowMore', description: 'Clamps long content and expands it on demand.' }
    ],
    select: [
        { name: 'Select.Root', description: 'Provides select state.' },
        { name: 'Select.Trigger', description: 'Opens the select menu.' },
        { name: 'Select.Value', description: 'Displays the selected value.' },
        { name: 'Select.Label', description: 'Labels a select section.' },
        { name: 'Select.Item', description: 'Defines a selectable option.' },
        { name: 'Select.Content', description: 'Renders select options.' }
    ],
    sheet: [
        { name: 'Sheet.Root', description: 'Controls sheet state.' },
        { name: 'Sheet.Trigger', description: 'Opens the sheet.' },
        { name: 'Sheet.Content', description: 'Renders the sheet surface.' },
        {
            name: 'Sheet.Header',
            description: 'Groups the title and description, and renders a close button.'
        },
        { name: 'Sheet.Title', description: 'Renders the sheet title.' },
        { name: 'Sheet.Description', description: 'Renders the sheet description.' },
        { name: 'Sheet.Footer', description: 'Groups sheet actions.' },
        { name: 'Sheet.Close', description: 'Closes the sheet.' }
    ],
    shortcut: [
        {
            name: 'Shortcut',
            description: 'Displays a keyboard shortcut and clicks its owner when pressed.'
        }
    ],
    skeleton: [
        { name: 'Skeleton', description: 'Displays a static loading placeholder.' },
        {
            name: 'SkeletonSwap',
            description: 'Shows a delayed placeholder in a fixed-height box until ready.'
        }
    ],
    slider: [
        { name: 'Slider.Root', description: 'Scrubs a labeled value by dragging the field.' },
        { name: 'Slider.Range', description: 'Fills the field up to the value.' },
        { name: 'Slider.Thumb', description: 'Marks the value edge and reacts to press.' },
        { name: 'Slider.Label', description: 'Names the value inside the field.' },
        { name: 'Slider.Value', description: 'Shows the formatted value.' }
    ],
    spinner: [{ name: 'Spinner', description: 'Spins while loading and resolves to a checkmark.' }],
    switch: [{ name: 'Switch', description: 'Toggles a boolean value.' }],
    'task-steps': [
        { name: 'TaskSteps', description: 'Lists steps as pending, running, done, or failed.' }
    ],
    tabs: [
        { name: 'Tabs.Root', description: 'Manages active tab state.' },
        { name: 'Tabs.List', description: 'Groups tab triggers.' },
        { name: 'Tabs.Trigger', description: 'Selects a tab panel.' },
        { name: 'Tabs.Content', description: 'Renders a tab panel.' }
    ],
    'tag-input': [
        { name: 'TagInput.Root', description: 'Owns tags and draft entry state.' },
        { name: 'TagInput.List', description: 'Groups the entered tags.' },
        { name: 'TagInput.Tag', description: 'Renders one tag with its remove control.' },
        { name: 'TagInput.Input', description: 'Accepts new tag text.' }
    ],
    textarea: [{ name: 'Textarea', description: 'Accepts a multi-line value.' }],
    toast: [
        { name: 'Toast', description: 'Renders a single notification.' },
        {
            name: 'Toaster',
            description: 'Hosts the toast stack. Mount it once; toast() needs it.'
        }
    ],
    toggle: [{ name: 'Toggle', description: 'Toggles a pressed state.' }],
    'toggle-group': [
        { name: 'ToggleGroup.Root', description: 'Manages toggle group selection.' },
        { name: 'ToggleGroup.Item', description: 'Defines a toggle group option.' }
    ],
    tool: [
        { name: 'Tool.Root', description: 'Controls tool group visibility and state.' },
        { name: 'Tool.Trigger', description: 'Summarizes the group and toggles it.' },
        { name: 'Tool.Content', description: 'Aligns tool call rows behind a rail.' },
        { name: 'Tool.Call', description: 'Displays one tool call.' },
        { name: 'Tool.Input', description: 'Shows the arguments a call was made with.' },
        { name: 'Tool.Output', description: 'Shows what a call returned.' }
    ],
    toolbar: [{ name: 'Toolbar', description: 'Groups related controls.' }],
    tooltip: [
        { name: 'Tooltip.Root', description: 'Sets placement and open and close delays.' },
        { name: 'Tooltip.Trigger', description: 'Opens the tooltip on hover or focus.' },
        { name: 'Tooltip.Content', description: 'Supplies the tooltip text.' }
    ],
    typography: [
        {
            name: 'Typography.Title',
            description: 'Renders a component heading at the h1 to h6 level you pass.'
        },
        { name: 'Typography.H1', description: 'Renders the primary document heading.' },
        { name: 'Typography.H2', description: 'Renders a document section heading.' },
        { name: 'Typography.H3', description: 'Renders a document subsection heading.' },
        { name: 'Typography.H4', description: 'Renders a fourth-level document heading.' },
        { name: 'Typography.H5', description: 'Renders a subdued fifth-level heading.' },
        { name: 'Typography.H6', description: 'Renders a subdued sixth-level heading.' },
        { name: 'Typography.Text', description: 'Renders lead, body, or supporting prose.' },
        { name: 'Typography.InlineCode', description: 'Renders code within prose.' },
        { name: 'Typography.Description', description: 'Renders muted text under a Title.' },
        { name: 'Typography.Metadata', description: 'Renders small muted text in a span.' }
    ]
} satisfies Record<ComponentSlug, ComponentPart[]>;
