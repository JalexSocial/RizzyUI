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

        // RzAlert Family
        RzAlert = RizzyUI.RzAlert.DefaultDescriptor;
        AlertTitle = RizzyUI.AlertTitle.DefaultDescriptor;
        AlertDescription = RizzyUI.AlertDescription.DefaultDescriptor;
        
        // RzAvatar Family
        RzAvatar = RizzyUI.RzAvatar.DefaultDescriptor;

        // RzBadge
        RzBadge = RizzyUI.RzBadge.DefaultDescriptor;

        // RzBreadcrumb Family
        RzBreadcrumb = RizzyUI.RzBreadcrumb.DefaultDescriptor;
        BreadcrumbList = RizzyUI.BreadcrumbList.DefaultDescriptor;
        BreadcrumbItem = RizzyUI.BreadcrumbItem.DefaultDescriptor;
        BreadcrumbLink = RizzyUI.BreadcrumbLink.DefaultDescriptor;
        BreadcrumbPage = RizzyUI.BreadcrumbPage.DefaultDescriptor;
        BreadcrumbSeparator = RizzyUI.BreadcrumbSeparator.DefaultDescriptor;
        BreadcrumbEllipsis = RizzyUI.BreadcrumbEllipsis.DefaultDescriptor;        
        
        // RzButton
        RzButton = RizzyUI.RzButton.DefaultDescriptor;

        // RzDialog Family
        RzDialog = RizzyUI.RzDialog.DefaultDescriptor;
        DialogContent = RizzyUI.DialogContent.DefaultDescriptor;
        DialogHeader = RizzyUI.DialogHeader.DefaultDescriptor;
        DialogFooter = RizzyUI.DialogFooter.DefaultDescriptor;
        DialogTitle = RizzyUI.DialogTitle.DefaultDescriptor;
        DialogTrigger = RizzyUI.DialogTrigger.DefaultDescriptor;
        DialogClose = RizzyUI.DialogClose.DefaultDescriptor;        
        DialogDescription = RizzyUI.DialogDescription.DefaultDescriptor;
        
        // RzEmpty Family
        RzEmpty = RizzyUI.RzEmpty.DefaultDescriptor;
        EmptyHeader = RizzyUI.EmptyHeader.DefaultDescriptor;
        EmptyMedia = RizzyUI.EmptyMedia.DefaultDescriptor;
        EmptyTitle = RizzyUI.EmptyTitle.DefaultDescriptor;
        EmptyDescription = RizzyUI.EmptyDescription.DefaultDescriptor;
        EmptyContent = RizzyUI.EmptyContent.DefaultDescriptor;
        
        // RzIndicator
        RzIndicator = RizzyUI.RzIndicator.DefaultDescriptor;

        // RzPopover Family
        RzPopover = RizzyUI.RzPopover.DefaultDescriptor;
        PopoverTrigger = RizzyUI.PopoverTrigger.DefaultDescriptor;
        PopoverContent = RizzyUI.PopoverContent.DefaultDescriptor;
        
        // RzProgress
        RzProgress = RizzyUI.RzProgress.DefaultDescriptor;

        // RzSeparator
        RzSeparator = RizzyUI.RzSeparator.DefaultDescriptor;

        // RzSheet Family
        RzSheet = RizzyUI.RzSheet.DefaultDescriptor;
        SheetContent = RizzyUI.SheetContent.DefaultDescriptor;
        SheetHeader = RizzyUI.SheetHeader.DefaultDescriptor;
        SheetFooter = RizzyUI.SheetFooter.DefaultDescriptor;
        SheetTitle = RizzyUI.SheetTitle.DefaultDescriptor;
        SheetDescription = RizzyUI.SheetDescription.DefaultDescriptor;
        SheetTrigger = RizzyUI.SheetTrigger.DefaultDescriptor;
        SheetClose = RizzyUI.SheetClose.DefaultDescriptor;
        
        // RzSpinner
        RzSpinner = RizzyUI.RzSpinner.DefaultDescriptor;
        
        // Typography Family
        RzKbd = RizzyUI.RzKbd.DefaultDescriptor;
        RzKbdGroup = RizzyUI.RzKbdGroup.DefaultDescriptor;
        RzHeading = RizzyUI.RzHeading.DefaultDescriptor;
        RzParagraph = RizzyUI.RzParagraph.DefaultDescriptor;
        
        // Layout Components (Migrated)
        RzAccordion = RizzyUI.RzAccordion.DefaultDescriptor;
        AccordionItem = RizzyUI.AccordionItem.DefaultDescriptor;
        RzArticle = RizzyUI.RzArticle.DefaultDescriptor;
        RzAspectRatio = RizzyUI.RzAspectRatio.DefaultDescriptor;
        RzCard = RizzyUI.RzCard.DefaultDescriptor;
        CardContent = RizzyUI.CardContent.DefaultDescriptor;
        CardAction = RizzyUI.CardAction.DefaultDescriptor;
        CardFooter = RizzyUI.CardFooter.DefaultDescriptor;
        CardHeader = RizzyUI.CardHeader.DefaultDescriptor;
        CardDescription = RizzyUI.CardDescription.DefaultDescriptor;
        CardTitle = RizzyUI.CardTitle.DefaultDescriptor;
        RzCarousel = RizzyUI.RzCarousel.DefaultDescriptor;
        CarouselNext = RizzyUI.CarouselNext.DefaultDescriptor;
        CarouselPrevious = RizzyUI.CarouselPrevious.DefaultDescriptor;
        CarouselContent = RizzyUI.CarouselContent.DefaultDescriptor;
        CarouselItem = RizzyUI.CarouselItem.DefaultDescriptor;
        RzCollapsible = RizzyUI.RzCollapsible.DefaultDescriptor;
        CollapsibleTrigger = RizzyUI.CollapsibleTrigger.DefaultDescriptor;
        CollapsibleContent = RizzyUI.CollapsibleContent.DefaultDescriptor;
        RzItemGroup = RizzyUI.RzItemGroup.DefaultDescriptor;
        RzItemSeparator = RizzyUI.RzItemSeparator.DefaultDescriptor;
        RzItem = RizzyUI.RzItem.DefaultDescriptor;
        ItemMedia = RizzyUI.ItemMedia.DefaultDescriptor;
        ItemContent = RizzyUI.ItemContent.DefaultDescriptor;
        ItemTitle = RizzyUI.ItemTitle.DefaultDescriptor;
        ItemDescription = RizzyUI.ItemDescription.DefaultDescriptor;
        ItemActions = RizzyUI.ItemActions.DefaultDescriptor;
        ItemHeader = RizzyUI.ItemHeader.DefaultDescriptor;
        ItemFooter = RizzyUI.ItemFooter.DefaultDescriptor;
        RzSearchButton = RizzyUI.RzSearchButton.DefaultDescriptor;
        RzSteps = RizzyUI.RzSteps.DefaultDescriptor;
        RzBrowser = RizzyUI.RzBrowser.DefaultDescriptor;

        RzCodeViewer = RizzyUI.RzCodeViewer.DefaultDescriptor;
        RzEmbeddedPreview = RizzyUI.RzEmbeddedPreview.DefaultDescriptor;
        RzMarkdown = RizzyUI.RzMarkdown.DefaultDescriptor;
        RzQuickReference = RizzyUI.RzQuickReference.DefaultDescriptor;
        RzQuickReferenceContainer = RizzyUI.RzQuickReferenceContainer.DefaultDescriptor;
        
        // Unmigrated Components
        RzButtonGroup = new DefaultRzButtonGroupStyles(this);
        RzCheckboxGroup = new DefaultRzCheckboxGroupStyles(this);
        RzCheckboxGroupField = new DefaultRzCheckboxGroupFieldStyles(this);
        RzCheckboxGroupItem = new DefaultRzCheckboxGroupItemStyles(this);
        RzDarkmodeToggle = new DefaultRzDarkmodeToggleStyles(this);
        RzDateEdit = new DefaultRzDateEditStyles(this);
        RzDropdownMenu = new DefaultRzDropdownMenuStyles(this);
        RzField = new DefaultRzFieldStyles(this);
        RzFieldHelp = new DefaultRzFieldHelpStyles(this);
        RzFieldLabel = new DefaultRzFieldLabelStyles(this);
        RzFormSection = new DefaultRzFormSectionStyles(this);
        RzLink = new DefaultRzLinkStyles(this);
        RzNavigationMenu = new DefaultRzNavigationMenuStyles(this);
        RzNumberEdit = new DefaultRzNumberEditStyles(this);
        RzNumberField = new DefaultRzNumberFieldStyles(this);
        RzRadioGroup = new DefaultRzRadioGroupStyles(this);
        RzRadioGroupField = new DefaultRzRadioGroupFieldStyles(this);
        RzRadioGroupItem = new DefaultRzRadioGroupItemStyles(this);
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