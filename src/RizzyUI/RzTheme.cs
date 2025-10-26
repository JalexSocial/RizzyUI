
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

        RzDropdownMenu = RizzyUI.RzDropdownMenu.DefaultDescriptor;
        DropdownMenuContent = RizzyUI.DropdownMenuContent.DefaultDescriptor;
        DropdownMenuGroup = RizzyUI.DropdownMenuGroup.DefaultDescriptor;
        DropdownMenuItem = RizzyUI.DropdownMenuItem.DefaultDescriptor;
        DropdownMenuLabel = RizzyUI.DropdownMenuLabel.DefaultDescriptor;
        DropdownMenuSeparator = RizzyUI.DropdownMenuSeparator.DefaultDescriptor;
        DropdownMenuShortcut = RizzyUI.DropdownMenuShortcut.DefaultDescriptor;
        DropdownMenuSub = RizzyUI.DropdownMenuSub.DefaultDescriptor;
        DropdownMenuSubContent = RizzyUI.DropdownMenuSubContent.DefaultDescriptor;
        DropdownMenuSubTrigger = RizzyUI.DropdownMenuSubTrigger.DefaultDescriptor;
        DropdownMenuTrigger = RizzyUI.DropdownMenuTrigger.DefaultDescriptor;
        RzLink = RizzyUI.RzLink.DefaultDescriptor;
        RzNavigationMenu = RizzyUI.RzNavigationMenu.DefaultDescriptor;
        NavigationMenuContent = RizzyUI.NavigationMenuContent.DefaultDescriptor;
        NavigationMenuItem = RizzyUI.NavigationMenuItem.DefaultDescriptor;
        NavigationMenuLink = RizzyUI.NavigationMenuLink.DefaultDescriptor;
        NavigationMenuList = RizzyUI.NavigationMenuList.DefaultDescriptor;
        NavigationMenuTrigger = RizzyUI.NavigationMenuTrigger.DefaultDescriptor;
        RzSidebarProvider = RizzyUI.RzSidebarProvider.DefaultDescriptor;
        Sidebar = RizzyUI.Sidebar.DefaultDescriptor;
        SidebarContent = RizzyUI.SidebarContent.DefaultDescriptor;
        SidebarFooter = RizzyUI.SidebarFooter.DefaultDescriptor;
        SidebarGroup = RizzyUI.SidebarGroup.DefaultDescriptor;
        SidebarGroupContent = RizzyUI.SidebarGroupContent.DefaultDescriptor;
        SidebarGroupLabel = RizzyUI.SidebarGroupLabel.DefaultDescriptor;
        SidebarHeader = RizzyUI.SidebarHeader.DefaultDescriptor;
        SidebarInset = RizzyUI.SidebarInset.DefaultDescriptor;
        SidebarMenu = RizzyUI.SidebarMenu.DefaultDescriptor;
        SidebarMenuAction = RizzyUI.SidebarMenuAction.DefaultDescriptor;
        SidebarMenuBadge = RizzyUI.SidebarMenuBadge.DefaultDescriptor;
        SidebarMenuButton = RizzyUI.SidebarMenuButton.DefaultDescriptor;
        SidebarMenuItem = RizzyUI.SidebarMenuItem.DefaultDescriptor;
        SidebarMenuSub = RizzyUI.SidebarMenuSub.DefaultDescriptor;
        SidebarRail = RizzyUI.SidebarRail.DefaultDescriptor;
        SidebarSeparator = RizzyUI.SidebarSeparator.DefaultDescriptor;
        SidebarTrigger = RizzyUI.SidebarTrigger.DefaultDescriptor;

        // Newly Migrated Components
        RzButtonGroup = RizzyUI.RzButtonGroup.DefaultDescriptor;
        RzCheckboxGroup = RizzyUI.RzCheckboxGroupStyles.DefaultDescriptor;
        RzCheckboxGroupField = RizzyUI.RzCheckboxGroupFieldStyles.DefaultDescriptor;
        RzCheckboxGroupItem = RizzyUI.RzCheckboxGroupItemStyles.DefaultDescriptor;
        RzDateEdit = RizzyUI.RzDateEdit.DefaultDescriptor;
        RzField = RizzyUI.RzField.DefaultDescriptor;
        RzFieldHelp = RizzyUI.RzFieldHelp.DefaultDescriptor;
        RzFieldLabel = RizzyUI.RzFieldLabelStyles.DefaultDescriptor;
        RzFormSection = RizzyUI.RzFormSection.DefaultDescriptor;
        RzNumberEdit = RizzyUI.RzNumberEditStyles.DefaultDescriptor;
        RzNumberField = RizzyUI.RzNumberFieldStyles.DefaultDescriptor;
        RzRadioGroup = RizzyUI.RzRadioGroupStyles.DefaultDescriptor;
        RzRadioGroupField = RizzyUI.RzRadioGroupFieldStyles.DefaultDescriptor;
        RzRadioGroupItem = RizzyUI.RzRadioGroupItemStyles.DefaultDescriptor;
        RzTabs = RizzyUI.RzTabs.DefaultDescriptor;
        RzTab = RizzyUI.RzTab.DefaultDescriptor;
        RzTabPanel = RizzyUI.RzTabPanel.DefaultDescriptor;
        RzTabStrip = RizzyUI.RzTabStripStyles.DefaultDescriptor;
        RzTextEdit = RizzyUI.RzTextEdit.DefaultDescriptor;
        RzTextField = RizzyUI.RzTextField.DefaultDescriptor;
        RzToggle = RizzyUI.RzToggle.DefaultDescriptor;
        RzToggleField = RizzyUI.RzToggleField.DefaultDescriptor;
        RzDarkModeToggle = RizzyUI.RzDarkModeToggle.DefaultDescriptor;
        RzTable = RizzyUI.RzTableStyles.DefaultDescriptor;
        TableBody = RizzyUI.TableBodyStyles.DefaultDescriptor;
        TableCell = RizzyUI.TableCellStyles.DefaultDescriptor;
        TableHeaderCell = RizzyUI.TableHeaderCellStyles.DefaultDescriptor;
        TableRow = RizzyUI.TableRowStyles.DefaultDescriptor;
        TablePagination = RizzyUI.TablePaginationStyles.DefaultDescriptor;
        
        RzFieldSet = RizzyUI.RzFieldSet.DefaultDescriptor;
        FieldLegend = RizzyUI.FieldLegend.DefaultDescriptor;
        FieldGroup = RizzyUI.FieldGroup.DefaultDescriptor;
        Field = RizzyUI.FieldStyles.DefaultDescriptor;
        FieldContent = RizzyUI.FieldContent.DefaultDescriptor;
        FieldLabel = RizzyUI.FieldLabel.DefaultDescriptor;
        FieldTitle = RizzyUI.FieldTitle.DefaultDescriptor;
        FieldDescription = RizzyUI.FieldDescription.DefaultDescriptor;
        FieldSeparator = RizzyUI.FieldSeparator.DefaultDescriptor;
        FieldError = RizzyUI.FieldError.DefaultDescriptor;
        Label = RizzyUI.Label.DefaultDescriptor;
        
        RzInputGroup = RizzyUI.RzInputGroup.DefaultDescriptor;
        InputGroupAddon = RizzyUI.InputGroupAddonStyles.DefaultDescriptor;
        InputGroupButton = RizzyUI.InputGroupButtonStyles.DefaultDescriptor;
        InputGroupText = RizzyUI.InputGroupText.DefaultDescriptor;
        InputGroupInput = RizzyUI.InputGroupInput.DefaultDescriptor;
        InputGroupTextarea = RizzyUI.InputGroupTextarea.DefaultDescriptor;        
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
    public Dictionary<string, string>? AdditionalProperties { get; init; }

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
}

#pragma warning restore CS8618