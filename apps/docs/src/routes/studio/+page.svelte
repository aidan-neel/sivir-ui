<script lang="ts">
    import Bell from '@lucide/svelte/icons/bell';
    import Blend from '@lucide/svelte/icons/blend';
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import Code from '@lucide/svelte/icons/code';
    import CreditCard from '@lucide/svelte/icons/credit-card';
    import FileText from '@lucide/svelte/icons/file-text';
    import Layers from '@lucide/svelte/icons/layers';
    import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
    import LifeBuoy from '@lucide/svelte/icons/life-buoy';
    import LogOut from '@lucide/svelte/icons/log-out';
    import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
    import Palette from '@lucide/svelte/icons/palette';
    import Plus from '@lucide/svelte/icons/plus';
    import Redo2 from '@lucide/svelte/icons/redo-2';
    import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
    import Ruler from '@lucide/svelte/icons/ruler';
    import Search from '@lucide/svelte/icons/search';
    import Settings from '@lucide/svelte/icons/settings';
    import Spline from '@lucide/svelte/icons/spline';
    import SquareDashed from '@lucide/svelte/icons/square-dashed';
    import SquareMousePointer from '@lucide/svelte/icons/square-mouse-pointer';
    import Timer from '@lucide/svelte/icons/timer';
    import TypeIcon from '@lucide/svelte/icons/type';
    import Undo2 from '@lucide/svelte/icons/undo-2';
    import User from '@lucide/svelte/icons/user';
    import * as Accordion from '@sivir-ui/svelte/components/accordion';
    import * as Alert from '@sivir-ui/svelte/components/alert';
    import * as AlertDialog from '@sivir-ui/svelte/components/alert-dialog';
    import * as Avatar from '@sivir-ui/svelte/components/avatar';
    import { Badge } from '@sivir-ui/svelte/components/badge';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Card from '@sivir-ui/svelte/components/card';
    import { Checkbox } from '@sivir-ui/svelte/components/checkbox';
    import * as Combobox from '@sivir-ui/svelte/components/combobox';
    import * as Command from '@sivir-ui/svelte/components/command';
    import * as ContextMenu from '@sivir-ui/svelte/components/context-menu';
    import { CopyButton } from '@sivir-ui/svelte/components/copy-button';
    import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';
    import { Gauge } from '@sivir-ui/svelte/components/gauge';
    import { Input } from '@sivir-ui/svelte/components/input';
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import { Pagination } from '@sivir-ui/svelte/components/pagination';
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import { Progress, type ProgressProps } from '@sivir-ui/svelte/components/progress';
    import * as RadioGroup from '@sivir-ui/svelte/components/radio-group';
    import { ScrollArea } from '@sivir-ui/svelte/components/scroll-area';
    import * as Select from '@sivir-ui/svelte/components/select';
    import * as Sheet from '@sivir-ui/svelte/components/sheet';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';
    import * as Slider from '@sivir-ui/svelte/components/slider';
    import { Switch } from '@sivir-ui/svelte/components/switch';
    import * as Tabs from '@sivir-ui/svelte/components/tabs';
    import { TaskSteps } from '@sivir-ui/svelte/components/task-steps';
    import { Textarea } from '@sivir-ui/svelte/components/textarea';
    import { toast } from '@sivir-ui/svelte/components/toast';
    import * as ToggleGroup from '@sivir-ui/svelte/components/toggle-group';
    import { Toolbar } from '@sivir-ui/svelte/components/toolbar';
    import * as Tooltip from '@sivir-ui/svelte/components/tooltip';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { builtInThemePresets } from '@sivir-ui/svelte/themes/builtin-presets';
    import {
        applyLiveThemeCss,
        loadStudioTheme,
        saveStudioTheme
    } from '@sivir-ui/svelte/themes/live';
    import {
        DEFAULT_THEME,
        type InteractiveCursor,
        motionFeels,
        parseTheme,
        type Theme,
        type ThemeFontWeight,
        type ThemeTokenOverrides,
        themeToCss
    } from '@sivir-ui/svelte/themes/theme';
    import { mode } from 'mode-watcher';
    import { onMount, tick, untrack } from 'svelte';
    import { quintOut } from 'svelte/easing';
    import { prefersReducedMotion } from 'svelte/motion';
    import { fade, slide } from 'svelte/transition';
    import { dev } from '$app/environment';
    import { replaceState } from '$app/navigation';
    import { page } from '$app/state';
    import ChangedDot from '$lib/components/studio/changed-dot.svelte';
    import ColorAlphaField from '$lib/components/studio/color-alpha-field.svelte';
    import ColorField from '$lib/components/studio/color-field.svelte';
    import ElementOutline from '$lib/components/studio/element-outline.svelte';
    import ElementTokenPopover from '$lib/components/studio/element-token-popover.svelte';
    import ExportDialog from '$lib/components/studio/export-dialog.svelte';
    import PresetGallery from '$lib/components/studio/preset-gallery.svelte';
    import PreviewAgent from '$lib/components/studio/preview-agent.svelte';
    import PreviewCards from '$lib/components/studio/preview-cards.svelte';
    import SelectFieldTrigger from '$lib/components/studio/select-field-trigger.svelte';
    import ShadowField from '$lib/components/studio/shadow-field.svelte';
    import SwitchField from '$lib/components/studio/switch-field.svelte';
    import { fonts } from '$lib/fonts.svelte';
    import {
        commitSnapshot,
        createHistory,
        type DraftHistory,
        type DraftSnapshot,
        redoHistory,
        undoHistory
    } from '$lib/studio/draft-history';
    import { cssChanges, presetSwatch, surfaceTransition } from '$lib/studio/studio-chrome';
    import {
        type AdvancedTokens,
        type BrandColors,
        clampHeaderSize,
        DEFAULT_FOUNDATION_COLORS,
        DEFAULT_ROLE_WEIGHTS,
        draftToTheme,
        emptyAdvancedTokens,
        type FoundationColors,
        type FoundationPalette,
        HEADER_SIZE_RANGE,
        type RoleWeights,
        type StudioDraft,
        sameThemeDesign,
        themeAxes,
        themeToDraft
    } from '$lib/studio/theme-draft';
    import {
        buildTokenIndex,
        collectRuleInputs,
        elementsUsingToken,
        type TokenIndex,
        tokensForElement
    } from '$lib/studio/token-usage';
    import {
        type AnimationTokenDefinition,
        type AnimationTokenName,
        animationTokenDefinitions,
        animationTokenGroups,
        type ColorTokenDefinition,
        type ColorTokenName,
        colorTokenDefinitions,
        colorTokenGroups,
        type DetailTokenDefinition,
        type DetailTokenName,
        detailTokenGroups,
        easingOptions,
        formatCssColor,
        formatEm,
        formatMs,
        formatNumber,
        formatPx,
        formatScale,
        matchingEase,
        normalizeEase,
        originOptions,
        parseCssColor,
        parseDurationMs,
        parsePxLength,
        parseScale,
        type SpacingTokenDefinition,
        type SpacingTokenName,
        spacingTokenDefinitions,
        spacingTokenGroups
    } from '$lib/studio-advanced-tokens';

    type FontWeight = ThemeFontWeight;

    type LegacyPalette = Partial<FoundationPalette> & {
        muted?: string;
    };

    type LegacyTokenMap = Record<string, string | undefined>;

    type LegacyStudioExtensions = {
        presetSlug?: string;
        headerSize?: number;
        headerWeight?: FontWeight;
        roleWeights?: Partial<RoleWeights>;
        brandColors?: Partial<BrandColors>;
        foundationColors?: {
            light?: LegacyPalette;
            dark?: LegacyPalette;
        };
        advancedTokens?: {
            colors?: {
                light?: LegacyTokenMap;
                dark?: LegacyTokenMap;
            };
            spacing?: LegacyTokenMap;
            animation?: LegacyTokenMap;
            details?: {
                light?: LegacyTokenMap;
                dark?: LegacyTokenMap;
                shared?: LegacyTokenMap;
            };
        };
        shadows?: boolean;
        surfaceShadows?: boolean;
        controlShadows?: boolean;
        dialogShadows?: boolean;
        travelingHighlight?: boolean;
        primaryStroke?: boolean;
        interactiveCursor?: InteractiveCursor;
    };

    type ThemeIdentity = Pick<Theme, 'slug' | 'name' | 'description' | 'publisher'>;

    const LEGACY_EXTENSIONS_KEY = 'sivir-studio-extensions-v1';
    const STUDIO_META_KEY = 'sivir-studio-meta-v2';
    const EDIT_TOKEN_KEY_PREFIX = 'sivir-studio-edit-token-v1:';
    const FLAT_CONTROL_SHADOW = 'inset 0 0 0 var(--border-size) var(--color-border)';
    const fontWeights = ['400', '500', '600', '700'] as const;
    const cursorChoices = ['default', 'pointer'] as const;

    const brandSwatches = [
        { label: 'Sivir blue', value: '#1e78e6' },
        { label: 'Graphite', value: '#4d607f' },
        { label: 'Grove', value: '#2f7a54' },
        { label: 'Linen', value: '#a44a2f' },
        { label: 'Violet', value: '#7457d9' }
    ];
    const baseSwatches = [
        { label: 'White', value: '#ffffff' },
        { label: 'Porcelain', value: '#fafaf9' },
        { label: 'Graphite', value: '#202020' },
        { label: 'Ink', value: '#171717' }
    ];
    const borderSwatches = [
        { label: 'Mist', value: '#e8e8e6' },
        { label: 'Silver', value: '#d4d4d2' },
        { label: 'Graphite', value: '#3a3a3a' },
        { label: 'Charcoal', value: '#2a2a2a' }
    ];
    const backgroundSwatches = [
        { label: 'Canvas', value: '#fdfdfc' },
        { label: 'Cloud', value: '#f7f7f5' },
        { label: 'Slate', value: '#111318' },
        { label: 'Night', value: '#0a0a0a' }
    ];
    const secondarySwatches = [
        { label: 'Soft', value: '#efefee' },
        { label: 'Stone', value: '#e7e5e4' },
        { label: 'Smoke', value: '#303030' },
        { label: 'Carbon', value: '#252525' }
    ];
    const foregroundSwatches = [
        { label: 'Ink', value: '#1c1c1b' },
        { label: 'Charcoal', value: '#3a3a3a' },
        { label: 'Mist', value: '#a3a3a3' },
        { label: 'Snow', value: '#ededed' }
    ];
    const onPrimarySwatches = [
        { label: 'White', value: '#ffffff' },
        { label: 'Porcelain', value: '#fafaf9' },
        { label: 'Ink', value: '#1c1c1b' },
        { label: 'Night', value: '#0a0a0a' }
    ];

    type TokenRow =
        | {
              bucket: 'color';
              definition: ColorTokenDefinition;
          }
        | {
              bucket: 'spacing';
              definition: SpacingTokenDefinition;
          }
        | {
              bucket: 'animation';
              definition: AnimationTokenDefinition;
          }
        | {
              bucket: 'detail';
              definition: DetailTokenDefinition;
          };

    type TokenRowGroup = {
        label: string;
        rows: TokenRow[];
    };

    type TokenSlider = {
        value: number;
        min: number;
        max: number;
        step: number;
        format: (value: number) => string;
        commit: (value: number) => void;
    };

    type TokenSection = {
        id: string;
        label: string;
        shortLabel: string;
        groups: TokenRowGroup[];
    };

    function toFontOption(font: (typeof fonts)[number]) {
        return {
            key: font.name.toLowerCase().replaceAll(' ', '-'),
            label: font.name,
            value: font.family
        };
    }

    const sansFonts = fonts.filter((font) => font.category === 'Sans serif').map(toFontOption);
    const serifFonts = fonts.filter((font) => font.category === 'Serif').map(toFontOption);
    const monoFonts = fonts.filter((font) => font.category === 'Monospace').map(toFontOption);
    const headerFonts = [
        { key: 'same-as-sans', label: 'Same as sans', value: 'var(--font-sans)' },
        ...serifFonts,
        ...sansFonts
    ];
    const radiusTokenNames = ['--radius-sm', '--radius-md', '--radius-lg', '--radius-xl'] as const;
    const movementPresets = ['none', 'subtle', 'default', 'expressive'] as const;

    function pickGroups(groups: TokenRowGroup[], labels: string[]) {
        return labels.flatMap((label) => {
            const matching = groups.filter((group) => group.label === label);
            if (matching.length === 0) {
                return [];
            }

            return [
                {
                    label,
                    rows: matching.flatMap((group) => group.rows)
                }
            ];
        });
    }

    const colorRowGroups: TokenRowGroup[] = colorTokenGroups.map((group) => {
        return {
            label: group.label,
            rows: group.tokens.map((definition) => {
                return {
                    bucket: 'color',
                    definition
                };
            })
        };
    });
    const spacingRowGroups: TokenRowGroup[] = spacingTokenGroups.map((group) => {
        return {
            label: group.label,
            rows: group.tokens.map((definition) => {
                return {
                    bucket: 'spacing',
                    definition
                };
            })
        };
    });
    const animationRowGroups: TokenRowGroup[] = animationTokenGroups.map((group) => {
        return {
            label: group.label,
            rows: group.tokens.map((definition) => {
                return {
                    bucket: 'animation',
                    definition
                };
            })
        };
    });
    const detailRowGroups: TokenRowGroup[] = detailTokenGroups.map((group) => {
        return {
            label: group.label,
            rows: group.tokens.map((definition) => {
                return {
                    bucket: 'detail',
                    definition
                };
            })
        };
    });
    const layoutRowGroups = [...spacingRowGroups, ...detailRowGroups];
    const feelMotionGroups = [
        {
            title: 'Menu motion',
            fields: [
                ['--motion-duration-panel-in', 'In duration'],
                ['--motion-duration-panel-out', 'Out duration'],
                ['--motion-menu-blur', 'Blur'],
                ['--motion-menu-scale-start', 'Scale'],
                ['--motion-menu-origin', 'Scale from'],
                ['--motion-menu-opacity-start', 'Opacity'],
                ['--motion-menu-x', 'X offset'],
                ['--motion-menu-y', 'Y offset']
            ]
        },
        {
            title: 'Modal motion',
            fields: [
                ['--motion-duration-modal-in', 'In duration'],
                ['--motion-duration-modal-out', 'Out duration'],
                ['--motion-modal-blur', 'Blur'],
                ['--motion-modal-scale-start', 'Scale'],
                ['--motion-modal-opacity-start', 'Opacity'],
                ['--motion-modal-x', 'X offset'],
                ['--motion-modal-y', 'Y offset']
            ]
        },
        {
            title: 'Text replacement',
            fields: [['--motion-duration-swap', 'Duration']]
        },
        {
            title: 'Switch motion',
            fields: [
                ['--motion-duration-switch', 'Duration'],
                ['--motion-switch-stretch', 'Stretch']
            ]
        }
    ].map((group) => {
        const rows = animationRowGroups.flatMap((rowGroup) => rowGroup.rows);
        const fields = group.fields.flatMap(([name, label]) => {
            const row = rows.find((candidate) => candidate.definition.name === name);

            return row ? [{ row, label }] : [];
        });

        return { title: group.title, fields };
    });
    const hoverSpeedRow = animationRowGroups
        .flatMap((rowGroup) => rowGroup.rows)
        .find((row) => {
            return row.definition.name === '--motion-duration-hover';
        });
    const buttonPressRow = animationRowGroups
        .flatMap((rowGroup) => rowGroup.rows)
        .find((row) => {
            return row.definition.name === '--motion-press-px';
        });
    const densityRow = spacingRowGroups
        .flatMap((rowGroup) => rowGroup.rows)
        .find((row) => {
            return row.definition.name === '--sivir-space-unit';
        });
    const radiusRatios = {
        '--radius-sm': 0.6,
        '--radius-md': 0.8,
        '--radius-lg': 1,
        '--radius-xl': 1.4
    } as const;

    const tokenSections: TokenSection[] = [
        {
            id: 'color',
            label: 'Color',
            shortLabel: 'Color',
            groups: colorRowGroups
        },
        {
            id: 'type',
            label: 'Typography',
            shortLabel: 'Type',
            groups: pickGroups(detailRowGroups, ['Type scale', 'Line height', 'Letter spacing'])
        },
        {
            id: 'space',
            label: 'Space & shape',
            shortLabel: 'Shape',
            groups: pickGroups(spacingRowGroups, ['Spacing', 'Controls', 'Corners', 'Stroke'])
        },
        {
            id: 'depth',
            label: 'Depth & overlay',
            shortLabel: 'Depth',
            groups: pickGroups(layoutRowGroups, ['Shadows', 'Overlay'])
        },
        {
            id: 'motion',
            label: 'Motion',
            shortLabel: 'Motion',
            groups: animationRowGroups
        }
    ];
    const motionDurationTokenNames: AnimationTokenName[] = [
        '--motion-duration-hover',
        '--motion-duration-menu',
        '--motion-duration-panel',
        '--motion-duration-sheet',
        '--motion-duration-sheet-out',
        '--motion-duration-overlay',
        '--motion-duration-toast-in',
        '--motion-duration-toast-out'
    ];
    type InvoiceStatus = 'Paid' | 'Due soon' | 'Overdue' | 'Sent' | 'Draft';
    type Invoice = {
        client: string;
        initials: string;
        reference: string;
        due: string;
        amount: string;
        status: InvoiceStatus;
    };
    const INVOICE_PAGE_SIZE = 4;
    const initialInvoices: Invoice[] = [
        {
            client: 'Northwind Trading',
            initials: 'NT',
            reference: 'INV-2291',
            due: 'Sep 12',
            amount: '$12,400',
            status: 'Paid'
        },
        {
            client: 'Halcyon Studio',
            initials: 'HS',
            reference: 'INV-2288',
            due: 'Sep 14',
            amount: '$3,150',
            status: 'Due soon'
        },
        {
            client: 'Kestrel Logistics',
            initials: 'KL',
            reference: 'INV-2279',
            due: 'Aug 28',
            amount: '$9,860',
            status: 'Overdue'
        },
        {
            client: 'Mercury Goods',
            initials: 'MG',
            reference: 'INV-2274',
            due: 'Sep 18',
            amount: '$6,720',
            status: 'Sent'
        },
        {
            client: 'Assembly Works',
            initials: 'AW',
            reference: 'INV-2268',
            due: 'Sep 21',
            amount: '$4,280',
            status: 'Draft'
        },
        {
            client: 'Riverline Press',
            initials: 'RP',
            reference: 'INV-2261',
            due: 'Sep 24',
            amount: '$2,940',
            status: 'Sent'
        },
        {
            client: 'Oak & Pine',
            initials: 'OP',
            reference: 'INV-2254',
            due: 'Aug 19',
            amount: '$7,110',
            status: 'Overdue'
        },
        {
            client: 'Fieldwork Labs',
            initials: 'FL',
            reference: 'INV-2248',
            due: 'Sep 28',
            amount: '$5,600',
            status: 'Due soon'
        }
    ];
    let theme = $state<Theme>({ ...DEFAULT_THEME });
    let baseTheme = $state<Theme>({ ...DEFAULT_THEME });
    let selectedPreset = $state(DEFAULT_THEME.slug);
    let previousPreset = $state(DEFAULT_THEME.slug);
    let previousRadius: Theme['radius'] = theme.radius;
    let previousDensity: Theme['density'] = theme.density;
    let previousMotion: Theme['motion'] = theme.motion;
    let selectedSans = $state('inter');
    let previousSans = $state('inter');
    let selectedHeader = $state('same-as-sans');
    let previousHeader = $state('same-as-sans');
    let selectedMono = $state('jetbrains-mono');
    let previousMono = $state('jetbrains-mono');
    let headerSize = $state(16);
    let headerWeight = $state<FontWeight>('600');
    let roleWeights = $state<RoleWeights>({ ...DEFAULT_ROLE_WEIGHTS });
    let foundationColors = $state<FoundationColors>({
        light: { ...DEFAULT_FOUNDATION_COLORS.light },
        dark: { ...DEFAULT_FOUNDATION_COLORS.dark }
    });
    let advancedTokens = $state<AdvancedTokens>(emptyAdvancedTokens());
    let extraTokens = $state<ThemeTokenOverrides>({});
    let brandColors = $state<BrandColors>({ light: '#1e78e6', dark: '#1e78e6' });
    let surfaceShadows = $state(true);
    let controlShadows = $state(true);
    let dialogShadows = $state(true);
    let travelingHighlight = $state(true);
    let fancySwap = $state(true);
    let menuPaneling = $state(true);
    let surfacePaneling = $state(true);
    let primaryStroke = $state(false);
    let interactiveCursor = $state<InteractiveCursor>('default');
    let editTokens = $state<Record<string, string>>({});
    let pendingRegistryTheme = $state<Theme | null>(null);
    let tokenQuery = $state('');
    let openTokenSection = $state('color');
    let pendingPreset = $state<string | null>(null);
    let presetDialogOpen = $state(false);
    let resetDialogOpen = $state(false);
    let studioView = $state('invoices');
    let inspectorTab = $state('color');
    let previewView = $state('cards');
    let presetsOpen = $state(false);
    let previewPresetSlug = $state<string | null>(null);
    let exportOpen = $state(false);
    let tokenPaletteOpen = $state(false);
    let paletteRowName = $state<string | null>(null);
    let paletteInput = $state<HTMLInputElement | null>(null);
    let paletteQuery = $state('');
    let paletteActiveName = $state<string | null>(null);
    let dashboardRange = $state('30d');
    let invoices = $state<Invoice[]>(initialInvoices.map((invoice) => ({ ...invoice })));
    let invoiceQuery = $state('');
    let invoiceStatus = $state('all');
    let invoicePage = $state(1);
    let invoiceModalOpen = $state(false);
    let newInvoiceCustomer = $state('');
    let newInvoiceNotes = $state('');
    let autoReconcile = $state(true);
    let reminderCadence = $state('weekly');
    let reminderDays = $state(3);
    let companyName = $state('Northstar Ledger');
    let selectedInvoices = $state<Record<string, boolean>>(
        Object.fromEntries(initialInvoices.map((invoice) => [invoice.reference, false]))
    );
    let notifications = $state([
        {
            id: 'overdue',
            title: 'Kestrel Logistics is overdue',
            detail: '$9,860 · INV-2279',
            read: false
        },
        {
            id: 'viewed',
            title: 'Halcyon Studio viewed INV-2288',
            detail: '14 minutes ago',
            read: false
        },
        {
            id: 'paid',
            title: 'Northwind Trading paid INV-2291',
            detail: '$12,400 received',
            read: true
        }
    ]);
    let commandOpen = $state(false);
    let settingsSections = $state<string[]>(['workspace', 'reminders']);
    let hydrated = $state(false);
    let history = $state.raw<DraftHistory>(
        createHistory({
            draft: structuredClone(themeToDraft(DEFAULT_THEME)),
            base: { ...DEFAULT_THEME }
        })
    );
    let historyTimer: ReturnType<typeof setTimeout> | undefined;
    const canUndo = $derived(history.past.length > 0);
    const canRedo = $derived(history.future.length > 0);
    let appliedDark = $state(false);
    let liveCssVersion = $state(0);
    let themeSwapPending = false;
    let themeSwapTimer: ReturnType<typeof setTimeout> | undefined;
    let themeSwapFrame = 0;
    const appMode = $derived(mode.current === 'dark' ? 'dark' : 'light');
    const visibleInvoices = $derived(
        invoices.filter((invoice) => {
            const query = invoiceQuery.trim().toLowerCase();
            const matchesQuery =
                query === '' ||
                invoice.client.toLowerCase().includes(query) ||
                invoice.reference.toLowerCase().includes(query);
            const matchesStatus =
                invoiceStatus === 'all' ||
                (invoiceStatus === 'open' && invoice.status !== 'Paid') ||
                invoice.status.toLowerCase() === invoiceStatus;

            return matchesQuery && matchesStatus;
        })
    );
    const invoicePageCount = $derived(
        Math.max(1, Math.ceil(visibleInvoices.length / INVOICE_PAGE_SIZE))
    );
    const pagedInvoices = $derived(
        visibleInvoices.slice(
            (invoicePage - 1) * INVOICE_PAGE_SIZE,
            invoicePage * INVOICE_PAGE_SIZE
        )
    );
    const allVisibleSelected = $derived(
        pagedInvoices.length > 0 &&
            pagedInvoices.every((invoice) => selectedInvoices[invoice.reference])
    );
    const unreadNotificationCount = $derived(
        notifications.filter((notification) => !notification.read).length
    );
    const overdueCount = $derived(
        invoices.filter((invoice) => invoice.status === 'Overdue').length
    );
    const outstandingTotal = $derived(
        invoices
            .filter((invoice) => invoice.status !== 'Paid')
            .reduce(
                (sum, invoice) => sum + Number.parseFloat(invoice.amount.replace(/[$,]/g, '')),
                0
            )
    );
    const coverageValue = $derived(
        dashboardRange === '7d' ? 54 : dashboardRange === 'Quarter' ? 81 : 72
    );
    const customers = $derived([...new Set(invoices.map((invoice) => invoice.client))].sort());
    const collectionSteps = [
        { id: 'scan', label: 'Scan overdue', meta: 'Open invoices' },
        { id: 'remind', label: 'Send reminders', meta: 'Today' },
        { id: 'collect', label: 'Record payments' },
        { id: 'reconcile', label: 'Reconcile' }
    ];
    const collectionStep = $derived(autoReconcile ? 2 : 1);

    const filteredTokenSections = $derived.by(() => {
        const query = tokenQuery.trim().toLowerCase();
        if (!query) {
            return tokenSections;
        }

        return tokenSections
            .map((section) => {
                return {
                    ...section,
                    groups: section.groups
                        .map((group) => {
                            return {
                                ...group,
                                rows: group.rows.filter((row) => tokenRowMatches(row, query))
                            };
                        })
                        .filter((group) => group.rows.length > 0)
                };
            })
            .filter((section) => section.groups.length > 0);
    });
    const studioDraft = $derived<StudioDraft>({
        theme,
        brandColors,
        foundationColors,
        headerSize,
        headerWeight,
        roleWeights,
        advancedTokens,
        extraTokens,
        chrome: {
            surfaceShadows,
            controlShadows,
            dialogShadows,
            travelingHighlight,
            fancySwap,
            menuPaneling,
            surfacePaneling,
            primaryStroke,
            interactiveCursor
        }
    });
    const portableTheme = $derived(draftToTheme(studioDraft));
    const baseDesign = $derived(draftToTheme(themeToDraft(baseTheme)));
    const dirty = $derived(!sameThemeDesign(portableTheme, baseDesign));
    const generatedCss = $derived(themeToCss(portableTheme));
    const generatedJson = $derived(JSON.stringify(portableTheme, null, 2));
    const baseCss = $derived(themeToCss(baseDesign));
    const changeCount = $derived(cssChanges(generatedCss, baseCss).count);
    const previewedPreset = $derived(
        builtInThemePresets.find((preset) => {
            return preset.slug === previewPresetSlug;
        }) ?? null
    );
    const activePresetName = $derived(
        builtInThemePresets.find((preset) => {
            return preset.slug === selectedPreset;
        })?.name ?? baseTheme.name
    );

    function chromeShadowValue(name: DetailTokenName): string | null {
        if (!surfaceShadows && (name === '--elevation-1' || name === '--elevation-float')) {
            return 'none';
        }

        if (!dialogShadows && name === '--elevation-modal') {
            return 'none';
        }

        if (
            !controlShadows &&
            (name === '--elevation-control' || name === '--elevation-button-outline')
        ) {
            return FLAT_CONTROL_SHADOW;
        }

        return null;
    }

    function formatChoice(value: string) {
        if (value === 'comfortable') return 'Comfy';
        if (value === 'expressive') return 'Bold';
        if (value === 'true') return 'True';
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    function isMotionFeel(value: string): value is Theme['motion'] {
        return (motionFeels as readonly string[]).includes(value);
    }

    function isFontWeight(value: string): value is FontWeight {
        return (fontWeights as readonly string[]).includes(value);
    }

    function findSansKey(value: string) {
        return sansFonts.find((font) => font.value === value)?.key ?? 'inter';
    }

    function findMonoKey(value: string) {
        return monoFonts.find((font) => font.value === value)?.key ?? 'jetbrains-mono';
    }

    function findHeaderKey(value: string) {
        return headerFonts.find((font) => font.value === value)?.key ?? 'same-as-sans';
    }

    function syncFontSelections(nextTheme: Theme) {
        selectedSans = findSansKey(nextTheme.fontSans);
        previousSans = selectedSans;
        selectedHeader = findHeaderKey(nextTheme.fontHeader);
        previousHeader = selectedHeader;
        selectedMono = findMonoKey(nextTheme.fontMono);
        previousMono = selectedMono;
    }

    function identityOf(source: Theme): ThemeIdentity {
        return {
            slug: source.slug,
            name: source.name,
            description: source.description,
            ...(source.publisher
                ? {
                      publisher: source.publisher
                  }
                : {})
        };
    }

    function withIdentity(draft: StudioDraft, identity: ThemeIdentity): StudioDraft {
        return {
            ...draft,
            theme: {
                ...themeAxes(draft.theme),
                ...identity
            }
        };
    }

    function applyDraft(draft: StudioDraft) {
        theme = { ...draft.theme };
        brandColors = { ...draft.brandColors };
        foundationColors = {
            light: { ...draft.foundationColors.light },
            dark: { ...draft.foundationColors.dark }
        };
        headerSize = draft.headerSize;
        headerWeight = draft.headerWeight;
        roleWeights = { ...draft.roleWeights };
        advancedTokens = draft.advancedTokens;
        extraTokens = draft.extraTokens;
        surfaceShadows = draft.chrome.surfaceShadows;
        controlShadows = draft.chrome.controlShadows;
        dialogShadows = draft.chrome.dialogShadows;
        travelingHighlight = draft.chrome.travelingHighlight;
        fancySwap = draft.chrome.fancySwap;
        menuPaneling = draft.chrome.menuPaneling;
        surfacePaneling = draft.chrome.surfacePaneling;
        primaryStroke = draft.chrome.primaryStroke;
        interactiveCursor = draft.chrome.interactiveCursor;
        previousRadius = theme.radius;
        previousDensity = theme.density;
        previousMotion = theme.motion;
        syncFontSelections(theme);
    }

    function selectPresetSilently(slug: string) {
        const preset = builtInThemePresets.find((candidate) => candidate.slug === slug);
        if (!preset) {
            return;
        }

        selectedPreset = preset.slug;
        previousPreset = preset.slug;
        baseTheme = { ...preset };
    }

    function readJson(key: string): unknown {
        const raw = localStorage.getItem(key);
        if (!raw) {
            return null;
        }

        try {
            return JSON.parse(raw);
        } catch {
            localStorage.removeItem(key);

            return null;
        }
    }

    function cleanLegacyTokens(map: LegacyTokenMap | undefined): Record<string, string> {
        const clean: Record<string, string> = {};

        for (const [name, value] of Object.entries(map ?? {})) {
            if (name !== '--color-muted' && value?.trim()) {
                clean[name] = value;
            }
        }

        return clean;
    }

    function withoutMuted(palette: LegacyPalette | undefined): Partial<FoundationPalette> {
        const { muted: _muted, ...rest } = palette ?? {};

        return rest;
    }

    function mergeLegacyExtensions(draft: StudioDraft, value: LegacyStudioExtensions): StudioDraft {
        const shadowsOff = value.shadows === false;
        const legacyShadow = (flag: boolean | undefined, current: boolean) => {
            if (typeof flag === 'boolean') {
                return flag;
            }

            return shadowsOff ? false : current;
        };

        return {
            ...draft,
            brandColors: {
                light: value.brandColors?.light ?? draft.brandColors.light,
                dark: value.brandColors?.dark ?? draft.brandColors.dark
            },
            foundationColors: {
                light: {
                    ...draft.foundationColors.light,
                    ...withoutMuted(value.foundationColors?.light)
                },
                dark: {
                    ...draft.foundationColors.dark,
                    ...withoutMuted(value.foundationColors?.dark)
                }
            },
            headerSize: clampHeaderSize(value.headerSize ?? draft.headerSize),
            headerWeight: value.headerWeight ?? draft.headerWeight,
            roleWeights: {
                ...draft.roleWeights,
                ...value.roleWeights
            },
            advancedTokens: {
                colors: {
                    light: {
                        ...draft.advancedTokens.colors.light,
                        ...cleanLegacyTokens(value.advancedTokens?.colors?.light)
                    },
                    dark: {
                        ...draft.advancedTokens.colors.dark,
                        ...cleanLegacyTokens(value.advancedTokens?.colors?.dark)
                    }
                },
                spacing: {
                    ...draft.advancedTokens.spacing,
                    ...cleanLegacyTokens(value.advancedTokens?.spacing)
                },
                animation: {
                    ...draft.advancedTokens.animation,
                    ...cleanLegacyTokens(value.advancedTokens?.animation)
                },
                details: {
                    light: {
                        ...draft.advancedTokens.details.light,
                        ...cleanLegacyTokens(value.advancedTokens?.details?.light)
                    },
                    dark: {
                        ...draft.advancedTokens.details.dark,
                        ...cleanLegacyTokens(value.advancedTokens?.details?.dark)
                    },
                    shared: {
                        ...draft.advancedTokens.details.shared,
                        ...cleanLegacyTokens(value.advancedTokens?.details?.shared)
                    }
                }
            },
            chrome: {
                surfaceShadows: legacyShadow(value.surfaceShadows, draft.chrome.surfaceShadows),
                controlShadows: legacyShadow(value.controlShadows, draft.chrome.controlShadows),
                dialogShadows: legacyShadow(value.dialogShadows, draft.chrome.dialogShadows),
                travelingHighlight: value.travelingHighlight ?? draft.chrome.travelingHighlight,
                fancySwap: draft.chrome.fancySwap,
                menuPaneling: draft.chrome.menuPaneling,
                surfacePaneling: draft.chrome.surfacePaneling,
                primaryStroke: value.primaryStroke ?? draft.chrome.primaryStroke,
                interactiveCursor: value.interactiveCursor ?? draft.chrome.interactiveCursor
            }
        };
    }

    function readStoredDraft(): StudioDraft | null {
        const stored = loadStudioTheme();
        const legacy = readJson(LEGACY_EXTENSIONS_KEY) as LegacyStudioExtensions | null;
        const meta = readJson(STUDIO_META_KEY) as { presetSlug?: unknown } | null;
        const presetSlug =
            typeof meta?.presetSlug === 'string' ? meta.presetSlug : legacy?.presetSlug;

        if (typeof presetSlug === 'string') {
            selectPresetSilently(presetSlug);
        }

        if (legacy) {
            return withPresetIdentity(
                mergeLegacyExtensions(themeToDraft(stored ?? baseTheme), legacy)
            );
        }

        return stored ? withPresetIdentity(themeToDraft(stored)) : null;
    }

    function withPresetIdentity(draft: StudioDraft): StudioDraft {
        if (draft.theme.slug in readEditTokens()) {
            return draft;
        }

        return withIdentity(draft, identityOf(baseTheme));
    }

    function saveStudioDraft(nextTheme: Theme) {
        saveStudioTheme(nextTheme);
        localStorage.setItem(
            STUDIO_META_KEY,
            JSON.stringify({
                presetSlug: selectedPreset
            })
        );
        localStorage.removeItem(LEGACY_EXTENSIONS_KEY);
    }

    function readEditTokens(): Record<string, string> {
        const tokens: Record<string, string> = {};

        for (let index = 0; index < localStorage.length; index += 1) {
            const key = localStorage.key(index);
            if (!key?.startsWith(EDIT_TOKEN_KEY_PREFIX)) {
                continue;
            }

            const token = localStorage.getItem(key);
            if (token) {
                tokens[key.slice(EDIT_TOKEN_KEY_PREFIX.length)] = token;
            }
        }

        return tokens;
    }

    function syncEditTokens(event: StorageEvent) {
        if (event.key === null || event.key.startsWith(EDIT_TOKEN_KEY_PREFIX)) {
            editTokens = readEditTokens();
        }
    }

    function crossfadeTheme(update: () => void, animate: boolean) {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const root = document.documentElement;

        if (!animate || reduced) {
            update();
            return;
        }

        clearTimeout(themeSwapTimer);
        cancelAnimationFrame(themeSwapFrame);
        root.setAttribute('data-theme-swap', '');
        update();
        themeSwapFrame = requestAnimationFrame(() => {
            themeSwapFrame = requestAnimationFrame(() => {
                themeSwapTimer = setTimeout(() => {
                    root.removeAttribute('data-theme-swap');
                }, 320);
            });
        });
    }

    function setPreviewPreset(slug: string | null) {
        if (slug === previewPresetSlug) {
            return;
        }

        themeSwapPending = true;
        previewPresetSlug = slug;
    }

    function applyPreset(slug: string) {
        const preset = builtInThemePresets.find((candidate) => candidate.slug === slug);
        if (!preset) return;

        themeSwapPending = true;

        baseTheme = { ...preset };
        applyDraft(themeToDraft(preset));
    }

    function resetTheme() {
        applyDraft(themeToDraft(baseTheme));
    }

    function requestReset() {
        if (!dirty) {
            return;
        }

        resetDialogOpen = true;
    }

    function confirmReset() {
        resetTheme();
        resetDialogOpen = false;
    }

    function currentSnapshot(): DraftSnapshot {
        return {
            draft: $state.snapshot(studioDraft),
            base: $state.snapshot(baseTheme)
        };
    }

    function flushHistory() {
        clearTimeout(historyTimer);
        history = commitSnapshot(history, currentSnapshot());
    }

    function restoreSnapshot(snapshot: DraftSnapshot) {
        themeSwapPending = true;
        baseTheme = { ...snapshot.base };
        selectedPreset = snapshot.base.slug;
        previousPreset = snapshot.base.slug;
        applyDraft(structuredClone(snapshot.draft));
    }

    function undo() {
        flushHistory();
        const next = undoHistory(history);
        if (next === history) {
            return;
        }

        history = next;
        restoreSnapshot(next.present);
    }

    function redo() {
        flushHistory();
        const next = redoHistory(history);
        if (next === history) {
            return;
        }

        history = next;
        restoreSnapshot(next.present);
    }

    function applyRegistryTheme(loaded: Theme) {
        selectedPreset = loaded.slug;
        previousPreset = loaded.slug;
        baseTheme = { ...loaded };
        const draft = themeToDraft(loaded);
        applyDraft(loaded.slug in editTokens ? draft : withIdentity(draft, identityOf(theme)));
        toast({
            title: `${loaded.name} loaded`,
            description: 'Customize it, then copy it or publish your own version.',
            type: 'success',
            duration: 2200
        });
    }

    async function loadRegistryTheme(slug: string) {
        let response: Response;
        try {
            response = await fetch(`/api/themes/${encodeURIComponent(slug)}`);
        } catch {
            response = new Response('The theme registry is unreachable.', {
                status: 503
            });
        }

        const url = new URL(page.url);
        url.searchParams.delete('theme');
        replaceState(url, {});

        if (!response.ok) {
            toast({
                title: `Could not load ${slug}`,
                description: (await response.text()) || 'The theme registry did not respond.',
                type: 'error',
                duration: 3200
            });

            return;
        }

        let loaded: Theme;
        try {
            loaded = parseTheme(await response.json());
        } catch {
            toast({
                title: `Could not load ${slug}`,
                description: 'The registry returned a theme this version cannot read.',
                type: 'error',
                duration: 3200
            });

            return;
        }

        if (dirty) {
            pendingRegistryTheme = loaded;
            presetDialogOpen = true;

            return;
        }

        applyRegistryTheme(loaded);
    }

    function updateBrand(value: string) {
        const next = value.toLowerCase();
        brandColors = { ...brandColors, [appMode]: next };
        theme = { ...theme, brand: brandColors.light };
    }

    function updateFoundationColor(key: keyof FoundationPalette, value: string) {
        foundationColors = {
            ...foundationColors,
            [appMode]: {
                ...foundationColors[appMode],
                [key]: value.toLowerCase()
            }
        };
    }

    function updateRoleWeight(key: keyof RoleWeights, value: FontWeight) {
        roleWeights = { ...roleWeights, [key]: value };
    }

    function updateAdvancedColorToken(name: ColorTokenName, value: string) {
        advancedTokens = {
            ...advancedTokens,
            colors: {
                ...advancedTokens.colors,
                [appMode]: {
                    ...advancedTokens.colors[appMode],
                    [name]: value
                }
            }
        };
    }

    function updateAdvancedSpacingToken(name: SpacingTokenName, value: string) {
        advancedTokens = {
            ...advancedTokens,
            spacing: { ...advancedTokens.spacing, [name]: value }
        };
    }

    function updateAdvancedAnimationToken(name: AnimationTokenName, value: string) {
        advancedTokens = {
            ...advancedTokens,
            animation: { ...advancedTokens.animation, [name]: value }
        };
    }

    function detailScope(definition: DetailTokenDefinition) {
        if (definition.scope === 'mode') {
            return appMode;
        }

        return 'shared';
    }

    function updateDetailToken(definition: DetailTokenDefinition, value: string) {
        const scope = detailScope(definition);

        advancedTokens = {
            ...advancedTokens,
            details: {
                ...advancedTokens.details,
                [scope]: {
                    ...advancedTokens.details[scope],
                    [definition.name]: value
                }
            }
        };
    }

    function sliderStretchEnabled() {
        const raw = advancedTokens.animation['--motion-slider-stretch']?.trim() ?? '';

        return raw === '' || Number.parseFloat(raw) !== 0;
    }

    function setSliderStretch(enabled: boolean) {
        if (enabled) {
            advancedTokens = {
                ...advancedTokens,
                animation: withoutToken(advancedTokens.animation, '--motion-slider-stretch')
            };
            return;
        }

        updateAdvancedAnimationToken('--motion-slider-stretch', '0');
    }

    function cornerRadius() {
        const definition = spacingTokenDefinitions.find((item) => {
            return item.name === '--radius-lg';
        });

        return definition ? resolveSpacingToken(definition) : 10;
    }

    function cornerRadiusChanged() {
        return radiusTokenNames.some((name) => {
            return Boolean(advancedTokens.spacing[name]?.trim());
        });
    }

    function setCornerRadius(value: number) {
        const next = { ...advancedTokens.spacing };

        for (const name of radiusTokenNames) {
            next[name] = formatPx(Math.round(value * radiusRatios[name]));
        }

        advancedTokens = {
            ...advancedTokens,
            spacing: next
        };
    }

    function resetCornerRadius() {
        const next = { ...advancedTokens.spacing };

        for (const name of radiusTokenNames) {
            delete next[name];
        }

        advancedTokens = {
            ...advancedTokens,
            spacing: next
        };
    }

    function withoutToken<T extends string>(overrides: Partial<Record<T, string>>, name: T) {
        const next = { ...overrides };
        delete next[name];

        return next;
    }

    function tokenOverride(row: TokenRow) {
        if (row.bucket === 'color') {
            return advancedTokens.colors[appMode][row.definition.name]?.trim() ?? '';
        }

        if (row.bucket === 'spacing') {
            return advancedTokens.spacing[row.definition.name]?.trim() ?? '';
        }

        if (row.bucket === 'animation') {
            return advancedTokens.animation[row.definition.name]?.trim() ?? '';
        }

        return (
            advancedTokens.details[detailScope(row.definition)][row.definition.name]?.trim() ?? ''
        );
    }

    function resetTokenRow(row: TokenRow) {
        if (row.bucket === 'color') {
            advancedTokens = {
                ...advancedTokens,
                colors: {
                    ...advancedTokens.colors,
                    [appMode]: withoutToken(advancedTokens.colors[appMode], row.definition.name)
                }
            };
            return;
        }

        if (row.bucket === 'spacing') {
            advancedTokens = {
                ...advancedTokens,
                spacing: withoutToken(advancedTokens.spacing, row.definition.name)
            };
            return;
        }

        if (row.bucket === 'animation') {
            advancedTokens = {
                ...advancedTokens,
                animation: withoutToken(advancedTokens.animation, row.definition.name)
            };
            return;
        }

        const scope = detailScope(row.definition);

        advancedTokens = {
            ...advancedTokens,
            details: {
                ...advancedTokens.details,
                [scope]: withoutToken(advancedTokens.details[scope], row.definition.name)
            }
        };
    }

    function resolveDetailRaw(definition: DetailTokenDefinition) {
        const chromeValue = chromeShadowValue(definition.name);
        if (chromeValue) {
            return chromeValue;
        }

        const override = advancedTokens.details[detailScope(definition)][definition.name]?.trim();
        if (override) {
            return override;
        }

        if (definition.kind === 'shadow') {
            return detailFallback(definition);
        }

        const domReady = (appliedDark ? 'dark' : 'light') === appMode;
        const computed = domReady ? readCssVar(definition.name) : '';
        if (computed) {
            return computed;
        }

        return detailFallback(definition);
    }

    function detailFallback(definition: DetailTokenDefinition) {
        if (appMode === 'dark' && 'darkFallback' in definition && definition.darkFallback) {
            return definition.darkFallback;
        }

        return definition.fallback;
    }

    function detailSliderValue(definition: DetailTokenDefinition) {
        const raw = resolveDetailRaw(definition);
        if (definition.kind === 'px') {
            return parsePxLength(raw, resolveTokenRaw);
        }

        const parsed = Number.parseFloat(raw);
        if (!Number.isFinite(parsed)) {
            return 0;
        }

        return parsed;
    }

    function detailSliderDisplay(definition: DetailTokenDefinition, value: number) {
        if (definition.kind === 'px') {
            return formatPx(value);
        }

        if (definition.kind === 'em') {
            return formatEm(value);
        }

        return formatNumber(value);
    }

    function commitDetailSlider(definition: DetailTokenDefinition, value: number) {
        updateDetailToken(definition, detailSliderDisplay(definition, value));
    }

    function tokenSlider(row: TokenRow): TokenSlider | null {
        if (row.bucket === 'spacing') {
            const definition = row.definition;
            const value = resolveSpacingToken(definition);

            return {
                value,
                min: definition.min,
                max: definition.max,
                step: definition.step,
                format: formatPx,
                commit: (next) => {
                    updateAdvancedSpacingToken(definition.name, formatPx(next));
                }
            };
        }

        if (
            row.bucket === 'animation' &&
            row.definition.kind !== 'ease' &&
            row.definition.kind !== 'origin'
        ) {
            const definition = row.definition;
            const value = animationSliderValue(definition);

            return {
                value,
                min: definition.min,
                max: definition.max,
                step: definition.step,
                format: (next) => {
                    return animationSliderDisplay(definition, next);
                },
                commit: (next) => {
                    commitAnimationSlider(definition, next);
                }
            };
        }

        if (row.bucket === 'detail' && row.definition.kind !== 'shadow') {
            const definition = row.definition;
            const value = detailSliderValue(definition);

            return {
                value,
                min: definition.min,
                max: definition.max,
                step: definition.step,
                format: (next) => {
                    return detailSliderDisplay(definition, next);
                },
                commit: (next) => {
                    commitDetailSlider(definition, next);
                }
            };
        }

        return null;
    }

    function tokenRowMatches(row: TokenRow, query: string) {
        return [row.definition.label, row.definition.group, row.definition.name].some((text) =>
            text.toLowerCase().includes(query)
        );
    }

    function sectionChangeCount(section: TokenSection) {
        return section.groups.reduce((count, group) => {
            const changed = group.rows.filter((row) => tokenOverride(row) !== '').length;

            return count + changed;
        }, 0);
    }

    async function openTokens(sectionId: string, groupLabel?: string) {
        tokenQuery = '';
        openTokenSection = sectionId;
        inspectorTab = 'tokens';

        if (!groupLabel) {
            return;
        }

        await tick();

        const target = Array.from(
            document.querySelectorAll<HTMLElement>(`[data-token-group="${groupLabel}"]`)
        ).find((element) => element.offsetParent !== null);

        target?.scrollIntoView({
            block: 'start'
        });
    }

    function colorTokenFallback(definition: ColorTokenDefinition) {
        if (appMode === 'dark' && 'darkFallback' in definition && definition.darkFallback) {
            return definition.darkFallback;
        }

        return definition.fallback;
    }

    function colorTokenHasAlpha(definition: ColorTokenDefinition, alpha: number) {
        if (alpha < 0.995) {
            return true;
        }

        return /transparent|\/\s*[\d.]/.test(colorTokenFallback(definition));
    }

    function formatPixels(value: number) {
        return `${value}px`;
    }

    function readCssVar(name: string) {
        void liveCssVersion;

        if (typeof document === 'undefined') {
            return '';
        }

        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    function resolveTokenRaw(name: string) {
        const colorOverride = advancedTokens.colors[appMode][name as ColorTokenName];
        if (colorOverride?.trim()) {
            return colorOverride.trim();
        }

        const spacingOverride = advancedTokens.spacing[name as SpacingTokenName];
        if (spacingOverride?.trim()) {
            return spacingOverride.trim();
        }

        const animationOverride = advancedTokens.animation[name as AnimationTokenName];
        if (animationOverride?.trim()) {
            return animationOverride.trim();
        }

        const detailOverride =
            advancedTokens.details[appMode][name as DetailTokenName] ??
            advancedTokens.details.shared[name as DetailTokenName];
        if (detailOverride?.trim()) {
            return detailOverride.trim();
        }

        const computed = readCssVar(name);
        if (computed) {
            return computed;
        }

        const colorDefinition = colorTokenDefinitions.find((item) => item.name === name);
        if (colorDefinition) {
            return colorTokenFallback(colorDefinition);
        }

        const spacingDefinition = spacingTokenDefinitions.find((item) => item.name === name);
        if (spacingDefinition) {
            return spacingDefinition.fallback;
        }

        const animationDefinition = animationTokenDefinitions.find((item) => item.name === name);
        if (animationDefinition) {
            return animationDefinition.fallback;
        }

        return '';
    }

    function resolveColorToken(definition: ColorTokenDefinition) {
        const domReady = (appliedDark ? 'dark' : 'light') === appMode;
        const override = advancedTokens.colors[appMode][definition.name]?.trim() ?? '';
        const computed = domReady ? readCssVar(definition.name) : '';
        const raw = override || computed || colorTokenFallback(definition);
        const parsed = parseCssColor(raw, resolveTokenRaw);
        if (parsed) {
            return parsed;
        }

        return {
            hex: '#000000',
            alpha: 1
        };
    }

    function resolveSpacingToken(definition: SpacingTokenDefinition) {
        const override = advancedTokens.spacing[definition.name]?.trim() ?? '';
        const raw = override || readCssVar(definition.name) || definition.fallback;
        return parsePxLength(raw, resolveTokenRaw);
    }

    function resolveAnimationRaw(definition: AnimationTokenDefinition) {
        const override = advancedTokens.animation[definition.name]?.trim() ?? '';
        return override || readCssVar(definition.name) || definition.fallback;
    }

    function animationSliderValue(definition: AnimationTokenDefinition) {
        const raw = resolveAnimationRaw(definition);
        if (definition.kind === 'duration') {
            return parseDurationMs(raw);
        }

        if (definition.kind === 'scale' || definition.kind === 'opacity') {
            return parseScale(raw);
        }

        return parsePxLength(raw, resolveTokenRaw);
    }

    function animationSliderDisplay(definition: AnimationTokenDefinition, value: number) {
        if (definition.kind === 'duration') {
            return formatMs(value);
        }

        if (definition.kind === 'scale' || definition.kind === 'opacity') {
            return formatScale(value);
        }

        return formatPx(value);
    }

    function commitAnimationSlider(definition: AnimationTokenDefinition, value: number) {
        if (definition.kind === 'duration') {
            updateAdvancedAnimationToken(definition.name, formatMs(value));
            return;
        }

        if (definition.kind === 'scale' || definition.kind === 'opacity') {
            updateAdvancedAnimationToken(definition.name, formatScale(value));
            return;
        }

        updateAdvancedAnimationToken(definition.name, formatPx(value));
    }

    function animationEaseValue(definition: AnimationTokenDefinition) {
        return matchingEase(resolveAnimationRaw(definition));
    }

    function progressProps(value: number, destructive = false): ProgressProps {
        return {
            value,
            class: destructive ? '[&>div]:bg-[var(--color-error)]' : ''
        };
    }

    function confirmPresetChange() {
        if (pendingRegistryTheme) {
            applyRegistryTheme(pendingRegistryTheme);
            pendingRegistryTheme = null;
            return;
        }
        if (!pendingPreset) return;
        previousPreset = pendingPreset;
        selectedPreset = pendingPreset;
        applyPreset(pendingPreset);
        pendingPreset = null;
    }

    const savablePreset = $derived(
        dev && selectedPreset !== DEFAULT_THEME.slug
            ? (builtInThemePresets.find((preset) => {
                  return preset.slug === selectedPreset;
              }) ?? null)
            : null
    );

    async function saveToPreset() {
        if (!savablePreset) {
            return;
        }

        const saved: Theme = {
            ...portableTheme,
            slug: savablePreset.slug,
            name: savablePreset.name,
            description: savablePreset.description,
            publisher: savablePreset.publisher
        };
        const response = await fetch(`/api/dev/presets/${encodeURIComponent(saved.slug)}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(saved)
        });

        if (!response.ok) {
            toast({
                title: `Could not save ${saved.name}`,
                description: (await response.text()) || 'The dev server rejected the preset.',
                type: 'error',
                duration: 3200
            });

            return;
        }

        baseTheme = { ...saved };
        toast({
            title: `${saved.name} saved`,
            description: 'Wrote the preset to builtin-presets.ts.',
            type: 'success',
            duration: 2200
        });
    }

    function runDashboardAction(
        title: string,
        description: string,
        type: 'success' | 'error' = 'success'
    ) {
        toast({ title, description, type, duration: 1800 });
    }

    function invoiceBadgeVariant(status: InvoiceStatus) {
        if (status === 'Paid') {
            return 'success';
        }
        if (status === 'Overdue') {
            return 'error';
        }
        if (status === 'Due soon') {
            return 'warning';
        }
        return 'secondary';
    }

    function toggleSelectAll(next: boolean) {
        for (const invoice of pagedInvoices) {
            selectedInvoices[invoice.reference] = next;
        }
    }

    function markInvoicePaid(reference: string) {
        invoices = invoices.map((invoice) =>
            invoice.reference === reference ? { ...invoice, status: 'Paid' } : invoice
        );
        runDashboardAction('Payment recorded', `${reference} is marked paid.`);
    }

    function createInvoice() {
        const client = newInvoiceCustomer.trim();
        if (client === '') {
            runDashboardAction(
                'Customer is required',
                'Add a customer name to draft the invoice.',
                'error'
            );
            invoiceModalOpen = true;
            return;
        }

        const nextNumber = 2300 + invoices.length;
        const reference = `INV-${nextNumber}`;
        const initials = client
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

        invoices = [
            {
                client,
                initials,
                reference,
                due: 'Sep 30',
                amount: '$0',
                status: 'Draft'
            },
            ...invoices
        ];
        selectedInvoices[reference] = false;
        newInvoiceCustomer = '';
        newInvoiceNotes = '';
        invoiceModalOpen = false;
        studioView = 'invoices';
        invoicePage = 1;
        runDashboardAction('Invoice drafted', `${reference} is in the queue.`);
    }

    function markNotificationRead(id: string) {
        notifications = notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
        );
    }

    $effect(() => {
        invoiceQuery;
        invoiceStatus;
        invoicePage = 1;
    });

    $effect(() => {
        if (invoicePage > invoicePageCount) {
            invoicePage = invoicePageCount;
        }
    });

    onMount(() => {
        const storedDraft = readStoredDraft();
        if (storedDraft) {
            applyDraft(storedDraft);
        }
        editTokens = readEditTokens();
        history = createHistory(currentSnapshot());
        hydrated = true;
        const requestedTheme = page.url.searchParams.get('theme');
        if (requestedTheme) {
            void loadRegistryTheme(requestedTheme);
        }
        const root = document.documentElement;
        appliedDark = root.classList.contains('dark');
        const observer = new MutationObserver(() => {
            appliedDark = root.classList.contains('dark');
        });
        observer.observe(root, { attributes: true, attributeFilter: ['class'] });
        window.addEventListener('storage', syncEditTokens);

        return () => {
            observer.disconnect();
            window.removeEventListener('storage', syncEditTokens);
            clearTimeout(themeSwapTimer);
            cancelAnimationFrame(themeSwapFrame);
            document.documentElement.removeAttribute('data-theme-swap');
        };
    });

    $effect(() => {
        if (selectedPreset === previousPreset) return;
        const nextPreset = selectedPreset;
        if (dirty) {
            pendingPreset = nextPreset;
            selectedPreset = previousPreset;
            presetDialogOpen = true;
            return;
        }
        previousPreset = nextPreset;
        applyPreset(nextPreset);
    });

    $effect(() => {
        if (!hydrated) {
            previousRadius = theme.radius;
            previousDensity = theme.density;
            previousMotion = theme.motion;
            return;
        }
        const radiusChanged = theme.radius !== previousRadius;
        const densityChanged = theme.density !== previousDensity;
        const motionChanged = theme.motion !== previousMotion;
        if (!radiusChanged && !densityChanged && !motionChanged) {
            return;
        }
        previousRadius = theme.radius;
        previousDensity = theme.density;
        previousMotion = theme.motion;
        const nextSpacing = { ...advancedTokens.spacing };
        const nextAnimation = { ...advancedTokens.animation };
        let changed = false;
        if (radiusChanged) {
            for (const name of radiusTokenNames) {
                if (nextSpacing[name]?.trim()) {
                    delete nextSpacing[name];
                    changed = true;
                }
            }
        }
        if (densityChanged && nextSpacing['--sivir-space-unit']?.trim()) {
            delete nextSpacing['--sivir-space-unit'];
            changed = true;
        }
        if (motionChanged) {
            for (const name of motionDurationTokenNames) {
                if (nextAnimation[name]?.trim()) {
                    delete nextAnimation[name];
                    changed = true;
                }
            }
        }
        if (changed) {
            advancedTokens = { ...advancedTokens, spacing: nextSpacing, animation: nextAnimation };
        }
    });

    $effect(() => {
        if (selectedSans === previousSans) return;
        previousSans = selectedSans;
        const selected = sansFonts.find((font) => font.key === selectedSans);
        if (selected) theme = { ...theme, fontSans: selected.value };
    });

    $effect(() => {
        if (selectedHeader === previousHeader) return;
        previousHeader = selectedHeader;
        const selected = headerFonts.find((font) => font.key === selectedHeader);
        if (selected) theme = { ...theme, fontHeader: selected.value };
    });

    $effect(() => {
        if (selectedMono === previousMono) return;
        previousMono = selectedMono;
        const selected = monoFonts.find((font) => font.key === selectedMono);
        if (selected) theme = { ...theme, fontMono: selected.value };
    });

    $effect(() => {
        if (!hydrated) return;
        const css = previewedPreset ? themeToCss(previewedPreset) : generatedCss;
        const animate = untrack(() => {
            const pending = themeSwapPending;
            themeSwapPending = false;

            return pending;
        });

        document.documentElement.style.removeProperty('--font-sans');
        crossfadeTheme(() => {
            applyLiveThemeCss(css);
        }, animate);
        untrack(() => {
            liveCssVersion += 1;
        });
        saveStudioDraft(portableTheme);
    });

    $effect(() => {
        if (!hydrated) {
            return;
        }

        studioDraft;
        baseTheme;
        untrack(() => {
            clearTimeout(historyTimer);
            historyTimer = setTimeout(flushHistory, 400);
        });

        return () => {
            clearTimeout(historyTimer);
        };
    });

    type TokenEditSection = {
        id: string;
        label: string;
        rows: TokenRow[];
    };

    const allTokenRows: TokenRow[] = [
        ...colorRowGroups,
        ...spacingRowGroups,
        ...animationRowGroups,
        ...detailRowGroups
    ].flatMap((group) => group.rows);
    const editableTokenNames = new Set(allTokenRows.map((row) => row.definition.name));

    let previewFrame = $state<HTMLElement>();
    let tokenEditMode = $state(false);
    let tokenEditOpen = $state(false);
    let tokenEditTarget = $state<Element | null>(null);
    let tokenEditHover = $state<Element | null>(null);
    let tokenEditHighlight = $state<Element[]>([]);
    let tokenIndex: TokenIndex | null = null;
    let tokenIndexKey = '';

    const tokenEditParent = $derived.by(() => {
        const parent = tokenEditTarget?.parentElement;

        if (!parent || !previewFrame || parent === previewFrame) {
            return null;
        }

        return componentRoot(parent);
    });
    const tokenEditSections = $derived.by((): TokenEditSection[] => {
        if (!tokenEditOpen || !tokenEditTarget) {
            return [];
        }

        const used = tokensForElement(currentTokenIndex(), tokenEditTarget);
        const placed = new Set<string>();
        const sections = tokenSections.flatMap((section) => {
            const rows = section.groups
                .flatMap((group) => group.rows)
                .filter((row) => used.has(row.definition.name));

            for (const row of rows) {
                placed.add(row.definition.name);
            }

            return rows.length > 0 ? [{ id: section.id, label: section.shortLabel, rows }] : [];
        });
        const otherRows = allTokenRows.filter((row) => {
            return used.has(row.definition.name) && !placed.has(row.definition.name);
        });

        return otherRows.length > 0
            ? [...sections, { id: 'other', label: 'Other', rows: otherRows }]
            : sections;
    });
    const tokenEditOverrides = $derived.by(() => {
        void liveCssVersion;

        return tokenEditSections
            .flatMap((section) => section.rows)
            .filter((row) => {
                return tokenOverride(row) !== '';
            });
    });
    const tokenEditOutline = $derived(tokenEditHighlight);
    const tokenEditFocus = $derived.by(() => {
        if (tokenEditOpen && tokenEditTarget) {
            return tokenEditTarget;
        }

        return tokenEditMode ? tokenEditHover : null;
    });

    function currentTokenIndex() {
        const liveSheet = document.getElementById(
            'sivir-live-theme-style'
        ) as HTMLStyleElement | null;
        const liveRuleCount = liveSheet?.sheet?.cssRules.length ?? 0;
        const liveAliasCount = liveSheet?.textContent?.split('var(').length ?? 0;
        const key = `${document.styleSheets.length}:${liveRuleCount}:${liveAliasCount}`;

        if (!tokenIndex || key !== tokenIndexKey) {
            tokenIndex = buildTokenIndex(
                collectRuleInputs(document.styleSheets),
                editableTokenNames
            );
            tokenIndexKey = key;
        }

        return tokenIndex;
    }

    function tokenUsageCount(name: string) {
        if (!previewFrame) {
            return 0;
        }

        return elementsUsingToken(currentTokenIndex(), name, previewFrame).length;
    }

    function tokenUsageLabel(row: TokenRow) {
        const count = tokenUsageCount(row.definition.name);

        return count === 1 ? 'Used once' : `Used ${count} times`;
    }

    function highlightTokenUsage(name: string | null) {
        if (!name || !previewFrame) {
            tokenEditHighlight = [];
            return;
        }

        tokenEditHighlight = elementsUsingToken(currentTokenIndex(), name, previewFrame);
    }

    function componentRoot(element: Element) {
        const root = element.closest('[data-ui]');

        return root && previewFrame?.contains(root) ? root : element;
    }

    function elementName(element: Element) {
        const ui = element.getAttribute('data-ui');

        if (!ui) {
            return element.tagName.toLowerCase();
        }

        const words = ui.replaceAll('-', ' ');

        return words.charAt(0).toUpperCase() + words.slice(1);
    }

    function elementPeers(element: Element) {
        const ui = element.getAttribute('data-ui');

        if (!ui || !previewFrame) {
            return 1;
        }

        const variant = element.getAttribute('data-variant');
        const selector = variant
            ? `[data-ui="${CSS.escape(ui)}"][data-variant="${CSS.escape(variant)}"]`
            : `[data-ui="${CSS.escape(ui)}"]`;

        return previewFrame.querySelectorAll(selector).length;
    }

    function elementDetail(element: Element) {
        const variant = element.getAttribute('data-variant');
        const count = `${elementPeers(element)} on screen`;

        return variant ? `${variant} · ${count}` : count;
    }

    function elementChip(element: Element) {
        const variant = element.getAttribute('data-variant');
        const name = elementName(element);

        return variant ? `${name} · ${variant}` : name;
    }

    function selectTokenEditParent() {
        if (tokenEditParent) {
            tokenEditTarget = tokenEditParent;
            tokenEditHighlight = [];
        }
    }

    function resetTokenEditOverrides() {
        for (const row of tokenEditOverrides) {
            resetTokenRow(row);
        }
    }

    function setTokenEditMode(next: boolean) {
        tokenEditMode = next;
        tokenEditHover = null;
        tokenEditHighlight = [];

        if (!next) {
            tokenEditOpen = false;
            tokenEditTarget = null;
        }
    }

    function trackTokenEditHover(event: PointerEvent) {
        if (!tokenEditMode || tokenEditOpen) {
            return;
        }

        tokenEditHover = event.target instanceof Element ? componentRoot(event.target) : null;
    }

    function suppressTokenEditPointer(event: MouseEvent) {
        if (!tokenEditMode || event.button !== 0) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
    }

    function openTokenEditor(event: MouseEvent) {
        if (!tokenEditMode || !(event.target instanceof Element)) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        tokenEditTarget = componentRoot(event.target);
        tokenEditHighlight = [];
        tokenEditOpen = true;
    }

    function closeTokenEditor() {
        tokenEditOpen = false;
        tokenEditHighlight = [];
        tokenEditHover = null;
    }

    function paletteValue(name: string) {
        void liveCssVersion;

        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    type PaletteGroup = {
        heading: string;
        sectionId: string;
        sectionLabel: string;
        groupLabel: string;
        rows: TokenRow[];
    };

    let paletteComponents = $state<Map<string, string[]>>(new Map());

    function tokenComponentNames(name: string) {
        if (!previewFrame) {
            return [];
        }

        const names = new Set<string>();

        for (const element of elementsUsingToken(currentTokenIndex(), name, previewFrame)) {
            const root = componentRoot(element);

            if (root.hasAttribute('data-ui')) {
                names.add(elementName(root));
            }
        }

        return [...names];
    }

    function pluralize(name: string) {
        if (/(s|x|ch|sh)$/i.test(name)) {
            return `${name}es`;
        }

        return `${name}s`;
    }

    function paletteUsageLabel(row: TokenRow) {
        const names = paletteComponents.get(row.definition.name) ?? [];

        if (names.length === 0) {
            return tokenUsageLabel(row);
        }

        const shown = names.slice(0, 4).map((name, index) => {
            const plural = pluralize(name);

            return index === 0 ? plural : plural.toLowerCase();
        });
        const extra = names.length - shown.length;

        return extra > 0 ? `${shown.join(', ')} +${extra}` : shown.join(', ');
    }

    function paletteRowMatches(row: TokenRow, query: string) {
        if (tokenRowMatches(row, query)) {
            return true;
        }

        const names = paletteComponents.get(row.definition.name) ?? [];

        return names.some((name) => {
            return name.toLowerCase().includes(query);
        });
    }

    const paletteGroups = $derived.by<PaletteGroup[]>(() => {
        const query = paletteQuery.trim().toLowerCase();

        return tokenSections.flatMap((section) => {
            return section.groups
                .map((group) => {
                    const rows = group.rows.filter((row) => {
                        return (
                            query === '' ||
                            section.label.toLowerCase().includes(query) ||
                            paletteRowMatches(row, query)
                        );
                    });

                    return {
                        heading: `${section.shortLabel} · ${group.label}`,
                        sectionId: section.id,
                        sectionLabel: section.shortLabel,
                        groupLabel: group.label,
                        rows
                    };
                })
                .filter((group) => {
                    return group.rows.length > 0;
                });
        });
    });
    const paletteRows = $derived(
        paletteGroups.flatMap((group) => {
            return group.rows;
        })
    );
    const paletteActiveRow = $derived(
        paletteRows.find((row) => {
            return row.definition.name === paletteActiveName;
        }) ?? null
    );
    const paletteActiveGroup = $derived(
        paletteGroups.find((group) => {
            return group.rows.some((row) => {
                return row.definition.name === paletteActiveName;
            });
        }) ?? null
    );

    async function openTokenPalette() {
        paletteQuery = '';
        paletteRowName = null;
        paletteActiveName = allTokenRows[0]?.definition.name ?? null;
        tokenPaletteOpen = true;

        await tick();

        const components = new Map<string, string[]>();

        for (const row of allTokenRows) {
            components.set(row.definition.name, tokenComponentNames(row.definition.name));
        }

        paletteComponents = components;
    }

    function movePaletteActive(offset: number) {
        if (paletteRows.length === 0) {
            return;
        }
        const index = paletteRows.findIndex((row) => {
            return row.definition.name === paletteActiveName;
        });
        const next = paletteRows[(index + offset + paletteRows.length) % paletteRows.length];
        paletteActiveName = next.definition.name;
        document.getElementById(`palette-${next.definition.name}`)?.scrollIntoView({
            block: 'nearest'
        });
    }

    async function togglePaletteRow(name: string) {
        paletteActiveName = name;

        if (paletteRowName === name) {
            paletteRowName = null;
            paletteInput?.focus();
            return;
        }

        paletteRowName = name;

        await tick();

        document
            .querySelector<HTMLElement>(
                '[data-palette-editor] :is(input, button, [role="slider"], [tabindex="0"])'
            )
            ?.focus({
                preventScroll: true
            });
    }

    function paletteEditorMotion(duration: number) {
        return {
            duration: prefersReducedMotion.current ? 0 : duration,
            easing: quintOut
        };
    }

    function openPaletteRowInSection(group: PaletteGroup) {
        tokenPaletteOpen = false;
        void openTokens(group.sectionId, group.groupLabel);
    }

    function handlePaletteKeydown(event: KeyboardEvent) {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            movePaletteActive(1);
            return;
        }
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            movePaletteActive(-1);
            return;
        }
        if (event.key === 'Enter' && event.shiftKey && paletteActiveGroup) {
            event.preventDefault();
            openPaletteRowInSection(paletteActiveGroup);
            return;
        }
        if (event.key === 'Enter' && paletteActiveName) {
            event.preventDefault();
            void togglePaletteRow(paletteActiveName);
            return;
        }
        if (
            event.key === 'Backspace' &&
            (event.metaKey || event.ctrlKey) &&
            paletteActiveRow &&
            tokenOverride(paletteActiveRow) !== ''
        ) {
            event.preventDefault();
            resetTokenRow(paletteActiveRow);
        }
    }

    function paletteGlyph(row: TokenRow) {
        const group = row.definition.group;

        if (['Type scale', 'Line height', 'Letter spacing'].includes(group)) {
            return TypeIcon;
        }
        if (['Speed', 'Movement'].includes(group)) {
            return Timer;
        }
        if (group === 'Easing') {
            return Spline;
        }
        if (['Spacing', 'Controls'].includes(group)) {
            return Ruler;
        }
        if (group === 'Overlay') {
            return Layers;
        }
        if (group === 'Code') {
            return Code;
        }

        return SquareDashed;
    }

    function applyGalleryPreset(slug: string) {
        previewPresetSlug = null;
        presetsOpen = false;
        selectedPreset = slug;
    }

    function handleHistoryShortcut(event: KeyboardEvent) {
        if (!(event.metaKey || event.ctrlKey) || event.altKey) {
            return;
        }

        const key = event.key.toLowerCase();
        const isUndo = key === 'z' && !event.shiftKey;
        const isRedo = (key === 'z' && event.shiftKey) || (key === 'y' && !event.shiftKey);
        if (!isUndo && !isRedo) {
            return;
        }

        const target = event.target;
        if (
            target instanceof Element &&
            target.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]')
        ) {
            return;
        }

        event.preventDefault();
        if (isUndo) {
            undo();
            return;
        }

        redo();
    }

    function handleStudioShortcut(event: KeyboardEvent) {
        handleHistoryShortcut(event);
        if (
            event.key.toLowerCase() !== 'k' ||
            !(event.metaKey || event.ctrlKey) ||
            !event.shiftKey
        ) {
            return;
        }
        event.preventDefault();
        void openTokenPalette();
    }

    function handleTokenEditKeydown(event: KeyboardEvent) {
        handleStudioShortcut(event);
        if (event.key !== 'Escape' || !tokenEditMode) {
            return;
        }

        if (
            event.target instanceof Element &&
            event.target.closest('[role="dialog"], [role="listbox"], [role="menu"]')
        ) {
            return;
        }

        if (tokenEditOpen) {
            closeTokenEditor();
            return;
        }

        setTokenEditMode(false);
    }
</script>

<svelte:window onkeydown={handleTokenEditKeydown} />

<svelte:head>
    <title>Sivir · Studio</title>
    <meta name="description" content="Build, preview, and export a Sivir theme." />
</svelte:head>

{#snippet presetDots(preset: Theme)}
    {@const swatch = presetSwatch(preset, appMode)}
    <span class="flex shrink-0 -space-x-1" aria-hidden="true">
        <span
            class="size-3 rounded-full border border-foreground/15"
            style:background-color={swatch.background}
        ></span>
        <span
            class="size-3 rounded-full border border-foreground/15"
            style:background-color={swatch.foreground}
        ></span>
        <span
            class="size-3 rounded-full border border-foreground/15"
            style:background-color={swatch.brand}
        ></span>
    </span>
{/snippet}

{#snippet sectionHeading(title: string)}
    <h2 class="m-0 text-[13px] font-medium text-foreground">{title}</h2>
{/snippet}

{#snippet feelSelect(
    label: string,
    value: string,
    options: readonly string[],
    onChange: (value: string) => void
)}
    <Select.Root
        {value}
        onValueChange={(next) => {
            onChange(next);
        }}
    >
        <SelectFieldTrigger {label}>{formatChoice(value)}</SelectFieldTrigger>
        <Select.Content class="min-w-[max(16rem,var(--popover-trigger-width))]">
            {#each options as option (option)}
                <Select.Item value={option} label={formatChoice(option)}>
                    {formatChoice(option)}
                </Select.Item>
            {/each}
            {#if !options.includes(value)}
                <Select.Item {value} label={formatChoice(value)}>
                    {formatChoice(value)}
                </Select.Item>
            {/if}
        </Select.Content>
    </Select.Root>
{/snippet}

{#snippet weightField(label: string, value: FontWeight, onChange: (value: FontWeight) => void)}
    <Slider.Root
        editable
        value={Number(value)}
        min={400}
        max={700}
        step={100}
        label={`${label} weight`}
        onValueChange={(next) => {
            const weight = String(next);

            if (isFontWeight(weight)) {
                onChange(weight);
            }
        }}
        class="min-h-[34px] text-[13px]"
    >
        <Slider.Range />
        <Slider.Thumb />
        <Slider.Label>{label}</Slider.Label>
        <Slider.Value class="text-xs" />
    </Slider.Root>
{/snippet}

{#snippet radiusSlider()}
    {@const changed = cornerRadiusChanged()}
    <Slider.Root
        editable
        value={cornerRadius()}
        min={0}
        max={24}
        step={1}
        label="Radius"
        format={formatPx}
        onValueChange={setCornerRadius}
        class="min-h-[34px] text-[13px]"
    >
        <Slider.Range />
        <Slider.Thumb />
        <Slider.Label class="flex items-center gap-1.5">
            <span class="truncate">Radius</span>
            <ChangedDot {changed} />
        </Slider.Label>
        <span class="relative z-[1] flex shrink-0 items-center gap-2">
            {#if changed}
                <button
                    type="button"
                    class="rounded-[var(--radius-sm)] text-xs text-foreground-muted transition-colors [transition-duration:var(--motion-duration-hover)] hover:cursor-[var(--ui-cursor-interactive)] hover:text-foreground focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
                    aria-label="Reset Radius"
                    transition:fade={{ duration: 120 }}
                    onpointerdown={(event) => {
                        event.stopPropagation();
                    }}
                    onclick={(event) => {
                        event.preventDefault();
                        resetCornerRadius();
                    }}
                >
                    Reset
                </button>
            {/if}
            <Slider.Value class="text-xs" />
        </span>
    </Slider.Root>
{/snippet}

{#snippet tokenMeta(row: TokenRow)}
    <button
        type="button"
        class="absolute -top-2 right-2 z-10 rounded-full border-[length:var(--border-size)] border-[var(--color-border)] bg-[var(--color-card)] px-2 text-[11px] leading-4 text-foreground-muted transition-colors [transition-duration:var(--motion-duration-hover)] hover:cursor-[var(--ui-cursor-interactive)] hover:text-foreground focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
        aria-label={`Reset ${row.definition.label}`}
        transition:fade={{ duration: 120 }}
        onclick={() => {
            resetTokenRow(row);
        }}
    >
        Reset
    </button>
{/snippet}

{#snippet tokenResetButton(row: TokenRow)}
    <button
        type="button"
        class="ml-auto shrink-0 rounded-[var(--radius-sm)] text-xs text-foreground-muted transition-colors [transition-duration:var(--motion-duration-hover)] hover:cursor-[var(--ui-cursor-interactive)] hover:text-foreground focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
        aria-label={`Reset ${row.definition.label}`}
        onclick={() => {
            resetTokenRow(row);
        }}
    >
        Reset
    </button>
{/snippet}

{#snippet tokenRow(row: TokenRow, label?: string)}
    {@const changed = tokenOverride(row) !== ''}
    {@const slider = tokenSlider(row)}
    {@const isShadow = row.bucket === 'detail' && row.definition.kind === 'shadow'}
    <div class={`relative flex min-w-0 flex-col ${isShadow ? 'gap-1 pb-5' : ''}`}>
        {#if row.bucket === 'color'}
            {@const definition = row.definition}
            {@const resolved = resolveColorToken(definition)}
            {#if colorTokenHasAlpha(definition, resolved.alpha)}
                <ColorAlphaField
                    label={definition.label}
                    hex={resolved.hex}
                    alpha={resolved.alpha}
                    {changed}
                    onChange={(hex, alpha) => {
                        updateAdvancedColorToken(definition.name, formatCssColor(hex, alpha));
                    }}
                />
            {:else}
                <ColorField
                    label={definition.label}
                    value={resolved.hex}
                    {changed}
                    onChange={(hex) => {
                        updateAdvancedColorToken(
                            definition.name,
                            formatCssColor(hex, resolved.alpha)
                        );
                    }}
                />
            {/if}
        {:else if row.bucket === 'animation' && row.definition.kind === 'origin'}
            {@const definition = row.definition}
            {@const origin = resolveAnimationRaw(definition).replace(/\s+/g, ' ')}
            <Select.Root
                value={origin}
                onValueChange={(value) => {
                    updateAdvancedAnimationToken(definition.name, value);
                }}
            >
                <SelectFieldTrigger label={label ?? definition.label} {changed}>
                    {originOptions.find((option) => option.value === origin)?.label ?? 'Custom'}
                </SelectFieldTrigger>
                <Select.Content class="min-w-[max(12rem,var(--popover-trigger-width))]">
                    {#each originOptions as option (option.value)}
                        <Select.Item value={option.value} label={option.label}>
                            {option.label}
                        </Select.Item>
                    {/each}
                    {#if !originOptions.some((option) => option.value === origin)}
                        <Select.Item value={origin} label="Custom">Custom</Select.Item>
                    {/if}
                </Select.Content>
            </Select.Root>
        {:else if row.bucket === 'animation' && row.definition.kind === 'ease'}
            {@const definition = row.definition}
            {@const ease = animationEaseValue(definition)}
            <Select.Root
                value={ease}
                onValueChange={(value) => {
                    updateAdvancedAnimationToken(definition.name, value);
                }}
            >
                <SelectFieldTrigger label={definition.label} {changed}>
                    {easingOptions.find((option) => option.value === ease)?.label ?? 'Custom'}
                </SelectFieldTrigger>
                <Select.Content class="min-w-[max(16rem,var(--popover-trigger-width))]">
                    {#each easingOptions as option (option.value)}
                        <Select.Item value={option.value} label={option.label}>
                            {option.label}
                        </Select.Item>
                    {/each}
                    {#if !easingOptions.some((option) => normalizeEase(option.value) === normalizeEase(ease))}
                        <Select.Item value={ease} label="Custom">Custom</Select.Item>
                    {/if}
                </Select.Content>
            </Select.Root>
        {:else if row.bucket === 'detail' && row.definition.kind === 'shadow'}
            {@const definition = row.definition}
            {@const disabledByChrome = chromeShadowValue(definition.name) !== null}
            <div class="flex min-h-7 min-w-0 items-center gap-2">
                <span class="flex shrink-0 items-center gap-1.5 text-[13px] text-foreground">
                    {definition.label}
                    <ChangedDot {changed} />
                </span>
                <span class="truncate font-mono text-xs text-foreground-muted">
                    {definition.name}
                </span>
                {#if changed}
                    {@render tokenResetButton(row)}
                {/if}
            </div>
            <div inert={disabledByChrome} class={disabledByChrome ? 'opacity-50' : undefined}>
                <ShadowField
                    label={definition.label}
                    value={resolveDetailRaw(definition)}
                    resolveVar={resolveTokenRaw}
                    onChange={(value) => {
                        updateDetailToken(definition, value);
                    }}
                />
            </div>
        {:else if slider}
            <Slider.Root
                editable
                value={slider.value}
                min={slider.min}
                max={slider.max}
                step={slider.step}
                label={label ?? row.definition.label}
                format={slider.format}
                onValueChange={slider.commit}
                class="min-h-[34px] text-[13px]"
            >
                <Slider.Range />
                <Slider.Thumb />
                <Slider.Label class="flex items-center gap-1.5">
                    <span class="truncate">{label ?? row.definition.label}</span>
                    <ChangedDot {changed} />
                </Slider.Label>
                <span class="relative z-[1] flex shrink-0 items-center gap-2">
                    {#if changed}
                        <button
                            type="button"
                            class="rounded-[var(--radius-sm)] text-xs text-foreground-muted transition-colors [transition-duration:var(--motion-duration-hover)] hover:cursor-[var(--ui-cursor-interactive)] hover:text-foreground focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
                            aria-label={`Reset ${label ?? row.definition.label}`}
                            transition:fade={{ duration: 120 }}
                            onpointerdown={(event) => {
                                event.stopPropagation();
                            }}
                            onclick={(event) => {
                                event.preventDefault();
                                resetTokenRow(row);
                            }}
                        >
                            Reset
                        </button>
                    {/if}
                    <Slider.Value class="text-xs" />
                </span>
            </Slider.Root>
        {/if}
        {#if changed && !isShadow && !slider}
            {@render tokenMeta(row)}
        {/if}
    </div>
{/snippet}

{#snippet tokenEditRow(row: TokenRow)}
    {@render tokenRow(row)}
{/snippet}

{#snippet colorSection(
    title: string,
    fields: {
        label: string;
        value: string;
        options: { label: string; value: string }[];
        onChange: (value: string) => void;
    }[]
)}
    <section class="flex flex-col gap-2">
        {@render sectionHeading(title)}
        <div class="flex flex-col gap-1.5">
            {#each fields as field (field.label)}
                <ColorField
                    label={field.label}
                    value={field.value}
                    options={field.options}
                    onChange={field.onChange}
                />
            {/each}
        </div>
    </section>
{/snippet}

{#snippet inspector()}
    <div class="flex h-full min-h-0 flex-col">
        <Tabs.Root bind:value={inspectorTab} variant="default" class="flex min-h-0 flex-1 flex-col">
            <Tabs.List class="w-full shrink-0">
                <Tabs.Trigger value="color" class="flex-1">Color</Tabs.Trigger>
                <Tabs.Trigger value="type" class="flex-1">Type</Tabs.Trigger>
                <Tabs.Trigger value="feel" class="flex-1">Feel</Tabs.Trigger>
                <Tabs.Trigger value="tokens" class="flex-1">Tokens</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="color" class="min-h-0 flex-1">
                <ScrollArea class="hide-scrollbar-all -mx-3 h-full min-h-0" showCues={false}>
                    <div class="flex flex-col gap-7 px-3 pt-4 pb-6">
                        {@render colorSection('Brand', [
                            {
                                label: 'Brand',
                                value: brandColors[appMode],
                                options: brandSwatches,
                                onChange: updateBrand
                            },
                            {
                                label: 'On brand',
                                value: foundationColors[appMode].onPrimary,
                                options: onPrimarySwatches,
                                onChange: (value) => {
                                    updateFoundationColor('onPrimary', value);
                                }
                            }
                        ])}
                        {@render colorSection('Surfaces', [
                            {
                                label: 'Background',
                                value: foundationColors[appMode].background,
                                options: backgroundSwatches,
                                onChange: (value) => {
                                    updateFoundationColor('background', value);
                                }
                            },
                            {
                                label: 'Base',
                                value: foundationColors[appMode].base,
                                options: baseSwatches,
                                onChange: (value) => {
                                    updateFoundationColor('base', value);
                                }
                            },
                            {
                                label: 'Secondary',
                                value: foundationColors[appMode].secondary,
                                options: secondarySwatches,
                                onChange: (value) => {
                                    updateFoundationColor('secondary', value);
                                }
                            },
                            {
                                label: 'Border',
                                value: foundationColors[appMode].border,
                                options: borderSwatches,
                                onChange: (value) => {
                                    updateFoundationColor('border', value);
                                }
                            }
                        ])}
                        {@render colorSection('Text', [
                            {
                                label: 'Foreground',
                                value: foundationColors[appMode].foreground,
                                options: foregroundSwatches,
                                onChange: (value) => {
                                    updateFoundationColor('foreground', value);
                                }
                            },
                            {
                                label: 'Muted text',
                                value: foundationColors[appMode].foregroundMuted,
                                options: foregroundSwatches,
                                onChange: (value) => {
                                    updateFoundationColor('foregroundMuted', value);
                                }
                            },
                            {
                                label: 'Button text',
                                value: foundationColors[appMode].buttonForeground,
                                options: foregroundSwatches,
                                onChange: (value) => {
                                    updateFoundationColor('buttonForeground', value);
                                }
                            }
                        ])}
                        <Button
                            variant="ghost"
                            size="sm"
                            class="self-start px-3 text-[13px] text-foreground-muted"
                            onclick={() => {
                                openTokens('color');
                            }}
                        >
                            All color tokens
                        </Button>
                    </div>
                </ScrollArea>
            </Tabs.Content>

            <Tabs.Content value="type" class="min-h-0 flex-1">
                <ScrollArea class="hide-scrollbar-all -mx-3 h-full min-h-0" showCues={false}>
                    <div class="flex flex-col gap-7 px-3 pt-4 pb-6">
                        <section class="flex flex-col gap-2">
                            {@render sectionHeading('Fonts')}
                            <div class="flex flex-col gap-1.5">
                                <Select.Root bind:value={selectedSans}>
                                    <SelectFieldTrigger label="Body">
                                        {sansFonts.find((font) => font.key === selectedSans)?.label}
                                    </SelectFieldTrigger>
                                    <Select.Content
                                        class="max-h-56 min-w-[max(16rem,var(--popover-trigger-width))]"
                                    >
                                        <Select.Label>Sans serif</Select.Label>
                                        {#each sansFonts as font (font.key)}
                                            <Select.Item value={font.key} label={font.label}>
                                                {font.label}
                                            </Select.Item>
                                        {/each}
                                    </Select.Content>
                                </Select.Root>
                                <Select.Root bind:value={selectedHeader}>
                                    <SelectFieldTrigger label="Headings">
                                        <span
                                            style:font-family={headerFonts.find(
                                                (font) => font.key === selectedHeader
                                            )?.value}
                                        >
                                            {headerFonts.find((font) => font.key === selectedHeader)
                                                ?.label}
                                        </span>
                                    </SelectFieldTrigger>
                                    <Select.Content
                                        class="max-h-56 min-w-[max(16rem,var(--popover-trigger-width))]"
                                    >
                                        <Select.Item value="same-as-sans" label="Same as sans">
                                            <span style:font-family="var(--font-sans)">
                                                Same as sans
                                            </span>
                                        </Select.Item>
                                        <Select.Label>Serif</Select.Label>
                                        {#each serifFonts as font (font.key)}
                                            <Select.Item value={font.key} label={font.label}>
                                                <span style:font-family={font.value}>
                                                    {font.label}
                                                </span>
                                            </Select.Item>
                                        {/each}
                                        <Select.Label>Sans serif</Select.Label>
                                        {#each sansFonts as font (font.key)}
                                            <Select.Item value={font.key} label={font.label}>
                                                <span style:font-family={font.value}>
                                                    {font.label}
                                                </span>
                                            </Select.Item>
                                        {/each}
                                    </Select.Content>
                                </Select.Root>
                                <Select.Root bind:value={selectedMono}>
                                    <SelectFieldTrigger label="Code">
                                        <span class="font-mono text-xs">
                                            {monoFonts.find((font) => font.key === selectedMono)?.label}
                                        </span>
                                    </SelectFieldTrigger>
                                    <Select.Content
                                        class="h-56 min-w-[max(16rem,var(--popover-trigger-width))]"
                                    >
                                        <Select.Label>Mono</Select.Label>
                                        {#each monoFonts as font (font.key)}
                                            <Select.Item value={font.key} label={font.label}>
                                                {font.label}
                                            </Select.Item>
                                        {/each}
                                    </Select.Content>
                                </Select.Root>
                            </div>
                        </section>

                        <section class="flex flex-col gap-2">
                            {@render sectionHeading('Size')}
                            <Slider.Root
                                editable
                                bind:value={headerSize}
                                min={HEADER_SIZE_RANGE.min}
                                max={HEADER_SIZE_RANGE.max}
                                step={1}
                                label="Heading size"
                                format={formatPixels}
                                class="min-h-[34px] text-[13px]"
                            >
                                <Slider.Range />
                                <Slider.Thumb />
                                <Slider.Label>Headings</Slider.Label>
                                <Slider.Value class="text-xs" />
                            </Slider.Root>
                        </section>

                        <section class="flex flex-col gap-2">
                            {@render sectionHeading('Weight')}
                            <div class="flex flex-col gap-1.5">
                                {@render weightField('Headings', headerWeight, (value) => {
                                    headerWeight = value;
                                })}
                                {@render weightField('Body', roleWeights.body, (value) => {
                                    updateRoleWeight('body', value);
                                })}
                                {@render weightField('Labels', roleWeights.label, (value) => {
                                    updateRoleWeight('label', value);
                                })}
                                {@render weightField('Buttons', roleWeights.button, (value) => {
                                    updateRoleWeight('button', value);
                                })}
                                {@render weightField('Badges', roleWeights.badge, (value) => {
                                    updateRoleWeight('badge', value);
                                })}
                                {@render weightField(
                                    'Descriptions',
                                    roleWeights.description,
                                    (value) => {
                                        updateRoleWeight('description', value);
                                    }
                                )}
                            </div>
                        </section>
                    </div>
                </ScrollArea>
            </Tabs.Content>

            <Tabs.Content value="feel" class="min-h-0 flex-1">
                <ScrollArea class="hide-scrollbar-all -mx-3 h-full min-h-0" showCues={false}>
                    <div class="flex flex-col gap-7 px-3 pt-4 pb-6">
                        <section class="flex flex-col gap-2">
                            {@render sectionHeading('Scale')}
                            <div class="flex flex-col gap-1.5">
                                {@render radiusSlider()}
                                {#if densityRow}
                                    {@render tokenRow(densityRow, 'Density')}
                                {/if}
                                {@render feelSelect(
                                    'Movement',
                                    theme.motion,
                                    movementPresets,
                                    (value) => {
                                        if (isMotionFeel(value)) {
                                            theme = { ...theme, motion: value };
                                        }
                                    }
                                )}
                            </div>
                        </section>

                        {#each feelMotionGroups as group (group.title)}
                            <section class="flex flex-col gap-2">
                                {@render sectionHeading(group.title)}
                                <div class="flex flex-col gap-1.5">
                                    {#each group.fields as field (field.row.definition.name)}
                                        {@render tokenRow(field.row, field.label)}
                                    {/each}
                                </div>
                            </section>
                        {/each}

                        <section class="flex flex-col gap-2">
                            {@render sectionHeading('Depth')}
                            <div class="flex flex-col gap-1.5">
                                <SwitchField
                                    bind:checked={surfaceShadows}
                                    label="Card & menu shadows"
                                    description="Lift on cards, selects, dropdowns, and popovers."
                                />
                                <SwitchField
                                    bind:checked={controlShadows}
                                    label="Control shadows"
                                    description="Depth on inputs, buttons, and alerts."
                                />
                                <SwitchField
                                    bind:checked={dialogShadows}
                                    label="Dialog shadows"
                                    description="Lift on modals and sheets."
                                />
                                <SwitchField
                                    bind:checked={menuPaneling}
                                    label="Menu paneling"
                                    description="Inset frame around menus. Off leaves a plain 1px border with the shadow."
                                />
                                <SwitchField
                                    bind:checked={surfacePaneling}
                                    label="Surface paneling"
                                    description="Inset frame around modals, sheets, popovers, and cards. Off makes each one a single container."
                                />
                                <SwitchField
                                    bind:checked={primaryStroke}
                                    label="Primary stroke"
                                    description="A light inset edge on primary buttons."
                                />
                            </div>
                        </section>

                        <section class="flex flex-col gap-2">
                            {@render sectionHeading('Interaction')}
                            <div class="flex flex-col gap-1.5">
                                {#if hoverSpeedRow}
                                    {@render tokenRow(hoverSpeedRow, 'Hover speed')}
                                {/if}
                                {#if buttonPressRow}
                                    {@render tokenRow(buttonPressRow, 'Button press')}
                                {/if}
                                <SwitchField
                                    bind:checked={travelingHighlight}
                                    label="Traveling highlight"
                                    description="Slide the hover highlight between items. Off keeps the fill without the motion."
                                />
                                <SwitchField
                                    bind:checked={fancySwap}
                                    label="Fancy text replacement"
                                    description="Blur, scale, and turn icons and labels as they swap. Off uses a plain crossfade."
                                />
                                <SwitchField
                                    bind:checked={sliderStretchEnabled, setSliderStretch}
                                    label="Slider stretch"
                                    description="Stretch sliders when dragged past either end."
                                />
                                <Select.Root
                                    value={interactiveCursor}
                                    onValueChange={(value) => {
                                        if (value === 'default' || value === 'pointer') {
                                            interactiveCursor = value;
                                        }
                                    }}
                                >
                                    <SelectFieldTrigger label="Hover cursor">
                                        {formatChoice(interactiveCursor)}
                                    </SelectFieldTrigger>
                                    <Select.Content
                                        class="min-w-[max(16rem,var(--popover-trigger-width))]"
                                    >
                                        {#each cursorChoices as choice (choice)}
                                            <Select.Item
                                                value={choice}
                                                label={formatChoice(choice)}
                                            >
                                                {formatChoice(choice)}
                                            </Select.Item>
                                        {/each}
                                    </Select.Content>
                                </Select.Root>
                            </div>
                        </section>
                    </div>
                </ScrollArea>
            </Tabs.Content>

            <Tabs.Content value="tokens" class="flex min-h-0 flex-1 flex-col">
                <div class="flex shrink-0 flex-col gap-2 pt-4 pb-3">
                    <Input
                        bind:value={tokenQuery}
                        type="search"
                        placeholder="Filter by name or variable"
                        aria-label="Filter tokens"
                    >
                        {#snippet leading()}
                            <Search size={14} />
                        {/snippet}
                    </Input>
                </div>
                <ScrollArea class="hide-scrollbar-all -mx-3 min-h-0 flex-1" showCues={false}>
                    {#if tokenQuery.trim()}
                        <div class="flex flex-col gap-7 px-3 pb-6">
                            {#each filteredTokenSections as section (section.id)}
                                {#each section.groups as group (group.label)}
                                    <section class="flex flex-col gap-2">
                                        {@render sectionHeading(`${section.label} · ${group.label}`)}
                                        <div class="flex flex-col gap-2">
                                            {#each group.rows as row (row.definition.name)}
                                                {@render tokenRow(row)}
                                            {/each}
                                        </div>
                                    </section>
                                {/each}
                            {:else}
                                <p class="m-0 py-6 text-center text-[13px] text-foreground-muted">
                                    No tokens match “{tokenQuery.trim()}”.
                                </p>
                            {/each}
                        </div>
                    {:else}
                        <Accordion.Root
                            type="single"
                            collapsible
                            bind:value={openTokenSection}
                            class="px-3"
                        >
                            {#each tokenSections as section (section.id)}
                                {@const changes = sectionChangeCount(section)}
                                <Accordion.Item value={section.id}>
                                    <Accordion.Trigger>
                                        <span class="flex min-w-0 flex-1 items-baseline gap-2">
                                            <span class="truncate">{section.label}</span>
                                            {#if changes > 0}
                                                <span
                                                    class="text-xs tabular-nums text-foreground-muted"
                                                >
                                                    {changes}
                                                    changed
                                                </span>
                                            {/if}
                                        </span>
                                    </Accordion.Trigger>
                                    <Accordion.Content class="-mx-3 px-3">
                                        <div class="flex flex-col gap-7 pb-4">
                                            {#each section.groups as group (group.label)}
                                                <section
                                                    class="flex scroll-mt-2 flex-col gap-2"
                                                    data-token-group={group.label}
                                                >
                                                    {@render sectionHeading(group.label)}
                                                    <div class="flex flex-col gap-2">
                                                        {#each group.rows as row (row.definition.name)}
                                                            {@render tokenRow(row)}
                                                        {/each}
                                                    </div>
                                                </section>
                                            {/each}
                                        </div>
                                    </Accordion.Content>
                                </Accordion.Item>
                            {/each}
                        </Accordion.Root>
                    {/if}
                </ScrollArea>
            </Tabs.Content>
        </Tabs.Root>
    </div>
{/snippet}

{#snippet dashboardPreview()}
    {#if previewView === 'agent'}
        <div class="mx-auto flex h-full w-full max-w-3xl flex-col px-4 pt-4 pb-4 sm:px-6">
            <PreviewAgent />
        </div>
    {:else}
        <ScrollArea class="h-full min-h-0" showCues={false}>
            {#if previewView === 'cards'}
                <div class="mx-auto w-full max-w-6xl px-4 pt-4 pb-8 sm:px-6">
                    <PreviewCards />
                </div>
            {:else}
                <div class="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 pt-2 pb-8">
                    <Toolbar class="gap-2 p-0">
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger
                                variant="quiet"
                                class="min-w-0 justify-start px-0"
                            >
                                <Avatar.Root size="sm" shape="square">
                                    <Avatar.Fallback>NL</Avatar.Fallback>
                                </Avatar.Root>
                                <Typography.Text
                                    variant="supporting"
                                    class="truncate text-foreground"
                                >
                                    {companyName}
                                </Typography.Text>
                                <ChevronDown size={14} class="text-foreground-muted" />
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                                <DropdownMenu.Label>Workspace</DropdownMenu.Label>
                                <DropdownMenu.Item>Northstar Ledger</DropdownMenu.Item>
                                <DropdownMenu.Item>Personal books</DropdownMenu.Item>
                                <DropdownMenu.Separator />
                                <DropdownMenu.Item
                                    callback={() =>
                                runDashboardAction(
                                    'Workspace created',
                                    'A blank ledger is ready.'
                                )}
                                >
                                    Create workspace
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                        <div class="ml-auto flex items-center gap-1">
                            <Popover.Root placement="bottom-end" inert={false}>
                                <Popover.Trigger
                                    variant="ghost"
                                    size="icon"
                                    class="relative"
                                    aria-label="Notifications"
                                >
                                    <Bell size={16} />
                                    {#if unreadNotificationCount > 0}
                                        <Badge
                                            variant="error"
                                            class="pointer-events-none absolute top-0.5 right-0.5 size-3.5 min-w-3.5 bg-[var(--color-error)] p-0 text-[length:var(--font-size-meta)] text-[var(--color-on-primary)] leading-none"
                                        >
                                            {unreadNotificationCount}
                                        </Badge>
                                    {/if}
                                </Popover.Trigger>
                                <Popover.Content class="w-80" surfaceClass="p-2" lockScroll={false}>
                                    <div class="flex items-center justify-between px-2 pt-1 pb-1.5">
                                        <Popover.Title
                                            class="text-[length:var(--font-size-body)] leading-snug"
                                        >
                                            Notifications
                                        </Popover.Title>
                                        {#if unreadNotificationCount > 0}
                                            <Typography.Metadata class="tabular-nums">
                                                {unreadNotificationCount}
                                                new
                                            </Typography.Metadata>
                                        {/if}
                                    </div>
                                    <div class="flex flex-col gap-0.5">
                                        {#each notifications as notification (notification.id)}
                                            <Button
                                                unstyled
                                                class="flex w-full items-start justify-start gap-3 rounded-[var(--radius-md)] px-2 py-2 text-left select-none transition-[background-color,border-color,color] [transition-duration:var(--motion-duration-hover)] hover:cursor-[var(--ui-cursor-interactive)] hover:bg-foreground/[0.08] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
                                                onclick={() => markNotificationRead(notification.id)}
                                            >
                                                <span
                                                    class="flex min-w-0 flex-1 flex-col items-start gap-0.5"
                                                >
                                                    <span
                                                        class="w-full text-left text-[length:var(--font-size-body)] leading-snug text-pretty text-foreground {notification.read
                                                    ? 'font-normal'
                                                    : 'font-medium'}"
                                                    >
                                                        {notification.title}
                                                    </span>
                                                    <Typography.Metadata class="tabular-nums">
                                                        {notification.detail}
                                                    </Typography.Metadata>
                                                </span>
                                                {#if !notification.read}
                                                    <Badge
                                                        variant="secondary"
                                                        class="mt-0.5 shrink-0 self-start"
                                                    >
                                                        New
                                                    </Badge>
                                                {/if}
                                            </Button>
                                        {/each}
                                    </div>
                                </Popover.Content>
                            </Popover.Root>
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger
                                    variant="quiet"
                                    size="icon"
                                    aria-label="Open profile menu"
                                >
                                    <Avatar.Root size="sm">
                                        <Avatar.Fallback>AN</Avatar.Fallback>
                                    </Avatar.Root>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content class="min-w-[16rem]">
                                    <DropdownMenu.Label>
                                        <span class="text-[0.7rem] text-foreground-muted">
                                            avery@northstar.dev
                                        </span>
                                    </DropdownMenu.Label>
                                    <DropdownMenu.Item callback={() => (studioView = 'settings')}>
                                        <span class="flex items-center gap-2">
                                            <User size={13} />
                                            Profile
                                        </span>
                                        <Shortcut shortcut="shift+cmd+P" />
                                    </DropdownMenu.Item>
                                    <DropdownMenu.Item callback={() => (studioView = 'settings')}>
                                        <span class="flex items-center gap-2">
                                            <Settings size={13} />
                                            Preferences
                                        </span>
                                        <Shortcut shortcut="cmd+," />
                                    </DropdownMenu.Item>
                                    <DropdownMenu.Item
                                        callback={() =>
                                    runDashboardAction(
                                        'Billing opened',
                                        'The billing portal is on its way.'
                                    )}
                                    >
                                        <span class="flex items-center gap-2">
                                            <CreditCard size={13} />
                                            Billing
                                        </span>
                                        <Shortcut shortcut="cmd+B" />
                                    </DropdownMenu.Item>
                                    <DropdownMenu.Separator />
                                    <DropdownMenu.Item
                                        callback={() =>
                                    runDashboardAction(
                                        'Support pinged',
                                        'We will follow up shortly.'
                                    )}
                                    >
                                        <span class="flex items-center gap-2">
                                            <LifeBuoy size={13} />
                                            Help & feedback
                                        </span>
                                    </DropdownMenu.Item>
                                    <DropdownMenu.Item
                                        callback={() =>
                                    runDashboardAction('Signed out', 'The session ended.')}
                                    >
                                        <span
                                            class="flex items-center gap-2 text-[var(--color-error)]"
                                        >
                                            <LogOut size={13} />
                                            Sign out
                                        </span>
                                        <Shortcut shortcut="shift+cmd+Q" />
                                    </DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                        </div>
                    </Toolbar>

                    <Tabs.Root bind:value={studioView} variant="segmented">
                        <div class="flex flex-wrap items-center gap-2">
                            <Tabs.List>
                                <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                                <Tabs.Trigger value="invoices">Invoices</Tabs.Trigger>
                                <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
                            </Tabs.List>
                            <Command.Root bind:open={commandOpen}>
                                <Command.Trigger
                                    variant="outline"
                                    class="ml-auto min-w-0 w-52 shrink-0 justify-between gap-2"
                                >
                                    <span class="flex min-w-0 items-center gap-2">
                                        <Search size={14} />
                                        <span class="truncate">Search</span>
                                    </span>
                                    <Shortcut
                                        shortcut="cmd+k"
                                        class="shrink-0"
                                        ontrigger={() => {
                                    commandOpen = true;
                                }}
                                    />
                                </Command.Trigger>
                                <Command.Content>
                                    <Command.Search placeholder="Search ledger…" />
                                    <Command.Results>
                                        <Command.Group heading="Go to">
                                            <Command.Item
                                                name="Overview"
                                                callback={() => {
                                            studioView = 'overview';
                                        }}
                                            >
                                                <LayoutDashboard size={14} />
                                                Overview
                                            </Command.Item>
                                            <Command.Item
                                                name="Invoices"
                                                callback={() => {
                                            studioView = 'invoices';
                                        }}
                                            >
                                                <FileText size={14} />
                                                Invoices
                                            </Command.Item>
                                            <Command.Item
                                                name="Settings"
                                                callback={() => {
                                            studioView = 'settings';
                                        }}
                                            >
                                                <Settings size={14} />
                                                Settings
                                            </Command.Item>
                                        </Command.Group>
                                        <Command.Separator />
                                        <Command.Group heading="Actions">
                                            <Command.Item
                                                name="New invoice"
                                                callback={() => {
                                            studioView = 'invoices';
                                            invoiceModalOpen = true;
                                        }}
                                            >
                                                <Plus size={14} />
                                                New invoice
                                            </Command.Item>
                                        </Command.Group>
                                        <Command.Group heading="Invoices">
                                            {#each invoices as invoice (invoice.reference)}
                                                <Command.Item
                                                    name={`${invoice.client} ${invoice.reference}`}
                                                    callback={() => {
                                                studioView = 'invoices';
                                                invoiceQuery = invoice.reference;
                                            }}
                                                >
                                                    {invoice.client}
                                                    <Typography.Metadata>
                                                        {invoice.reference}
                                                    </Typography.Metadata>
                                                </Command.Item>
                                            {/each}
                                        </Command.Group>
                                    </Command.Results>
                                </Command.Content>
                            </Command.Root>
                        </div>

                        <Tabs.Content value="overview" class="flex flex-col gap-6 pt-6">
                            <div>
                                <Typography.Title level={1}>Overview</Typography.Title>
                                <Typography.Description>
                                    Cash on hand and collection risk for {companyName}.
                                </Typography.Description>
                            </div>
                            <Tabs.Root bind:value={dashboardRange} variant="ghost">
                                <Tabs.List class="w-fit">
                                    <Tabs.Trigger value="7d">7 days</Tabs.Trigger>
                                    <Tabs.Trigger value="30d">30 days</Tabs.Trigger>
                                    <Tabs.Trigger value="Quarter">Quarter</Tabs.Trigger>
                                </Tabs.List>
                            </Tabs.Root>
                            {#if overdueCount > 0}
                                <Alert.Root variant="warning">
                                    <Alert.Title>
                                        {overdueCount}
                                        {overdueCount === 1 ? 'invoice is' : 'invoices are'}
                                        overdue
                                    </Alert.Title>
                                    <Alert.Description>
                                        ${outstandingTotal.toLocaleString('en-US')}
                                        is still open. The next collection run starts tomorrow at
                                        9:00 AM.
                                    </Alert.Description>
                                </Alert.Root>
                            {/if}
                            <Card.Root>
                                <Card.Header>
                                    <Typography.Title level={2}>Cash coverage</Typography.Title>
                                    <Typography.Description>
                                        Funds available for the selected range.
                                    </Typography.Description>
                                </Card.Header>
                                <Card.Content class="flex flex-col gap-4">
                                    <Gauge
                                        value={coverageValue}
                                        label="Cash coverage"
                                        tone="success"
                                        size={72}
                                    >
                                        {coverageValue}%
                                    </Gauge>
                                    <Progress {...progressProps(coverageValue)} />
                                    <Switch
                                        bind:checked={autoReconcile}
                                        label="Auto-reconcile"
                                        description="Match confirmed bank payments as they arrive."
                                    />
                                    <TaskSteps
                                        label="Collection run"
                                        steps={collectionSteps}
                                        current={collectionStep}
                                    />
                                </Card.Content>
                            </Card.Root>
                        </Tabs.Content>

                        <Tabs.Content value="invoices" class="flex flex-col gap-6 pt-6">
                            <div
                                class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
                            >
                                <div>
                                    <Typography.Title level={1}>Invoices</Typography.Title>
                                    <Typography.Description>
                                        Review, remind, and record payment.
                                    </Typography.Description>
                                </div>
                                <Modal.Root bind:open={invoiceModalOpen}>
                                    <Modal.Trigger>
                                        <Plus size={15} />
                                        New invoice
                                    </Modal.Trigger>
                                    <Modal.Content>
                                        <Modal.Header>
                                            <Modal.Title>New invoice</Modal.Title>
                                            <Modal.Description>
                                                Draft a customer invoice. You can add line items
                                                later.
                                            </Modal.Description>
                                        </Modal.Header>
                                        <Modal.Body class="gap-4">
                                            <Input
                                                bind:value={newInvoiceCustomer}
                                                label="Customer"
                                                placeholder="Studio name"
                                            />
                                            <Textarea
                                                bind:value={newInvoiceNotes}
                                                label="Notes"
                                                placeholder="Optional context for the draft"
                                                autoresize
                                            />
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Modal.Close>
                                                Cancel
                                                <Shortcut shortcut="esc" />
                                            </Modal.Close>
                                            <Modal.Confirm onclick={createInvoice}>
                                                Create draft
                                                <Shortcut shortcut="enter" />
                                            </Modal.Confirm>
                                        </Modal.Footer>
                                    </Modal.Content>
                                </Modal.Root>
                            </div>
                            <Toolbar class="gap-2 p-0">
                                <Combobox.Root bind:value={invoiceQuery}>
                                    <Combobox.Trigger
                                        appearance="input"
                                        placeholder="Search customer"
                                        class="min-w-0 flex-1"
                                    >
                                        {#snippet trailing()}
                                            <Search size={16} />
                                        {/snippet}
                                    </Combobox.Trigger>
                                    <Combobox.Content>
                                        <Combobox.Results>
                                            {#each customers as customer (customer)}
                                                <Combobox.Item value={customer} label={customer} />
                                            {/each}
                                        </Combobox.Results>
                                    </Combobox.Content>
                                </Combobox.Root>
                                <Select.Root bind:value={invoiceStatus}>
                                    <Select.Trigger variant="outline" aria-label="Invoice status">
                                        {invoiceStatus === 'all'
                                    ? 'All statuses'
                                    : invoiceStatus === 'open'
                                      ? 'Open'
                                      : formatChoice(invoiceStatus)}
                                    </Select.Trigger>
                                    <Select.Content>
                                        <Select.Item value="all" label="All statuses">
                                            All statuses
                                        </Select.Item>
                                        <Select.Item value="open" label="Open">Open</Select.Item>
                                        <Select.Item value="paid" label="Paid">Paid</Select.Item>
                                        <Select.Item value="overdue" label="Overdue"
                                            >Overdue</Select.Item
                                        >
                                    </Select.Content>
                                </Select.Root>
                            </Toolbar>
                            {#if pagedInvoices.length > 0}
                                <Checkbox
                                    checked={allVisibleSelected}
                                    label="Select visible invoices"
                                    onCheckedChange={toggleSelectAll}
                                />
                            {/if}
                            {#each pagedInvoices as invoice (invoice.reference)}
                                <ContextMenu.Root>
                                    <ContextMenu.Trigger class="block">
                                        <div
                                            class="flex items-center gap-3 border-b border-border py-3 last:border-b-0"
                                        >
                                            <Checkbox
                                                bind:checked={selectedInvoices[invoice.reference]}
                                                label={invoice.client}
                                                description={`${invoice.reference} · due ${invoice.due}`}
                                                class="min-w-0 flex-1"
                                            />
                                            <Tooltip.Root>
                                                <Tooltip.Trigger class="ml-auto shrink-0">
                                                    <Badge
                                                        variant={invoiceBadgeVariant(invoice.status)}
                                                    >
                                                        {invoice.status}
                                                    </Badge>
                                                </Tooltip.Trigger>
                                                <Tooltip.Content>Due {invoice.due}</Tooltip.Content>
                                            </Tooltip.Root>
                                            <Typography.Metadata
                                                class="w-16 shrink-0 text-right tabular-nums"
                                            >
                                                {invoice.amount}
                                            </Typography.Metadata>
                                            <CopyButton
                                                text={invoice.reference}
                                                label="Copy invoice number"
                                            />
                                            <DropdownMenu.Root>
                                                <DropdownMenu.Trigger
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Actions for ${invoice.reference}`}
                                                >
                                                    <MoreHorizontal size={16} />
                                                </DropdownMenu.Trigger>
                                                <DropdownMenu.Content>
                                                    <DropdownMenu.Item
                                                        callback={() =>
                                                    runDashboardAction(
                                                        'Reminder sent',
                                                        `${invoice.client} will be notified.`
                                                    )}
                                                    >
                                                        Send reminder
                                                    </DropdownMenu.Item>
                                                    <DropdownMenu.Item
                                                        callback={() => markInvoicePaid(invoice.reference)}
                                                    >
                                                        Record payment
                                                    </DropdownMenu.Item>
                                                    <DropdownMenu.Separator />
                                                    <DropdownMenu.Item
                                                        callback={() =>
                                                    runDashboardAction(
                                                        'Invoice duplicated',
                                                        `${invoice.reference} copied as a draft.`
                                                    )}
                                                    >
                                                        Duplicate
                                                    </DropdownMenu.Item>
                                                </DropdownMenu.Content>
                                            </DropdownMenu.Root>
                                        </div>
                                    </ContextMenu.Trigger>
                                    <ContextMenu.Content>
                                        <ContextMenu.Item
                                            callback={() =>
                                        runDashboardAction(
                                            'Reminder sent',
                                            `${invoice.client} will be notified.`
                                        )}
                                        >
                                            Send reminder
                                        </ContextMenu.Item>
                                        <ContextMenu.Item
                                            callback={() => markInvoicePaid(invoice.reference)}
                                        >
                                            Record payment
                                        </ContextMenu.Item>
                                        <ContextMenu.Separator />
                                        <ContextMenu.Item
                                            callback={() =>
                                        runDashboardAction(
                                            'Invoice duplicated',
                                            `${invoice.reference} copied as a draft.`
                                        )}
                                        >
                                            Duplicate
                                        </ContextMenu.Item>
                                    </ContextMenu.Content>
                                </ContextMenu.Root>
                            {:else}
                                <Alert.Root variant="info">
                                    <Alert.Title>No invoices found</Alert.Title>
                                    <Alert.Description>
                                        Change the search or status filter to see more invoices.
                                    </Alert.Description>
                                </Alert.Root>
                            {/each}
                            <Toolbar class="p-0">
                                <Typography.Metadata>
                                    Showing {pagedInvoices.length} of {visibleInvoices.length}
                                </Typography.Metadata>
                                <Pagination bind:page={invoicePage} total={invoicePageCount} />
                            </Toolbar>
                        </Tabs.Content>

                        <Tabs.Content value="settings" class="flex flex-col gap-6 pt-6">
                            <div>
                                <Typography.Title level={1}>Settings</Typography.Title>
                                <Typography.Description>
                                    Collection defaults for this workspace.
                                </Typography.Description>
                            </div>
                            <Accordion.Root type="multiple" bind:value={settingsSections}>
                                <Accordion.Item value="workspace">
                                    <Accordion.Trigger>Workspace</Accordion.Trigger>
                                    <Accordion.Content>
                                        <div class="flex flex-col gap-4">
                                            <Input
                                                bind:value={companyName}
                                                label="Workspace name"
                                            />
                                            <Switch
                                                bind:checked={autoReconcile}
                                                label="Auto-reconcile"
                                                description="Match confirmed bank payments as they arrive."
                                            />
                                        </div>
                                    </Accordion.Content>
                                </Accordion.Item>
                                <Accordion.Item value="reminders">
                                    <Accordion.Trigger>Reminders</Accordion.Trigger>
                                    <Accordion.Content>
                                        <div class="flex flex-col gap-4">
                                            <RadioGroup.Root
                                                bind:value={reminderCadence}
                                                name="reminder-cadence"
                                            >
                                                <RadioGroup.Item
                                                    value="off"
                                                    label="Off"
                                                    description="Send reminders yourself."
                                                />
                                                <RadioGroup.Item
                                                    value="weekly"
                                                    label="Weekly"
                                                    description="Every Monday for open invoices."
                                                />
                                                <RadioGroup.Item
                                                    value="due"
                                                    label="Before due"
                                                    description="Once, a few days before the due date."
                                                />
                                            </RadioGroup.Root>
                                            {#if reminderCadence === 'due'}
                                                <Slider.Root
                                                    value={reminderDays}
                                                    min={1}
                                                    max={14}
                                                    step={1}
                                                    label="Reminder"
                                                    format={(value) => {
                                                return value === 1
                                                    ? '1 day before due'
                                                    : `${value} days before due`;
                                            }}
                                                    onValueChange={(value) => {
                                                reminderDays = value;
                                            }}
                                                />
                                            {/if}
                                        </div>
                                    </Accordion.Content>
                                </Accordion.Item>
                            </Accordion.Root>
                        </Tabs.Content>
                    </Tabs.Root>
                </div>
            {/if}
        </ScrollArea>
    {/if}
{/snippet}

<div data-docs-page class="flex min-h-0 min-w-0 flex-1 flex-col bg-background text-foreground">
    <div class="relative z-20 shrink-0">
        <header
            aria-label="Studio"
            class="flex min-w-0 items-center gap-1 px-3 pt-1 pb-3 min-[1100px]:px-4"
        >
            <Select.Root bind:value={selectedPreset}>
                <Select.Trigger
                    variant="ghost"
                    class="h-8 w-auto max-w-56 min-w-0 gap-2 px-2 font-medium"
                    aria-label="Preset"
                >
                    {@render presetDots(baseTheme)}
                    <span class="truncate">{activePresetName}</span>
                    {#if dirty}
                        <span class="text-xs font-normal text-foreground-muted max-sm:hidden">
                            Edited
                        </span>
                    {/if}
                </Select.Trigger>
                <Select.Content class="max-h-72 min-w-56">
                    <Select.Label>Built-in presets</Select.Label>
                    {#each builtInThemePresets as preset (preset.slug)}
                        <Select.Item value={preset.slug} label={preset.name}>
                            <span class="flex min-w-0 items-center gap-2">
                                {@render presetDots(preset)}
                                <span class="truncate">{preset.name}</span>
                            </span>
                        </Select.Item>
                    {/each}
                </Select.Content>
            </Select.Root>
            <Button
                variant={presetsOpen ? 'secondary' : 'ghost'}
                size="sm"
                aria-expanded={presetsOpen}
                aria-controls="studio-preset-gallery"
                onclick={() => {
                    previewPresetSlug = null;
                    presetsOpen = !presetsOpen;
                }}
            >
                <Blend size={14} />
                <span class="max-sm:sr-only">Presets</span>
            </Button>

            <div class="ml-auto flex shrink-0 items-center gap-1">
                <Tooltip.Root>
                    <Tooltip.Trigger>
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={!canUndo}
                            onclick={undo}
                            aria-label="Undo"
                        >
                            <Undo2 size={15} />
                        </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        Undo
                        <Shortcut shortcut="cmd+Z" />
                    </Tooltip.Content>
                </Tooltip.Root>
                <Tooltip.Root>
                    <Tooltip.Trigger>
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={!canRedo}
                            onclick={redo}
                            aria-label="Redo"
                        >
                            <Redo2 size={15} />
                        </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        Redo
                        <Shortcut shortcut="shift+cmd+Z" />
                    </Tooltip.Content>
                </Tooltip.Root>
                <Tooltip.Root>
                    <Tooltip.Trigger>
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={!dirty}
                            onclick={requestReset}
                            aria-label="Reset to preset"
                        >
                            <RotateCcw size={15} />
                        </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>Reset</Tooltip.Content>
                </Tooltip.Root>
                <Tooltip.Root>
                    <Tooltip.Trigger>
                        <Button
                            variant="ghost"
                            size="icon"
                            onclick={openTokenPalette}
                            aria-label="Search tokens"
                        >
                            <Search size={15} />
                        </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        Search tokens
                        <Shortcut shortcut="shift+cmd+K" />
                    </Tooltip.Content>
                </Tooltip.Root>
                <Tooltip.Root>
                    <Tooltip.Trigger class="max-[1099px]:hidden">
                        <Button
                            variant={tokenEditMode ? 'secondary' : 'ghost'}
                            size="icon"
                            aria-pressed={tokenEditMode}
                            aria-label="Edit tokens"
                            onclick={() => {
                                setTokenEditMode(!tokenEditMode);
                            }}
                        >
                            <SquareMousePointer size={15} />
                        </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        {tokenEditMode ? 'Stop editing' : 'Edit tokens'}
                    </Tooltip.Content>
                </Tooltip.Root>
                <Button
                    size="sm"
                    class="ml-1"
                    onclick={() => {
                        exportOpen = true;
                    }}
                >
                    Export
                    {#if changeCount > 0}
                        <span class="tabular-nums opacity-70">{changeCount}</span>
                    {/if}
                </Button>
            </div>
        </header>

        {#if presetsOpen}
            <div
                id="studio-preset-gallery"
                class="absolute inset-x-3 top-full z-40 origin-top min-[1100px]:inset-x-4"
                in:surfaceTransition
                out:surfaceTransition={{ direction: 'out' }}
            >
                <PresetGallery
                    presets={builtInThemePresets}
                    mode={appMode}
                    activeSlug={selectedPreset}
                    previewSlug={previewPresetSlug}
                    onPreview={setPreviewPreset}
                    onApply={applyGalleryPreset}
                    onClose={() => {
                        presetsOpen = false;
                    }}
                />
            </div>
        {/if}
    </div>

    <section aria-label="Theme workspace" class="flex min-h-0 flex-1 bg-background">
        <aside
            aria-label="Theme configuration"
            class="hidden min-h-0 w-[344px] shrink-0 px-4 pt-1 pb-3 min-[1100px]:flex min-[1100px]:flex-col"
        >
            {@render inspector()}
        </aside>

        <div class="relative flex min-w-0 flex-1 flex-col pr-3 pb-3 pl-3 min-[1100px]:pl-0">
            <div
                class={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-[var(--radius-xl)] border bg-background font-[var(--font-sans)] text-foreground transition-[border-color,box-shadow] [transition-duration:var(--motion-duration-hover)] ${tokenEditMode ? 'border-primary ring-3 ring-primary/20' : 'border-border'}`}
            >
                <div class="flex shrink-0 items-center gap-3 px-3 pt-3">
                    <ToggleGroup.Root
                        type="single"
                        value={previewView}
                        onValueChange={(value) => {
                            if (typeof value === 'string' && value) {
                                previewView = value;
                            }
                        }}
                    >
                        <ToggleGroup.Item value="cards">Cards</ToggleGroup.Item>
                        <ToggleGroup.Item value="app">Ledger app</ToggleGroup.Item>
                        <ToggleGroup.Item value="agent">Agent</ToggleGroup.Item>
                    </ToggleGroup.Root>
                    {#if tokenEditMode}
                        <div
                            class="ml-auto flex min-w-0 items-center gap-2"
                            transition:fade={{ duration: 120 }}
                        >
                            <span
                                class="size-1.5 shrink-0 rounded-full bg-primary"
                                aria-hidden="true"
                            ></span>
                            <Typography.Metadata class="truncate">
                                Click any element to edit its tokens
                            </Typography.Metadata>
                            <Button
                                variant="ghost"
                                size="sm"
                                class="shrink-0"
                                onclick={() => {
                                    setTokenEditMode(false);
                                }}
                            >
                                Done
                            </Button>
                        </div>
                    {/if}
                </div>
                <div
                    bind:this={previewFrame}
                    class={`min-h-0 flex-1 ${tokenEditMode ? 'cursor-crosshair! [&_*]:cursor-crosshair!' : ''}`}
                    id="theme-preview"
                    onclickcapture={openTokenEditor}
                    onpointerdowncapture={suppressTokenEditPointer}
                    onmousedowncapture={suppressTokenEditPointer}
                    onpointerovercapture={trackTokenEditHover}
                    onpointerleave={() => {
                        tokenEditHover = null;
                    }}
                >
                    {@render dashboardPreview()}
                </div>
            </div>
        </div>
    </section>

    {#if tokenEditOpen && tokenEditTarget}
        <ElementTokenPopover
            target={tokenEditTarget}
            name={elementName(tokenEditTarget)}
            detail={elementDetail(tokenEditTarget)}
            sections={tokenEditSections}
            overrides={tokenEditOverrides.length}
            row={tokenEditRow}
            onReset={resetTokenEditOverrides}
            onClose={closeTokenEditor}
            onParent={tokenEditParent ? selectTokenEditParent : undefined}
            onHighlight={highlightTokenUsage}
        />
    {/if}

    {#if previewFrame && (tokenEditOutline.length > 0 || tokenEditFocus)}
        <ElementOutline
            container={previewFrame}
            elements={tokenEditOutline}
            focus={tokenEditFocus}
            focusLabel={tokenEditFocus ? elementChip(tokenEditFocus) : ''}
            selected={tokenEditOpen}
        />
    {/if}

    <Sheet.Root>
        <Sheet.Trigger
            class="fixed bottom-5 right-5 z-30 shadow-[var(--elevation-float)] min-[1100px]:hidden"
        >
            <Palette size={15} />
            Customize
        </Sheet.Trigger>
        <Sheet.Content side="left" class="p-0 min-[1100px]:hidden">
            <Sheet.Header class="sr-only">
                <Sheet.Title>Theme configuration</Sheet.Title>
                <Sheet.Description>Configure the live Sivir theme preview.</Sheet.Description>
            </Sheet.Header>
            <div class="-mb-4 min-h-0 flex-1 overflow-hidden px-6">
                {@render inspector()}
            </div>
        </Sheet.Content>
    </Sheet.Root>

    <ExportDialog
        bind:open={exportOpen}
        name={theme.name}
        baseName={activePresetName}
        baseSlug={selectedPreset}
        css={generatedCss}
        {baseCss}
        json={generatedJson}
        savePresetName={savablePreset?.name ?? null}
        onSavePreset={saveToPreset}
    />

    <Modal.Root bind:open={tokenPaletteOpen}>
        <Modal.Content
            size="xl"
            showClose={false}
            aria-label="Search tokens"
            aria-labelledby={undefined}
            aria-describedby={undefined}
            class="fixed top-[calc(var(--sivir-viewport-top)+min(7.5rem,14vh))] flex max-h-[calc(var(--sivir-viewport-height)-min(7.5rem,14vh)-var(--overlay-gutter))] w-[calc(100%-var(--overlay-gutter))] max-w-[41.25rem] translate-y-0 flex-col gap-2.5 overflow-visible rounded-none border-0 bg-transparent! p-0 shadow-none md:top-[calc(var(--sivir-viewport-top)+min(7.5rem,14vh))]"
            surfaceClass="min-h-0 flex-1 gap-2.5 overflow-visible rounded-none bg-transparent p-0"
        >
            <div
                class="sivir-modal-frame flex max-h-[30rem] min-h-0 shrink flex-col overflow-hidden shadow-[var(--elevation-modal)]"
            >
                <div class="sivir-inset-surface flex min-h-0 flex-1 flex-col overflow-hidden">
                    <div
                        class="flex h-13.5 shrink-0 items-center gap-3 border-b border-border px-4.5"
                    >
                        <Search
                            size={16}
                            strokeWidth={1.75}
                            class="shrink-0 text-foreground-muted"
                        />
                        <input
                            bind:this={paletteInput}
                            bind:value={paletteQuery}
                            class="min-w-0 flex-1 bg-transparent text-[length:calc(var(--font-size-body)*1.1)] text-foreground placeholder:text-foreground-muted/70 focus-visible:outline-none"
                            placeholder="Search tokens"
                            aria-label="Search tokens"
                            role="combobox"
                            aria-expanded="true"
                            aria-controls="studio-token-palette-list"
                            aria-activedescendant={paletteActiveName
                                ? `palette-${paletteActiveName}`
                                : undefined}
                            oninput={() => {
                                paletteActiveName = paletteRows[0]?.definition.name ?? null;
                            }}
                            onkeydown={handlePaletteKeydown}
                        />
                        <span
                            class="font-mono text-[length:var(--font-size-meta)] tabular-nums text-foreground-muted/70"
                            aria-hidden="true"
                        >
                            {paletteRows.length}
                        </span>
                    </div>
                    <div
                        id="studio-token-palette-list"
                        role="listbox"
                        aria-label="Tokens"
                        class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pt-2 pb-1.5"
                    >
                        {#each paletteGroups as group (group.heading)}
                            <div
                                role="group"
                                aria-label={group.heading}
                                class="flex flex-col pt-0.5"
                            >
                                <span class="sivir-menu-label px-2.5 pt-2 pb-1.5">
                                    {group.heading}
                                </span>
                                {#each group.rows as row (row.definition.name)}
                                    {@const Glyph = paletteGlyph(row)}
                                    {@const expanded = row.definition.name === paletteRowName}
                                    <div
                                        class={[
                                            'flex flex-col rounded-[var(--radius-lg)] transition-colors [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)]',
                                            expanded && 'bg-foreground/[0.035] dark:bg-foreground/[0.05]'
                                        ]}
                                    >
                                        <button
                                            id={`palette-${row.definition.name}`}
                                            type="button"
                                            role="option"
                                            tabindex="-1"
                                            aria-selected={row.definition.name === paletteActiveName}
                                            aria-expanded={expanded}
                                            aria-controls={expanded
                                            ? `palette-editor-${row.definition.name}`
                                            : undefined}
                                            class="flex min-h-9.5 w-full items-center gap-3 rounded-[var(--radius-lg)] px-2.5 text-left text-[length:var(--font-size-body)] text-foreground hover:cursor-[var(--ui-cursor-interactive)] aria-selected:bg-foreground/[0.06] dark:aria-selected:bg-foreground/[0.08]"
                                            onpointermove={() => {
                                            paletteActiveName = row.definition.name;
                                        }}
                                            onclick={() => {
                                            void togglePaletteRow(row.definition.name);
                                        }}
                                        >
                                            <span
                                                class="flex size-4 shrink-0 items-center justify-center text-foreground-muted"
                                                aria-hidden="true"
                                            >
                                                {#if row.bucket === 'color'}
                                                    <span
                                                        class="size-3.5 rounded-full shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-foreground)_16%,transparent)]"
                                                        style:background={`var(${row.definition.name})`}
                                                    ></span>
                                                {:else if row.definition.group === 'Corners'}
                                                    <span
                                                        class="size-4 translate-x-0.5 translate-y-0.5 border-t-[1.5px] border-l-[1.5px] border-current"
                                                        style:border-top-left-radius={`min(var(${row.definition.name}), 1rem)`}
                                                    ></span>
                                                {:else if row.definition.group === 'Shadows'}
                                                    <span
                                                        class="size-3 rounded-[var(--radius-sm)] bg-card"
                                                        style:box-shadow={`var(${row.definition.name})`}
                                                    ></span>
                                                {:else}
                                                    <Glyph size={16} strokeWidth={1.75} />
                                                {/if}
                                            </span>
                                            <span
                                                class="flex min-w-0 flex-1 items-baseline gap-2.5"
                                            >
                                                <span class="shrink-0 font-medium">
                                                    {row.definition.label}
                                                </span>
                                                <span
                                                    class="truncate font-mono text-[length:var(--font-size-meta)] text-foreground-muted"
                                                >
                                                    {row.definition.name}
                                                </span>
                                            </span>
                                            {#if tokenOverride(row) !== ''}
                                                <span
                                                    class="size-1.5 shrink-0 rounded-full bg-primary"
                                                    aria-label="Changed"
                                                ></span>
                                            {/if}
                                            <span
                                                class="max-w-32 shrink-0 truncate font-mono text-[length:var(--font-size-meta)] tabular-nums text-foreground-muted"
                                            >
                                                {row.bucket === 'color'
                                                ? resolveColorToken(row.definition).hex
                                                : paletteValue(row.definition.name)}
                                            </span>
                                        </button>
                                        {#if expanded}
                                            <div
                                                id={`palette-editor-${row.definition.name}`}
                                                data-palette-editor
                                                in:slide={paletteEditorMotion(240)}
                                                out:slide={paletteEditorMotion(180)}
                                                onintroend={(event) => {
                                                event.currentTarget.scrollIntoView({
                                                    block: 'nearest',
                                                    behavior: 'smooth'
                                                });
                                            }}
                                            >
                                                <div
                                                    class="flex flex-col gap-2 px-2.5 pt-1 pb-2.5"
                                                    in:fade={paletteEditorMotion(180)}
                                                    out:fade={paletteEditorMotion(100)}
                                                >
                                                    {@render tokenRow(row)}
                                                    <span
                                                        class="truncate px-0.5 text-[length:var(--font-size-meta)] text-foreground-muted"
                                                    >
                                                        {paletteUsageLabel(row)}
                                                    </span>
                                                </div>
                                            </div>
                                        {/if}
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <p class="m-0 py-8 text-center text-sm text-foreground-muted">
                                No tokens match “{paletteQuery.trim()}”.
                            </p>
                        {/each}
                    </div>
                    <div
                        class="flex h-9 shrink-0 items-center gap-4 border-t border-border px-4.5 text-[length:var(--font-size-meta)] text-foreground-muted"
                    >
                        <span class="inline-flex shrink-0 items-center gap-1.5">
                            <Shortcut shortcut="enter" />
                            {paletteActiveName !== null && paletteActiveName === paletteRowName
                                ? 'Close'
                                : 'Edit'}
                        </span>
                        {#if paletteActiveGroup}
                            <span class="inline-flex shrink-0 items-center gap-1.5">
                                <Shortcut shortcut="shift+enter" />
                                Open in {paletteActiveGroup.sectionLabel}
                            </span>
                        {/if}
                        {#if paletteActiveRow && tokenOverride(paletteActiveRow) !== ''}
                            <span class="inline-flex shrink-0 items-center gap-1.5">
                                <Shortcut shortcut="cmd+backspace" />
                                Reset
                            </span>
                        {/if}
                        <span class="ml-auto truncate text-foreground-muted/70 max-md:hidden">
                            Searches labels, variables, and components
                        </span>
                    </div>
                </div>
            </div>
        </Modal.Content>
    </Modal.Root>

    <AlertDialog.Root bind:open={resetDialogOpen} orientation="vertical">
        <AlertDialog.Content>
            <AlertDialog.Header>
                <AlertDialog.Title>Reset to {baseTheme.name}?</AlertDialog.Title>
                <AlertDialog.Description>
                    Every changed color, type, shape, and motion value returns to the preset. You
                    can undo this afterwards.
                </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
                <AlertDialog.Exit>
                    Keep changes
                    <Shortcut shortcut="esc" />
                </AlertDialog.Exit>
                <AlertDialog.Confirm onclick={confirmReset}>
                    Reset
                    <Shortcut shortcut="enter" />
                </AlertDialog.Confirm>
            </AlertDialog.Footer>
        </AlertDialog.Content>
    </AlertDialog.Root>

    <AlertDialog.Root bind:open={presetDialogOpen} orientation="vertical">
        <AlertDialog.Content>
            <AlertDialog.Header>
                <AlertDialog.Title>Replace your current draft?</AlertDialog.Title>
                <AlertDialog.Description>
                    Switching to
                    {pendingRegistryTheme?.name ??
                        builtInThemePresets.find((preset) => preset.slug === pendingPreset)
                            ?.name ??
                        'this preset'}
                    resets every changed color, type, shape, and motion value.
                </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
                <AlertDialog.Exit
                    onclick={() => {
                        pendingPreset = null;
                        pendingRegistryTheme = null;
                    }}
                >
                    Keep draft
                    <Shortcut shortcut="esc" />
                </AlertDialog.Exit>
                <AlertDialog.Confirm onclick={confirmPresetChange}>
                    Replace draft
                    <Shortcut shortcut="enter" />
                </AlertDialog.Confirm>
            </AlertDialog.Footer>
        </AlertDialog.Content>
    </AlertDialog.Root>
</div>
