
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.

namespace RizzyUI;

/// <summary>
///     Represents the comprehensive theme data for the RizzyUI application.
///     It holds semantic colors (light/dark variants), status colors, border settings,
///     and references to style definitions for all individual RizzyUI components.
///     This class allows for theme customization and provides styling context to components.
/// </summary>
public partial class RzTheme
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="RzTheme" /> class, setting the name, code,
    ///     and instantiating all default component style definitions.
    /// </summary>
    /// <param name="name">The full, human-readable name of the theme.</param>
    /// <param name="themeCode">The short, lowercase code name for the theme.</param>
    public RzTheme(string name, string themeCode)
    {
        Name = name;
        ThemeCode = themeCode;

        // Instantiate default styles for all components
        RzAccordion = new DefaultRzAccordionStyles(this);
        AccordionItem = new DefaultAccordionItemStyles(this); // Corrected name
        RzAlert = new DefaultRzAlertStyles(this);
        AlertTitle = new DefaultAlertTitleStyles(this);
        AlertDescription = new DefaultAlertDescriptionStyles(this);
        RzArticle = new DefaultRzArticleStyles(this);
        RzAvatar = new DefaultRzAvatarStyles(this);
        AvatarImage = new DefaultAvatarImageStyles(this);
        AvatarFallback = new DefaultAvatarFallbackStyles(this);
        RzBadge = new DefaultRzBadgeStyles(this);
        RzBreadcrumb = new DefaultRzBreadcrumbStyles(this);
        RzBrowser = new DefaultRzBrowserStyles(this);
        RzButton = new DefaultRzButtonStyles(this);
        RzButtonGroup = new DefaultRzButtonGroupStyles(this);
        RzCard = new DefaultRzCardStyles(this);
        RzCardBody = new DefaultRzCardBodyStyles(this);
        RzCardButtons = new DefaultRzCardButtonsStyles(this);
        RzCardFooter = new DefaultRzCardFooterStyles(this);
        RzCardHeader = new DefaultRzCardHeaderStyles(this);
        RzCardSubtitle = new DefaultRzCardSubtitleStyles(this);
        RzCardTitle = new DefaultRzCardTitleStyles(this);
        RzCheckboxGroup = new DefaultRzCheckboxGroupStyles(this);
        RzCheckboxGroupField = new DefaultRzCheckboxGroupFieldStyles(this);
        RzCheckboxGroupItem = new DefaultRzCheckboxGroupItemStyles(this);
        RzCodeViewer = new DefaultRzCodeViewerStyles(this);
        RzDarkmodeToggle = new DefaultRzDarkmodeToggleStyles(this);
        RzDateEdit = new DefaultRzDateEditStyles(this);
        RzDivider = new DefaultRzDividerStyles(this);
        RzDropdownMenu = new DefaultRzDropdownMenuStyles(this);
        RzEmbeddedPreview = new DefaultRzEmbeddedPreviewStyles(this);
        RzField = new DefaultRzFieldStyles(this);
        RzFieldHelp = new DefaultRzFieldHelpStyles(this);
        RzFieldLabel = new DefaultRzFieldLabelStyles(this);
        RzFormSection = new DefaultRzFormSectionStyles(this);
        RzHeading = new DefaultRzHeadingStyles(this);
        RzIndicator = new DefaultRzIndicatorStyles(this);
        RzLink = new DefaultRzLinkStyles(this);
        RzMarkdown = new DefaultRzMarkdownStyles(this);
        RzModal = new DefaultRzModalStyles(this);
        RzNavbar = new DefaultRzNavbarStyles(this);
        RzNavigationMenu = new DefaultRzNavigationMenuStyles(this);
        RzNumberEdit = new DefaultRzNumberEditStyles(this);
        RzNumberField = new DefaultRzNumberFieldStyles(this);
        RzParagraph = new DefaultRzParagraphStyles(this);
        RzPopover = new DefaultRzPopoverStyles(this);
        RzProgress = new DefaultRzProgressStyles(this);
        RzQuickReferenceContainer = new DefaultRzQuickReferenceContainerStyles(this);
        RzQuickReference = new DefaultRzQuickReferenceStyles(this);
        RzRadioGroup = new DefaultRzRadioGroupStyles(this);
        RzRadioGroupField = new DefaultRzRadioGroupFieldStyles(this);
        RzRadioGroupItem = new DefaultRzRadioGroupItemStyles(this);
        RzSearchButton = new DefaultRzSearchButtonStyles(this);
        RzSidebar = new DefaultRzSidebarStyles(this);
        RzSidebarLinkItem = new DefaultRzSidebarLinkItemStyles(this);
        RzSidebarLinks = new DefaultRzSidebarLinksStyles(this);
        RzSpinner = new DefaultRzSpinnerStyles(this);
        RzSteps = new DefaultRzStepsStyles(this);
        RzTable = new DefaultRzTableStyles(this);
        RzTableHeaderCell = new DefaultRzTableHeaderCellStyles(this);
        RzTableBody = new DefaultRzTableBodyStyles(this);
        RzTableRow = new DefaultRzTableRowStyles(this);
        RzTableCell = new DefaultRzTableCellStyles(this);
        RzPagination = new DefaultRzPaginationStyles(this);
        RzTabs = new DefaultRzTabsStyles(this);
        RzTab = new DefaultRzTabStyles(this);
        RzTabPanel = new DefaultRzTabPanelStyles(this);
        RzTabStrip = new DefaultRzTabStripStyles(this);
        RzTextEdit = new DefaultRzTextEditStyles(this);
        RzTextField = new DefaultRzTextFieldStyles(this);
        RzToggle = new DefaultRzToggleStyles(this);
        RzToggleField = new DefaultRzToggleFieldStyles(this);
        RzTypography = new DefaultRzTypographyStyles(this);
    }

    /// <summary>
    ///     Gets the full, human-readable name of the theme (e.g., "Arctic", "High Contrast").
    /// </summary>
    public string Name { get; init; }

    /// <summary>
    ///     Gets the short code name of the theme (lowercase, no spaces, e.g., "arctic", "highcontrast").
    ///     Used internally, such as for generating theme-specific CSS token names.
    /// </summary>
    public string ThemeCode { get; init; }

    /// <summary>
    ///     Gets or sets the color scheme definitions for the light mode variant of the theme.
    /// </summary>
    public RzThemeVariant Light { get; set; } = new();

    /// <summary>
    ///     Gets or sets the color scheme definitions for the dark mode variant of the theme.
    /// </summary>
    public RzThemeVariant Dark { get; set; } = new();
    
    // Status colors are now part of RzThemeVariant to align with kitchen sink's light/dark definitions for --destructive
    // Other status colors (Info, Warning, Success) might still be defined globally if they don't have distinct light/dark CSS vars in kitchen sink
    // For now, assuming they are part of RzThemeVariant for consistency, but their actual values might be the same for light/dark if not specified otherwise by kitchen sink.

    /// <summary>
    ///     Gets the default border width value used across components (e.g., "1px").
    /// </summary>
    public string BorderWidth { get; protected init; }

    /// <summary>
    ///     Gets the default border radius value used across components (e.g., "6px", "0.5rem").
    /// </summary>
    public string BorderRadius { get; protected init; }

    /// <summary>
    ///     Gets the default Arctic theme instance.
    /// </summary>
    public static RzTheme Default => ArcticTheme;

    /// <summary>
    ///     Gets a new instance of the Arctic theme.
    /// </summary>
    public static RzTheme ArcticTheme => new ArcticTheme();

    // Other theme instances can be added here if needed
    // public static RzTheme HighContrastTheme => new HighContrastTheme();
    // public static RzTheme ModernTheme => new ModernTheme();
    // public static RzTheme NewsTheme => new NewsTheme();
}

#pragma warning restore CS8618