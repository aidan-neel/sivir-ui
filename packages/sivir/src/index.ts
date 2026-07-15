/**
 * Public entry for `@sivir/ui`.
 *
 * Single-element components are re-exported by name:
 *   import { Button } from '@sivir/ui';
 *
 * Compound components are re-exported as a namespace so their parts stay
 * grouped:
 *   import { AlertDialog } from '@sivir/ui';
 *   <AlertDialog.Root> … </AlertDialog.Root>
 *
 * Every component is also reachable directly at
 * `@sivir/ui/components/<name>` for finer-grained imports.
 */

// ─── Single-element components ───────────────────────────────────────
export { default as BrandMark } from './brand-mark.svelte';
export { Badge } from './components/badge';
export { Button } from './components/button';
export { Checkbox } from './components/checkbox';
export { CodeBlock } from './components/code-block';
export { CopyButton } from './components/copy-button';
export { Input } from './components/input';
export { Label } from './components/label';
export { Marquee } from './components/marquee';
export { Pagination } from './components/pagination';
export { Progress } from './components/progress';
export { ScrollArea } from './components/scroll-area';
export { Shortcut } from './components/shortcut';
export { Skeleton } from './components/skeleton';
export { Slider } from './components/slider';
export { Switch } from './components/switch';
export { Textarea } from './components/textarea';
export { Toggle } from './components/toggle';

// Toast ships a component plus its imperative helpers.
export { Toast, Toaster, toast, getToastUIState } from './components/toast';

// ─── Compound components (namespaced) ────────────────────────────────
export * as Accordion from './components/accordion';
export * as Alert from './components/alert';
export * as AlertDialog from './components/alert-dialog';
export * as Avatar from './components/avatar';
export * as Breadcrumb from './components/breadcrumb';
export * as Card from './components/card';
export * as Collapsible from './components/collapsible';
export * as ColorPicker from './components/color-picker';
export * as Combobox from './components/combobox';
export * as Command from './components/command';
export * as ContextMenu from './components/context-menu';
export * as DropdownMenu from './components/dropdown-menu';
export * as HoverCard from './components/hover-card';
export * as Modal from './components/modal';
export * as Popover from './components/popover';
export * as RadioGroup from './components/radio-group';
export * as Select from './components/select';
export * as Sheet from './components/sheet';
export * as Tabs from './components/tabs';
export * as ToggleGroup from './components/toggle-group';
export * as Tooltip from './components/tooltip';
