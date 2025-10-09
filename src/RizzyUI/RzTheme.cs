
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

        // BEGIN DELETE ME
        RzButtonStyles = new DefaultRzButtonStyles(this); // DELETE ME
        RzBreadcrumbStyles = new DefaultRzBreadcrumbStyles(this); // DELETE ME
        // END DELETE ME
        
        // Instantiate default styles for all components
        RzAccordion = new DefaultRzAccordionStyles(this);
        AccordionItem = new DefaultAccordionItemStyles(this); // Corrected name
        RzAlert = new DefaultRzAlertStyles(this);
        AlertTitle = new DefaultAlertTitleStyles(this);
        AlertDescription = new DefaultAlertDescriptionStyles(this);
        RzArticle = new DefaultRzArticleStyles(this);
        RzAspectRatio = new DefaultRzAspectRatioStyles(this);
        RzAvatar = new DefaultRzAvatarStyles(this);
        AvatarImage = new DefaultAvatarImageStyles(this);
        AvatarFallback = new DefaultAvatarFallbackStyles(this);
        RzBadge = new DefaultRzBadgeStyles(this);
        RzBreadcrumb = RizzyUI.RzBreadcrumb.DefaultDescriptor;
        BreadcrumbList = RizzyUI.BreadcrumbList.DefaultDescriptor;
        BreadcrumbItem = RizzyUI.BreadcrumbItem.DefaultDescriptor;
        BreadcrumbLink = RizzyUI.BreadcrumbLink.DefaultDescriptor;
        BreadcrumbPage = RizzyUI.BreadcrumbPage.DefaultDescriptor;
        BreadcrumbSeparator = RizzyUI.BreadcrumbSeparator.DefaultDescriptor;
        BreadcrumbEllipsis = RizzyUI.BreadcrumbEllipsis.DefaultDescriptor;        
        RzBrowser = new DefaultRzBrowserStyles(this);
        RzButton = RizzyUI.RzButton.DefaultDescriptor;
        RzButtonGroup = new DefaultRzButtonGroupStyles(this);
        RzCard = new DefaultRzCardStyles(this);
        CardContent = new DefaultCardContentStyles(this);
        CardAction = new DefaultCardActionStyles(this);
        CardFooter = new DefaultCardFooterStyles(this);
        CardHeader = new DefaultCardHeaderStyles(this);
        CardDescription = new DefaultCardDescriptionStyles(this);
        CardTitle = new DefaultCardTitleStyles(this);
        RzCarousel = new DefaultRzCarouselStyles(this);
        RzCheckboxGroup = new DefaultRzCheckboxGroupStyles(this);
        RzCheckboxGroupField = new DefaultRzCheckboxGroupFieldStyles(this);
        RzCheckboxGroupItem = new DefaultRzCheckboxGroupItemStyles(this);
        RzCodeViewer = new DefaultRzCodeViewerStyles(this);
        RzCollapsible = new DefaultRzCollapsibleStyles(this);
        RzDarkmodeToggle = new DefaultRzDarkmodeToggleStyles(this);
        RzDateEdit = new DefaultRzDateEditStyles(this);
        RzDialog = new DefaultRzDialogStyles(this);
        RzSeparator = new DefaultRzSeparatorStyles(this);
        RzDropdownMenu = new DefaultRzDropdownMenuStyles(this);
        RzEmbeddedPreview = new DefaultRzEmbeddedPreviewStyles(this);
        RzEmpty = new DefaultRzEmptyStyles(this);
        RzField = new DefaultRzFieldStyles(this);
        RzFieldHelp = new DefaultRzFieldHelpStyles(this);
        RzFieldLabel = new DefaultRzFieldLabelStyles(this);
        RzFormSection = new DefaultRzFormSectionStyles(this);
        RzHeading = new DefaultRzHeadingStyles(this);
        RzIndicator = new DefaultRzIndicatorStyles(this);
        RzItemGroup = new DefaultRzItemGroupStyles(this);
        RzItemSeparator = new DefaultRzItemSeparatorStyles(this);
        RzItem = new DefaultRzItemStyles(this);
        ItemMedia = new DefaultItemMediaStyles(this);
        ItemContent = new DefaultItemContentStyles(this);
        ItemTitle = new DefaultItemTitleStyles(this);
        ItemDescription = new DefaultItemDescriptionStyles(this);
        ItemActions = new DefaultItemActionsStyles(this);
        ItemHeader = new DefaultItemHeaderStyles(this);
        ItemFooter = new DefaultItemFooterStyles(this);
        RzKbd = new DefaultRzKbdStyles(this);
        RzKbdGroup = new DefaultRzKbdGroupStyles(this);
        RzLink = new DefaultRzLinkStyles(this);
        RzMarkdown = new DefaultRzMarkdownStyles(this);
        RzNavigationMenu = new DefaultRzNavigationMenuStyles(this);
        RzNumberEdit = new DefaultRzNumberEditStyles(this);
        RzNumberField = new DefaultRzNumberFieldStyles(this);
        RzParagraph = new DefaultRzParagraphStyles(this);
        RzPopover = new DefaultRzPopoverStyles(this);
        PopoverTrigger = new DefaultPopoverTriggerStyles(this);
        PopoverContent = new DefaultPopoverContentStyles(this);
        RzProgress = new DefaultRzProgressStyles(this);
        RzQuickReferenceContainer = new DefaultRzQuickReferenceContainerStyles(this);
        RzQuickReference = new DefaultRzQuickReferenceStyles(this);
        RzRadioGroup = new DefaultRzRadioGroupStyles(this);
        RzRadioGroupField = new DefaultRzRadioGroupFieldStyles(this);
        RzRadioGroupItem = new DefaultRzRadioGroupItemStyles(this);
        RzSearchButton = new DefaultRzSearchButtonStyles(this);
        RzSidebarProvider = new DefaultRzSidebarProviderStyles(this);
        Sidebar = new DefaultSidebarStyles(this);
        SidebarTrigger = new DefaultSidebarTriggerStyles(this);
        SidebarHeader = new DefaultSidebarHeaderStyles(this);
        SidebarContent = new DefaultSidebarContentStyles(this);
        SidebarFooter = new DefaultSidebarFooterStyles(this);
        SidebarGroup = new DefaultSidebarGroupStyles(this);
        SidebarGroupLabel = new DefaultSidebarGroupLabelStyles(this);
        SidebarGroupContent = new DefaultSidebarGroupContentStyles(this);
        SidebarMenu = new DefaultSidebarMenuStyles(this);
        SidebarMenuItem = new DefaultSidebarMenuItemStyles(this);
        SidebarMenuButton = new DefaultSidebarMenuButtonStyles(this);
        SidebarMenuAction = new DefaultSidebarMenuActionStyles(this);
        SidebarMenuSub = new DefaultSidebarMenuSubStyles(this);
        SidebarMenuBadge = new DefaultSidebarMenuBadgeStyles(this);
        SidebarRail = new DefaultSidebarRailStyles(this);
        SidebarSeparator = new DefaultSidebarSeparatorStyles(this);
        SidebarInset = new DefaultSidebarInsetStyles(this);
        RzSpinner = new DefaultRzSpinnerStyles(this);
        RzSteps = new DefaultRzStepsStyles(this);
        RzTable = new DefaultRzTableStyles(this);
        RzTableHeaderCell = new DefaultRzTableHeaderCellStyles(this);
        RzTableBody = new DefaultRzTableBodyStyles(this);
        RzTableRow = new DefaultRzTableRowStyles(this);
        RzTableCell = new DefaultRzTableCellStyles(this);
        RzPagination = new DefaultRzPaginationStyles(this);
        RzSheet = new DefaultRzSheetStyles(this);
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
    
    /// <summary>
    ///     Gets the default border radius value used across components (e.g., "6px", "0.5rem").
    /// </summary>
    public string Radius { get; init; }
   
    /// <summary>
    /// Any additional variables that should be applied to elements using this theme
    /// </summary>
    public Dictionary<string,string>? AdditionalProperties { get; init; }
    
    /// <summary>
    ///     Gets the default Arctic theme instance.
    /// </summary>
    public static RzTheme Default => ArcticTheme;

    /// <summary>
    ///     Gets a new instance of the Arctic theme.
    /// </summary>
    public static RzTheme ArcticTheme => new ArcticTheme();
    
    /// <summary>
    /// Vercel theme instance, loaded from embedded resource.
    /// </summary>
    public static RzTheme VercelTheme => ThemeLoader.LoadFromEmbeddedResourceAsync(typeof(RzTheme).Assembly, "RizzyUI.Themes.vercel.json").GetAwaiter().GetResult()!;

    // Other theme instances can be added here if needed
}

#pragma warning restore CS8618