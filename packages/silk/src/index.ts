/**
 * Public library entry for `@silk/ui`.
 *
 * Single-element primitives are exported directly so they can be used as
 * `import { Button } from '@silk/ui'`. Compound components are exported as
 * namespaces so their parts stay grouped: `import { Tabs } from '@silk/ui'`
 * then `<Tabs.Root><Tabs.Trigger /></Tabs.Root>`.
 *
 * This is the barrel consumed via the `.` export. The CLI's owns-the-code
 * install path is unaffected -- it copies component sources directly.
 */

// Primitives -- single component, used directly.
export * from './components/badge';
export * from './components/button';
export * from './components/calendar';
export * from './components/checkbox';
export * from './components/color-picker';
export * from './components/input';
export * from './components/label';
export * from './components/marquee';
export * from './components/pagination';
export * from './components/progress';
export * from './components/scroll-area';
export * from './components/separator';
export * from './components/shortcut';
export * from './components/skeleton';
export * from './components/slider';
export * from './components/switch';
export * from './components/textarea';
export * from './components/toggle';

// Compound components -- namespaced; parts live under the export name.
export * as Accordion from './components/accordion';
export * as Alert from './components/alert';
export * as AlertDialog from './components/alert-dialog';
export * as Avatar from './components/avatar';
export * as Breadcrumb from './components/breadcrumb';
export * as Card from './components/card';
export * as Collapsible from './components/collapsible';
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
export * as Toast from './components/toast';
export * as ToggleGroup from './components/toggle-group';
export * as Tooltip from './components/tooltip';

// Imperative toast API is conventionally top-level.
export { toast } from './components/toast';
