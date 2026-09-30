<script lang="ts">
    import Bell from '@lucide/svelte/icons/bell';
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import CreditCard from '@lucide/svelte/icons/credit-card';
    import FileText from '@lucide/svelte/icons/file-text';
    import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
    import LifeBuoy from '@lucide/svelte/icons/life-buoy';
    import LogOut from '@lucide/svelte/icons/log-out';
    import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
    import Palette from '@lucide/svelte/icons/palette';
    import Plus from '@lucide/svelte/icons/plus';
    import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
    import Search from '@lucide/svelte/icons/search';
    import Settings from '@lucide/svelte/icons/settings';
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
        densities,
        motionFeels,
        radiusScales,
        type Theme,
        themeToCss
    } from '@sivir-ui/svelte/themes/theme';
    import { themedSlide } from '@sivir-ui/svelte/transition';
    import { mode } from 'mode-watcher';
    import { onMount, tick, untrack } from 'svelte';
    import ChangedDot from '$lib/components/studio/changed-dot.svelte';
    import ColorAlphaField from '$lib/components/studio/color-alpha-field.svelte';
    import ColorField from '$lib/components/studio/color-field.svelte';
    import SelectFieldTrigger from '$lib/components/studio/select-field-trigger.svelte';
    import ShadowField from '$lib/components/studio/shadow-field.svelte';
    import { fonts } from '$lib/fonts.svelte';
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
        parseCssColor,
        parseDurationMs,
        parsePxLength,
        parseScale,
        type SpacingTokenDefinition,
        type SpacingTokenName,
        spacingTokenDefinitions,
        spacingTokenGroups
    } from '$lib/studio-advanced-tokens';

    type FoundationPalette = {
        base: string;
        border: string;
        background: string;
        secondary: string;
        foreground: string;
        foregroundMuted: string;
        onPrimary: string;
        buttonForeground: string;
    };

    type FoundationColors = {
        light: FoundationPalette;
        dark: FoundationPalette;
    };

    type BrandColors = {
        light: string;
        dark: string;
    };

    type InteractiveCursor = 'default' | 'pointer';

    type StudioExtensions = {
        presetSlug: string;
        headerSize: number;
        headerWeight: FontWeight;
        roleWeights: RoleWeights;
        brandColors: BrandColors;
        foundationColors: FoundationColors;
        advancedTokens: AdvancedTokens;
        surfaceShadows: boolean;
        controlShadows: boolean;
        dialogShadows: boolean;
        travelingHighlight: boolean;
        primaryStroke: boolean;
        interactiveCursor: InteractiveCursor;
    };

    type FontWeight = '400' | '500' | '600' | '700';

    type RoleWeights = {
        body: FontWeight;
        label: FontWeight;
        button: FontWeight;
        badge: FontWeight;
        description: FontWeight;
    };

    const STUDIO_EXTENSIONS_KEY = 'sivir-studio-extensions-v1';
    const FLAT_CONTROL_SHADOW = 'inset 0 0 0 var(--border-size) var(--color-border)';
    const DEFAULT_FOUNDATION_COLORS: FoundationColors = {
        light: {
            base: '#ffffff',
            border: '#e8e8e6',
            background: '#fdfdfc',
            secondary: '#efefee',
            foreground: '#1c1c1b',
            foregroundMuted: '#737373',
            onPrimary: '#ffffff',
            buttonForeground: '#1c1c1b'
        },
        dark: {
            base: '#171717',
            border: '#2a2a2a',
            background: '#0a0a0a',
            secondary: '#252525',
            foreground: '#ededed',
            foregroundMuted: '#a3a3a3',
            onPrimary: '#ffffff',
            buttonForeground: '#ededed'
        }
    };
    const DEFAULT_ROLE_WEIGHTS: RoleWeights = {
        body: '400',
        label: '500',
        button: '500',
        badge: '500',
        description: '400'
    };
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

    type AdvancedTokens = {
        colors: Record<'light' | 'dark', Partial<Record<ColorTokenName, string>>>;
        spacing: Partial<Record<SpacingTokenName, string>>;
        animation: Partial<Record<AnimationTokenName, string>>;
        details: Record<'light' | 'dark' | 'shared', Partial<Record<DetailTokenName, string>>>;
    };

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
    const themeAxes = [
        'brand',
        'neutral',
        'radius',
        'density',
        'motion',
        'fontSans',
        'fontMono',
        'fontHeader'
    ] as const;
    const radiusTokenNames = ['--radius-sm', '--radius-md', '--radius-lg', '--radius-xl'] as const;
    const movementPresets = ['subtle', 'default', 'expressive'] as const;

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

    const tokenSections: TokenSection[] = [
        {
            id: 'color',
            label: 'Color',
            groups: colorRowGroups
        },
        {
            id: 'type',
            label: 'Typography',
            groups: pickGroups(detailRowGroups, ['Type scale', 'Line height', 'Letter spacing'])
        },
        {
            id: 'space',
            label: 'Space & shape',
            groups: pickGroups(spacingRowGroups, ['Spacing', 'Controls', 'Corners', 'Stroke'])
        },
        {
            id: 'depth',
            label: 'Depth & overlay',
            groups: pickGroups(layoutRowGroups, ['Shadows', 'Overlay'])
        },
        {
            id: 'motion',
            label: 'Motion',
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
    let theme = $state<Theme>({
        ...DEFAULT_THEME,
        slug: 'midnight-ledger',
        name: 'Midnight Ledger'
    });
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
    let brandColors = $state<BrandColors>({ light: '#1e78e6', dark: '#1e78e6' });
    let surfaceShadows = $state(true);
    let controlShadows = $state(true);
    let dialogShadows = $state(true);
    let travelingHighlight = $state(true);
    let primaryStroke = $state(false);
    let interactiveCursor = $state<InteractiveCursor>('default');
    let tokenQuery = $state('');
    let openTokenSection = $state('color');
    let pendingPreset = $state<string | null>(null);
    let presetDialogOpen = $state(false);
    let studioView = $state('invoices');
    let inspectorTab = $state('color');
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
    let appliedDark = $state(false);
    let liveCssVersion = $state(0);
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

    const foundationColorChanges = $derived(
        (['light', 'dark'] as const).reduce((count, colorMode) => {
            const changedColors = Object.entries(foundationColors[colorMode]).filter(
                ([key, value]) =>
                    value !== DEFAULT_FOUNDATION_COLORS[colorMode][key as keyof FoundationPalette]
            ).length;

            return count + changedColors;
        }, 0)
    );
    const advancedColorChanges = $derived(
        countTokenOverrides(advancedTokens.colors.light) +
            countTokenOverrides(advancedTokens.colors.dark)
    );
    const spacingTokenChanges = $derived(countTokenOverrides(advancedTokens.spacing));
    const animationTokenChanges = $derived(countTokenOverrides(advancedTokens.animation));
    const detailTokenChanges = $derived(
        countTokenOverrides(advancedTokens.details.light) +
            countTokenOverrides(advancedTokens.details.dark) +
            countTokenOverrides(advancedTokens.details.shared)
    );
    const advancedTokenChanges = $derived(
        advancedColorChanges + spacingTokenChanges + animationTokenChanges + detailTokenChanges
    );
    const roleWeightChanges = $derived(
        Object.entries(roleWeights).filter(
            ([key, value]) => value !== DEFAULT_ROLE_WEIGHTS[key as keyof RoleWeights]
        ).length
    );
    const changedAxisCount = $derived(
        themeAxes.filter((axis) => theme[axis] !== baseTheme[axis]).length +
            (brandColors.light !== baseTheme.brand || brandColors.dark !== baseTheme.brand
                ? 1
                : 0) +
            foundationColorChanges +
            advancedTokenChanges +
            (headerSize === 16 ? 0 : 1) +
            (headerWeight === '600' ? 0 : 1) +
            roleWeightChanges +
            (surfaceShadows ? 0 : 1) +
            (controlShadows ? 0 : 1) +
            (dialogShadows ? 0 : 1) +
            (travelingHighlight ? 0 : 1) +
            (primaryStroke ? 1 : 0) +
            (interactiveCursor === 'default' ? 0 : 1)
    );
    const dirty = $derived(changedAxisCount > 0);
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
    const generatedCss = $derived(
        `${themeToCss(theme)}\n:root,\n.dark {\n\t--font-size-header: ${headerSize}px;\n\t--font-weight-header: ${headerWeight};\n\t--font-weight-body: ${roleWeights.body};\n\t--font-weight-label: ${roleWeights.label};\n\t--font-weight-button: ${roleWeights.button};\n\t--font-weight-badge: ${roleWeights.badge};\n\t--font-weight-description: ${roleWeights.description};\n}\n${brandCssBlock(':root:not(.dark)', brandColors.light)}${brandCssBlock('.dark', brandColors.dark)}${foundationCssBlock(':root:not(.dark)', foundationColors.light)}${foundationCssBlock('.dark', foundationColors.dark)}${tokenOverridesCssBlock(':root:not(.dark)', advancedTokens.colors.light)}${tokenOverridesCssBlock('.dark', advancedTokens.colors.dark)}${tokenOverridesCssBlock(':root,\n.dark', advancedTokens.spacing)}${tokenOverridesCssBlock(':root,\n.dark', advancedTokens.animation)}${tokenOverridesCssBlock(':root:not(.dark)', advancedTokens.details.light)}${tokenOverridesCssBlock('.dark', advancedTokens.details.dark)}${tokenOverridesCssBlock(':root,\n.dark', advancedTokens.details.shared)}${chromeCssBlock()}`
    );
    const generatedJson = $derived(
        JSON.stringify(
            {
                ...theme,
                studio: {
                    presetSlug: selectedPreset,
                    headerSize,
                    headerWeight,
                    roleWeights,
                    brandColors,
                    foundationColors,
                    advancedTokens,
                    surfaceShadows,
                    controlShadows,
                    dialogShadows,
                    travelingHighlight,
                    primaryStroke,
                    interactiveCursor
                },
                css: generatedCss
            },
            null,
            2
        )
    );

    function emptyAdvancedTokens(): AdvancedTokens {
        return {
            colors: { light: {}, dark: {} },
            spacing: {},
            animation: {},
            details: { light: {}, dark: {}, shared: {} }
        };
    }

    function countTokenOverrides<T extends string>(overrides: Partial<Record<T, string>>) {
        return (Object.values(overrides) as (string | undefined)[]).filter((value) => value?.trim())
            .length;
    }

    function foundationCssBlock(selector: string, colors: FoundationPalette) {
        const declarations = [
            `--color-card: ${colors.base};`,
            `--color-panel: ${colors.base};`,
            `--color-border: ${colors.border};`,
            `--color-input: ${colors.border};`,
            `--color-background: ${colors.background};`,
            `--color-secondary: ${colors.secondary};`,
            `--color-foreground: ${colors.foreground};`,
            `--color-foreground-muted: ${colors.foregroundMuted};`,
            `--color-on-primary: ${colors.onPrimary};`,
            `--color-button-foreground: ${colors.buttonForeground};`
        ];

        return `${selector} {\n${declarations.map((declaration) => `\t${declaration}`).join('\n')}\n}\n`;
    }

    function brandCssBlock(selector: string, color: string) {
        const declarations = [
            `--color-primary: ${color};`,
            `--color-primary-hover: color-mix(in srgb, ${color} 78%, black);`,
            `--color-ring: color-mix(in srgb, ${color} 30%, transparent);`
        ];

        return `${selector} {\n${declarations.map((declaration) => `\t${declaration}`).join('\n')}\n}\n`;
    }

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

    function chromeCssBlock() {
        const shared = [`--ui-cursor-interactive: ${interactiveCursor};`];
        if (!surfaceShadows) {
            shared.push('--elevation-1: none;', '--elevation-float: none;');
        }
        if (!dialogShadows) {
            shared.push('--elevation-modal: none;');
        }
        if (!controlShadows) {
            shared.push(
                `--elevation-control: ${FLAT_CONTROL_SHADOW};`,
                `--elevation-button-outline: ${FLAT_CONTROL_SHADOW};`
            );
        }
        if (!travelingHighlight) {
            shared.push('--sivir-traveling-highlight: none;');
        }
        const light = [
            `--color-primary-stroke: ${
                primaryStroke ? 'color-mix(in srgb, black 14%, transparent)' : 'transparent'
            };`,
            ...shared
        ];
        const dark = [
            `--color-primary-stroke: ${
                primaryStroke ? 'color-mix(in srgb, white 24%, transparent)' : 'transparent'
            };`,
            ...shared
        ];

        return `:root:not(.dark) {\n${light.map((declaration) => `\t${declaration}`).join('\n')}\n}\n.dark {\n${dark.map((declaration) => `\t${declaration}`).join('\n')}\n}\n`;
    }

    function tokenOverridesCssBlock<T extends string>(
        selector: string,
        overrides: Partial<Record<T, string>>
    ) {
        const entries = Object.entries(overrides) as [string, string | undefined][];
        const declarations = entries
            .filter(
                (entry): entry is [string, string] =>
                    typeof entry[1] === 'string' && entry[1].trim().length > 0
            )
            .map(([name, value]) => `${name}: ${value.trim()};`);
        if (declarations.length === 0) {
            return '';
        }

        return `${selector} {\n${declarations.map((declaration) => `\t${declaration}`).join('\n')}\n}\n`;
    }

    function formatChoice(value: string) {
        if (value === 'comfortable') return 'Comfy';
        if (value === 'expressive') return 'Bold';
        if (value === 'true') return 'True';
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    function isRadiusScale(value: string): value is Theme['radius'] {
        return (radiusScales as readonly string[]).includes(value);
    }

    function isDensity(value: string): value is Theme['density'] {
        return (densities as readonly string[]).includes(value);
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

    function loadStudioExtensions() {
        const raw = localStorage.getItem(STUDIO_EXTENSIONS_KEY);
        if (!raw) return;
        try {
            const value = JSON.parse(raw) as Partial<StudioExtensions>;
            if (typeof value.presetSlug === 'string') {
                const preset = builtInThemePresets.find(
                    (candidate) => candidate.slug === value.presetSlug
                );
                if (preset) {
                    selectedPreset = preset.slug;
                    previousPreset = preset.slug;
                    baseTheme = { ...preset };
                }
            }
            if (typeof value.headerSize === 'number') headerSize = value.headerSize;
            if (value.headerWeight) headerWeight = value.headerWeight;
            if (value.roleWeights) {
                roleWeights = { ...DEFAULT_ROLE_WEIGHTS, ...value.roleWeights };
            }
            if (value.foundationColors) {
                const lightFoundationColors = value.foundationColors.light as FoundationPalette & {
                    muted?: string;
                };
                const darkFoundationColors = value.foundationColors.dark as FoundationPalette & {
                    muted?: string;
                };
                const { muted: _lightMuted, ...light } = lightFoundationColors;
                const { muted: _darkMuted, ...dark } = darkFoundationColors;

                foundationColors = {
                    light: {
                        ...DEFAULT_FOUNDATION_COLORS.light,
                        ...light
                    },
                    dark: {
                        ...DEFAULT_FOUNDATION_COLORS.dark,
                        ...dark
                    }
                };
            }
            if (value.advancedTokens) {
                const lightTokens = {
                    ...value.advancedTokens.colors?.light
                } as Record<string, string | undefined>;
                const darkTokens = {
                    ...value.advancedTokens.colors?.dark
                } as Record<string, string | undefined>;
                const { '--color-muted': _lightMuted, ...light } = lightTokens;
                const { '--color-muted': _darkMuted, ...dark } = darkTokens;

                advancedTokens = {
                    colors: {
                        light,
                        dark
                    },
                    spacing: { ...value.advancedTokens.spacing },
                    animation: { ...value.advancedTokens.animation },
                    details: {
                        light: { ...value.advancedTokens.details?.light },
                        dark: { ...value.advancedTokens.details?.dark },
                        shared: { ...value.advancedTokens.details?.shared }
                    }
                };
            }
            if (value.brandColors) {
                brandColors = {
                    light: value.brandColors.light ?? baseTheme.brand,
                    dark: value.brandColors.dark ?? baseTheme.brand
                };
            }
            const shadowsOff = (value as { shadows?: unknown }).shadows === false;
            if (typeof value.surfaceShadows === 'boolean') {
                surfaceShadows = value.surfaceShadows;
            } else if (shadowsOff) {
                surfaceShadows = false;
            }
            if (typeof value.controlShadows === 'boolean') {
                controlShadows = value.controlShadows;
            } else if (shadowsOff) {
                controlShadows = false;
            }
            if (typeof value.dialogShadows === 'boolean') {
                dialogShadows = value.dialogShadows;
            } else if (shadowsOff) {
                dialogShadows = false;
            }
            if (typeof value.travelingHighlight === 'boolean') {
                travelingHighlight = value.travelingHighlight;
            }
            if (typeof value.primaryStroke === 'boolean') {
                primaryStroke = value.primaryStroke;
            }
            if (value.interactiveCursor === 'default' || value.interactiveCursor === 'pointer') {
                interactiveCursor = value.interactiveCursor;
            }
        } catch {
            localStorage.removeItem(STUDIO_EXTENSIONS_KEY);
        }
    }

    function saveStudioExtensions() {
        const extensions: StudioExtensions = {
            presetSlug: selectedPreset,
            headerSize,
            headerWeight,
            roleWeights: { ...roleWeights },
            brandColors: { ...brandColors },
            foundationColors: {
                light: { ...foundationColors.light },
                dark: { ...foundationColors.dark }
            },
            advancedTokens: {
                colors: {
                    light: { ...advancedTokens.colors.light },
                    dark: { ...advancedTokens.colors.dark }
                },
                spacing: { ...advancedTokens.spacing },
                animation: { ...advancedTokens.animation },
                details: {
                    light: { ...advancedTokens.details.light },
                    dark: { ...advancedTokens.details.dark },
                    shared: { ...advancedTokens.details.shared }
                }
            },
            surfaceShadows,
            controlShadows,
            dialogShadows,
            travelingHighlight,
            primaryStroke,
            interactiveCursor
        };
        localStorage.setItem(STUDIO_EXTENSIONS_KEY, JSON.stringify(extensions));
    }

    function applyPreset(slug: string) {
        const preset = builtInThemePresets.find((candidate) => candidate.slug === slug);
        if (!preset) return;

        const draftIdentity = {
            slug: theme.slug,
            name: theme.name,
            description: theme.description
        };
        baseTheme = { ...preset };
        theme = { ...preset, ...draftIdentity };
        headerSize = 16;
        headerWeight = '600';
        roleWeights = { ...DEFAULT_ROLE_WEIGHTS };
        foundationColors = {
            light: { ...DEFAULT_FOUNDATION_COLORS.light },
            dark: { ...DEFAULT_FOUNDATION_COLORS.dark }
        };
        advancedTokens = emptyAdvancedTokens();
        brandColors = { light: preset.brand, dark: preset.brand };
        surfaceShadows =
            preset.chrome?.shadows !== false && preset.chrome?.surfaceShadows !== false;
        controlShadows =
            preset.chrome?.shadows !== false && preset.chrome?.controlShadows !== false;
        dialogShadows = preset.chrome?.shadows !== false && preset.chrome?.dialogShadows !== false;
        travelingHighlight = preset.chrome?.travelingHighlight !== false;
        primaryStroke = false;
        interactiveCursor = 'default';
        syncFontSelections(theme);
    }

    function resetTheme() {
        theme = {
            ...baseTheme,
            slug: theme.slug,
            name: theme.name,
            description: theme.description
        };
        headerSize = 16;
        headerWeight = '600';
        roleWeights = { ...DEFAULT_ROLE_WEIGHTS };
        foundationColors = {
            light: { ...DEFAULT_FOUNDATION_COLORS.light },
            dark: { ...DEFAULT_FOUNDATION_COLORS.dark }
        };
        advancedTokens = emptyAdvancedTokens();
        brandColors = { light: baseTheme.brand, dark: baseTheme.brand };
        surfaceShadows =
            baseTheme.chrome?.shadows !== false && baseTheme.chrome?.surfaceShadows !== false;
        controlShadows =
            baseTheme.chrome?.shadows !== false && baseTheme.chrome?.controlShadows !== false;
        dialogShadows =
            baseTheme.chrome?.shadows !== false && baseTheme.chrome?.dialogShadows !== false;
        travelingHighlight = baseTheme.chrome?.travelingHighlight !== false;
        primaryStroke = false;
        interactiveCursor = 'default';
        syncFontSelections(theme);
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

        if (row.bucket === 'animation' && row.definition.kind !== 'ease') {
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
        if (!pendingPreset) return;
        previousPreset = pendingPreset;
        selectedPreset = pendingPreset;
        applyPreset(pendingPreset);
        pendingPreset = null;
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
        const storedTheme = loadStudioTheme();
        if (storedTheme) {
            theme = { ...storedTheme };
            syncFontSelections(theme);
        }
        loadStudioExtensions();
        previousRadius = theme.radius;
        previousDensity = theme.density;
        previousMotion = theme.motion;
        hydrated = true;
        const root = document.documentElement;
        appliedDark = root.classList.contains('dark');
        const observer = new MutationObserver(() => {
            appliedDark = root.classList.contains('dark');
        });
        observer.observe(root, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
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
        const css = generatedCss;
        document.documentElement.style.removeProperty('--font-sans');
        applyLiveThemeCss(css);
        untrack(() => {
            liveCssVersion += 1;
        });
        saveStudioTheme({ ...theme });
        saveStudioExtensions();
    });
</script>

<svelte:head>
    <title>Sivir · Theme Studio</title>
    <meta name="description" content="Build, preview, and export a Sivir theme." />
</svelte:head>

{#snippet sectionHeading(title: string)}
    <h2 class="m-0 text-[13px] font-medium text-foreground">{title}</h2>
{/snippet}

{#snippet feelSelect(
    label: string,
    value: string,
    options: readonly string[],
    openAdvanced: () => void,
    onChange: (value: string) => void
)}
    <Select.Root
        {value}
        onValueChange={(next) => {
            if (next === 'advanced') {
                openAdvanced();
                return;
            }

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
            <Select.Item value="advanced" label="Advanced…">Advanced…</Select.Item>
        </Select.Content>
    </Select.Root>
{/snippet}

{#snippet weightField(label: string, value: FontWeight, onChange: (value: FontWeight) => void)}
    <Slider.Root
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

{#snippet tokenMeta(row: TokenRow)}
    <div
        class="flex min-w-0 items-center justify-end px-3 pt-1"
        transition:themedSlide={{ durationVar: '--motion-duration-panel', fallback: 220 }}
    >
        {@render tokenResetButton(row)}
    </div>
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

{#snippet tokenRow(row: TokenRow)}
    {@const changed = tokenOverride(row) !== ''}
    {@const slider = tokenSlider(row)}
    {@const isShadow = row.bucket === 'detail' && row.definition.kind === 'shadow'}
    <div class={`flex min-w-0 flex-col ${isShadow ? 'gap-1 pb-5' : ''}`}>
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
                value={slider.value}
                min={slider.min}
                max={slider.max}
                step={slider.step}
                label={row.definition.label}
                format={slider.format}
                onValueChange={slider.commit}
                class="min-h-[34px] text-[13px]"
            >
                <Slider.Range />
                <Slider.Thumb />
                <Slider.Label class="flex items-center gap-1.5">
                    <span class="truncate">{row.definition.label}</span>
                    <ChangedDot {changed} />
                </Slider.Label>
                <Slider.Value class="text-xs" />
            </Slider.Root>
        {/if}
        {#if changed && !isShadow}
            {@render tokenMeta(row)}
        {/if}
    </div>
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
        <div class="flex shrink-0 flex-col gap-3 pb-3">
            <div class="flex h-8 items-center justify-between gap-2">
                <Typography.Title level={1}>Theme studio</Typography.Title>
                <Tooltip.Root>
                    <Tooltip.Trigger>
                        <Button
                            variant="ghost"
                            size="icon"
                            class="size-8 shrink-0 text-foreground-muted"
                            disabled={!dirty}
                            onclick={resetTheme}
                            aria-label="Reset theme to selected preset"
                        >
                            <RotateCcw size={15} />
                        </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>Reset to preset</Tooltip.Content>
                </Tooltip.Root>
            </div>
            <Select.Root bind:value={selectedPreset}>
                <SelectFieldTrigger label="Preset">
                    {builtInThemePresets.find((preset) => preset.slug === selectedPreset)?.name ??
                        'Default'}
                </SelectFieldTrigger>
                <Select.Content class="max-h-56 min-w-[max(16rem,var(--popover-trigger-width))]">
                    {#each builtInThemePresets as preset (preset.slug)}
                        <Select.Item value={preset.slug} label={preset.name}>
                            {preset.name}
                        </Select.Item>
                    {/each}
                </Select.Content>
            </Select.Root>
        </div>

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
                                bind:value={headerSize}
                                min={16}
                                max={48}
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
                                {@render feelSelect(
                                    'Radius',
                                    theme.radius,
                                    radiusScales,
                                    () => {
                                        openTokens('space', 'Corners');
                                    },
                                    (value) => {
                                        if (isRadiusScale(value)) {
                                            theme = { ...theme, radius: value };
                                        }
                                    }
                                )}
                                {@render feelSelect(
                                    'Density',
                                    theme.density,
                                    densities,
                                    () => {
                                        openTokens('space', 'Spacing');
                                    },
                                    (value) => {
                                        if (isDensity(value)) {
                                            theme = { ...theme, density: value };
                                        }
                                    }
                                )}
                                {@render feelSelect(
                                    'Movement',
                                    theme.motion,
                                    movementPresets,
                                    () => {
                                        openTokens('motion', 'Speed');
                                    },
                                    (value) => {
                                        if (isMotionFeel(value)) {
                                            theme = { ...theme, motion: value };
                                        }
                                    }
                                )}
                            </div>
                        </section>

                        <section class="flex flex-col gap-2">
                            {@render sectionHeading('Depth')}
                            <div class="flex flex-col gap-4 px-0.5 pt-1">
                                <Switch
                                    bind:checked={surfaceShadows}
                                    label="Card & menu shadows"
                                    description="Lift on cards, selects, dropdowns, and popovers."
                                />
                                <Switch
                                    bind:checked={controlShadows}
                                    label="Control shadows"
                                    description="Depth on inputs, buttons, and alerts."
                                />
                                <Switch
                                    bind:checked={dialogShadows}
                                    label="Dialog shadows"
                                    description="Lift on modals and sheets."
                                />
                                <Switch
                                    bind:checked={primaryStroke}
                                    label="Primary stroke"
                                    description="A light inset edge on primary buttons."
                                />
                            </div>
                        </section>

                        <section class="flex flex-col gap-2">
                            {@render sectionHeading('Interaction')}
                            <div class="flex flex-col gap-4 px-0.5 pt-1">
                                <Switch
                                    bind:checked={travelingHighlight}
                                    label="Traveling highlight"
                                    description="Slide the hover highlight between items. Off keeps the fill without the motion."
                                />
                            </div>
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
                                        <Select.Item value={choice} label={formatChoice(choice)}>
                                            {formatChoice(choice)}
                                        </Select.Item>
                                    {/each}
                                </Select.Content>
                            </Select.Root>
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

        <footer class="grid shrink-0 grid-cols-2 gap-2 border-t border-border pt-3">
            <CopyButton
                text={generatedCss}
                label="Copy CSS"
                copiedLabel="Copied"
                variant="primary"
                size="md"
                class="w-full [&_svg]:!text-[var(--color-on-primary)]"
            >
                Copy CSS
            </CopyButton>
            <CopyButton
                text={generatedJson}
                label="Copy JSON"
                copiedLabel="Copied"
                variant="outline"
                size="md"
                class="w-full"
            >
                Copy JSON
            </CopyButton>
        </footer>
    </div>
{/snippet}

{#snippet dashboardPreview()}
    <ScrollArea class="h-full min-h-0" showCues={false}>
        <div class="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 pt-2 pb-8">
            <Toolbar class="gap-2 p-0">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger variant="quiet" class="min-w-0 justify-start px-0">
                        <Avatar.Root size="sm" shape="square">
                            <Avatar.Fallback>NL</Avatar.Fallback>
                        </Avatar.Root>
                        <Typography.Text variant="supporting" class="truncate text-foreground">
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
                                <span class="flex items-center gap-2 text-[var(--color-error)]">
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
                                is still open. The next collection run starts tomorrow at 9:00 AM.
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
                    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
                                        Draft a customer invoice. You can add line items later.
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
                                <Select.Item value="overdue" label="Overdue">Overdue</Select.Item>
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
                                            <Badge variant={invoiceBadgeVariant(invoice.status)}>
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
                                    <Input bind:value={companyName} label="Workspace name" />
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
    </ScrollArea>
{/snippet}

<div data-docs-page class="flex min-h-0 min-w-0 flex-1 flex-col bg-background text-foreground">
    <section aria-label="Theme workspace" class="flex min-h-0 flex-1 bg-background">
        <aside
            aria-label="Theme configuration"
            class="hidden min-h-0 w-[344px] shrink-0 px-4 pt-1 pb-3 min-[1100px]:flex min-[1100px]:flex-col"
        >
            {@render inspector()}
        </aside>

        <div class="min-w-0 flex-1 pr-3 pb-3 pl-0">
            <div
                class="h-full min-h-0 overflow-hidden rounded-[var(--radius-xl)] border border-border bg-background font-[var(--font-sans)] text-foreground"
                id="theme-preview"
            >
                {@render dashboardPreview()}
            </div>
        </div>
    </section>

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

    <AlertDialog.Root bind:open={presetDialogOpen} orientation="vertical">
        <AlertDialog.Content>
            <AlertDialog.Header>
                <AlertDialog.Title>Replace your current draft?</AlertDialog.Title>
                <AlertDialog.Description>
                    Switching to
                    {builtInThemePresets.find((preset) => preset.slug === pendingPreset)
                        ?.name ?? 'this preset'}
                    resets every changed color, type, shape, and motion value.
                </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
                <AlertDialog.Exit onclick={() => (pendingPreset = null)}>
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
