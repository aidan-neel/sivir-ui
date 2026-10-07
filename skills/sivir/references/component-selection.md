# Sivir Component Selection

Use this guide to narrow candidates, then read each candidate's current Markdown page from `https://sivir.dev/llms.txt` before writing code.

## Choose by Job

| User need | Start with | Notes |
| --- | --- | --- |
| Trigger an action or navigate | Button | Pass `href` to render an `<a>`; omit it for a `<button>`. Icon-only buttons (`size="icon"`) need an `aria-label`. |
| Toggle one setting | Switch, Checkbox, or Toggle | Switch for an on/off setting that applies immediately, Checkbox for a form option, Toggle for a pressed tool or display mode. |
| Choose one visible option | Radio Group | Use when the reader benefits from seeing every choice in a small set. |
| Choose from a compact list | Select | Use for a bounded single-select list that does not need search. |
| Search and choose an option | Combobox | Use for larger or searchable option sets. |
| Run or discover commands | Command | Use for an application command palette, not form selection. |
| Show contextual actions | Dropdown Menu or Context Menu | Dropdown Menu has an explicit trigger. Context Menu opens on right-click, long-press, or Shift+F10; most users never find it, so expose the same actions elsewhere. |
| Collect short or long text | Input or Textarea | Use the `label` and `description` props instead of a separate Label. |
| Enter several values | Tag Input | Turns typed or pasted values into removable tags. |
| Pick a number in a range | Slider | Has a bindable `value` with `min`, `max`, and `step`. |
| Confirm a consequential action | Alert Dialog | Use Modal for general tasks. Reserve Alert Dialog for decisions that must interrupt and need explicit confirmation. |
| Complete a focused task in place | Modal | Use Sheet when keeping more of the page visible matters. |
| Show anchored supplemental UI | Popover, Hover Card, or Tooltip | Popover is interactive. Hover Card previews information and must not hold essential actions. Tooltip labels a control in a short phrase. |
| Communicate persistent inline state | Alert | Keep it next to the content or action it qualifies. |
| Confirm a transient action | Toast | Do not use a toast for errors or decisions that require immediate action. |
| Show determinate work | Progress or Task Steps | Progress shows how much is done. Task Steps names ordered stages and the current or failed one. |
| Show a bounded quantity | Gauge | A compact meter for values such as context remaining, usage limits, or storage. |
| Show indeterminate work | Spinner, Skeleton, or Progress | Spinner marks compact activity, Skeleton reserves the shape of incoming content, and Progress also has an indeterminate bar. |
| Organize related content | Card | Use only when a surface communicates a real grouping or interactive object better than spacing. `Card.Root` `variant` is `default`, `panel`, or `inset`. |
| Reveal optional detail | Collapsible, Accordion, or Show More | Collapsible controls one region, Accordion manages peer sections, and Show More clamps long prose. |
| Navigate peers or hierarchy | Tabs, Breadcrumb, Pagination, or Fullscreen Nav | Match the information model. Do not use Tabs as a layout switch when links or other controls fit better. |

## Compose AI Interfaces

Each part below owns its own state. Compose them; do not fold them into one message component.

| Concern | Component | Role |
| --- | --- | --- |
| Scrollable transcript | Conversation | `follow` keeps the view pinned to the latest message. `Conversation.Empty` covers the empty state and `Conversation.ScrollButton` jumps back to the latest message. |
| Speaker and response state | Message | `from` is `user`, `assistant`, or `system`; `status` is `idle`, `streaming`, or `error`. `Message.Actions` holds response actions. |
| Rich answer content | Markdown or Code Block | Render model output and code with these instead of styling prose per message. |
| Generated text arrival | Response Stream | Reveals a string or an `AsyncIterable<string>` (`textStream`) at a set `speed`. Set `streaming` when the string is a growing snapshot. Render text directly when the reveal would only delay reading. |
| Model trace | Reasoning | Opens when `streaming` starts and stays open until the user collapses it. `Reasoning.Trigger` takes a live `status` and a settled `summary`; Root measures elapsed time, or takes `duration` in seconds. Lay out the trace with `Reasoning.Steps` and `Reasoning.Step`. Pass an `icon` snippet, such as `Reasoning.Orb`, for a trigger icon. |
| Sources and citations | Source | `Source.Root` is a favicon link chip for a page the model read. Inline in answer prose, add `Source.Content` with one `Source.Item` per cited page to open a hover card; set `count` on Root and add `Source.Count` for the `+N` badge. |
| Agent operations | Tool | Groups calls under one trigger styled like Reasoning. Set `running` on Root while calls run; Trigger takes `status` and `summary`. Each `Tool.Call` takes an `action`, a `target`, a `state` of `running`, `complete`, or `error`, and an optional `icon` snippet, and can hold `Tool.Input`, `Tool.Output`, or a `FileDiff`. |
| Code changes | File Diff | Shows one file's unified diff with its path, addition and deletion counts, and line numbers. |
| User prompt | Composer | `Composer.Root` takes a bindable `value` and a required `onSubmit`. While `generating` is true, `Composer.Submit` becomes stop when the input is empty and queue when it has text; `onStop` handles stop. |
| Agent clarification | Question | `type` is `single`, `multiple`, or `text`. Requires `onSubmit`; `onCancel` adds a cancel path. |
| Ordered execution | Task Steps | Takes `steps` and a `current` index; `failed` marks the current step as failed. |
| Files and artifacts | Attachment | Lists files with status `ready`, `uploading`, `complete`, or `error`, plus remove actions. |

A common coding-agent composition is:

```text
Conversation.Root
├── Conversation.Content
│   ├── Message.Root from="user"
│   │   └── Message.Content
│   └── Message.Root from="assistant"
│       ├── Message.Content
│       │   └── Reasoning / Tool / Markdown / CodeBlock / FileDiff
│       └── Message.Actions
└── Conversation.ScrollButton

Question.Root or Composer.Root
```

When the agent cannot continue without structured input, render `Question` in place of the composer and keep the unsent composer draft. Keep `Tool` and `Reasoning` lower emphasis than the answer. Put response actions such as copy, retry, or feedback in `Message.Actions`.

## Resolve Common Ambiguities

| Choice | Decision |
| --- | --- |
| Combobox vs Command | Combobox produces a field value; Command invokes application actions. |
| Accordion vs Tabs | Accordion reveals sections in one reading flow; Tabs switch among peer views. |
| Modal vs Sheet | Modal concentrates attention; Sheet keeps the page in view beside it. |

Choose by semantics, state ownership, keyboard behavior, and content structure, not visual resemblance.
