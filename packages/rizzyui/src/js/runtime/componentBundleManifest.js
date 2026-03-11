/**
 * Canonical Alpine component->bundle ownership map.
 *
 * Rules:
 * - Every JS-backed Alpine data name must map to exactly one bundle.
 * - Shell entrypoints stay intentionally thin and should never eagerly register these.
 * - RzEmpty intentionally has no runtime registration and is excluded from this map.
 */
export const componentBundleManifest = Object.freeze({
    accordionItem: 'core-common',
    rzAccordion: 'core-common',
    rzAlert: 'core-common',
    rzAspectRatio: 'core-common',
    rzBackToTop: 'core-common',
    rzClipboard: 'core-common',
    rzCollapsible: 'core-common',
    rzDarkModeToggle: 'core-common',
    rzHeading: 'core-common',
    rzIndicator: 'core-common',
    rzInputGroupAddon: 'core-common',
    rzPrependInput: 'core-common',
    rzProgress: 'core-common',
    rzTabs: 'core-common',
    rzToggle: 'core-common',

    rzCommand: 'command-runtime',
    rzCommandGroup: 'command-runtime',
    rzCommandItem: 'command-runtime',
    rzCommandList: 'command-runtime',

    rzCombobox: 'advanced-input-runtime',
    rzFileInput: 'advanced-input-runtime',
    rzInputOTP: 'advanced-input-runtime',
    rzScrollArea: 'advanced-input-runtime',
    rzSlider: 'advanced-input-runtime',

    rzCalendar: 'calendar-runtime',
    rzCalendarProvider: 'calendar-runtime',
    rzDateEdit: 'calendar-runtime',

    rzColorPicker: 'color-runtime',
    rzColorPickerProvider: 'color-runtime',
    rzColorSwatch: 'color-runtime',

    rzCarousel: 'content-visual-runtime',
    rzChart: 'content-visual-runtime',
    rzHighlighter: 'content-visual-runtime',
    rzNumberTicker: 'content-visual-runtime',
    rzShineBorder: 'content-visual-runtime',
    rzTypingAnimation: 'content-visual-runtime',

    rzModal: 'dialogs-panels-runtime',
    rzSheet: 'dialogs-panels-runtime',
    rzSidebar: 'dialogs-panels-runtime',

    rzDropdownMenu: 'menu-runtime',
    rzDropdownSubmenu: 'menu-runtime',
    rzMenubar: 'menu-runtime',
    rzNavigationMenu: 'menu-runtime',

    rzPopover: 'popover-tooltip-runtime',
    rzTooltip: 'popover-tooltip-runtime',

    rzBrowser: 'docs-runtime',
    rzCodeViewer: 'docs-runtime',
    rzEmbeddedPreview: 'docs-runtime',
    rzEventViewer: 'docs-runtime',
    rzMarkdown: 'docs-runtime',
    rzQuickReferenceContainer: 'docs-runtime',

    rzConfetti: 'effects-runtime',
});
