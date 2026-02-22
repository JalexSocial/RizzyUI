
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

        // RzAccordion Family
        RzAccordion = RizzyUI.RzAccordion.DefaultDescriptor;
        AccordionItem = RizzyUI.AccordionItem.DefaultDescriptor;

        // RzAlert Family
        RzAlert = RizzyUI.RzAlert.DefaultDescriptor;
        AlertTitle = RizzyUI.AlertTitle.DefaultDescriptor;
        AlertDescription = RizzyUI.AlertDescription.DefaultDescriptor;

        // RzArticle Family
        RzArticle = RizzyUI.RzArticle.DefaultDescriptor;

        // RzAspectRatio Family
        RzAspectRatio = RizzyUI.RzAspectRatio.DefaultDescriptor;

        // RzAvatar Family
        RzAvatar = RizzyUI.RzAvatar.DefaultDescriptor;
        AvatarBadge = RizzyUI.AvatarBadge.DefaultDescriptor;
        AvatarGroup = RizzyUI.AvatarGroup.DefaultDescriptor;
        AvatarGroupCount = RizzyUI.AvatarGroupCount.DefaultDescriptor;

        // RzBadge Family
        RzBadge = RizzyUI.RzBadge.DefaultDescriptor;

        // RzBreadcrumb Family
        RzBreadcrumb = RizzyUI.RzBreadcrumb.DefaultDescriptor;
        BreadcrumbList = RizzyUI.BreadcrumbList.DefaultDescriptor;
        BreadcrumbItem = RizzyUI.BreadcrumbItem.DefaultDescriptor;
        BreadcrumbLink = RizzyUI.BreadcrumbLink.DefaultDescriptor;
        BreadcrumbPage = RizzyUI.BreadcrumbPage.DefaultDescriptor;
        BreadcrumbSeparator = RizzyUI.BreadcrumbSeparator.DefaultDescriptor;
        BreadcrumbEllipsis = RizzyUI.BreadcrumbEllipsis.DefaultDescriptor;

        // RzPagination Family
        RzPagination = RizzyUI.RzPagination.DefaultDescriptor;
        PaginationList = RizzyUI.PaginationList.DefaultDescriptor;
        PaginationItem = RizzyUI.PaginationItem.DefaultDescriptor;
        PaginationLink = RizzyUI.PaginationLink.DefaultDescriptor;
        PaginationPrevious = RizzyUI.PaginationPrevious.DefaultDescriptor;
        PaginationNext = RizzyUI.PaginationNext.DefaultDescriptor;
        PaginationEllipsis = RizzyUI.PaginationEllipsis.DefaultDescriptor;

        // RzBrowser Family
        RzBrowser = RizzyUI.RzBrowser.DefaultDescriptor;

        // RzButton Family
        RzButton = RizzyUI.RzButton.DefaultDescriptor;

        // RzButtonGroup Family
        RzButtonGroup = RizzyUI.RzButtonGroup.DefaultDescriptor;
        ButtonGroupSeparator = RizzyUI.ButtonGroupSeparator.DefaultDescriptor;
        ButtonGroupText = RizzyUI.ButtonGroupText.DefaultDescriptor;

        // RzCalendar Family
        RzCalendar = RizzyUI.RzCalendar.DefaultDescriptor;
        RzCalendarProvider = RizzyUI.RzCalendarProvider.DefaultDescriptor;

        // RzCard Family
        RzCard = RizzyUI.RzCard.DefaultDescriptor;
        CardContent = RizzyUI.CardContent.DefaultDescriptor;
        CardAction = RizzyUI.CardAction.DefaultDescriptor;
        CardFooter = RizzyUI.CardFooter.DefaultDescriptor;
        CardHeader = RizzyUI.CardHeader.DefaultDescriptor;
        CardDescription = RizzyUI.CardDescription.DefaultDescriptor;
        CardTitle = RizzyUI.CardTitle.DefaultDescriptor;

        // RzCarousel Family
        RzCarousel = RizzyUI.RzCarousel.DefaultDescriptor;
        CarouselNext = RizzyUI.CarouselNext.DefaultDescriptor;
        CarouselPrevious = RizzyUI.CarouselPrevious.DefaultDescriptor;
        CarouselContent = RizzyUI.CarouselContent.DefaultDescriptor;
        CarouselItem = RizzyUI.CarouselItem.DefaultDescriptor;

        // RzCheckbox Family
        RzCheckbox = RizzyUI.RzInputCheckbox.DefaultDescriptor;

        // RzCheckboxGroup Family
        RzCheckboxGroup = RizzyUI.RzCheckboxGroupStyles.DefaultDescriptor;
        RzCheckboxGroupItem = RizzyUI.RzCheckboxGroupItemStyles.DefaultDescriptor;
        CheckboxGroupItemIndicator = RizzyUI.CheckboxGroupItemIndicatorStyles.DefaultDescriptor;

        // RzCodeViewer Family
        RzCodeViewer = RizzyUI.RzCodeViewer.DefaultDescriptor;

        // RzCollapsible Family
        RzCollapsible = RizzyUI.RzCollapsible.DefaultDescriptor;
        CollapsibleTrigger = RizzyUI.CollapsibleTrigger.DefaultDescriptor;
        CollapsibleContent = RizzyUI.CollapsibleContent.DefaultDescriptor;

        // RzCombobox Family
        RzCombobox = RizzyUI.RzComboboxStyles.DefaultDescriptor;

        // RzCommand Family
        RzCommand = RizzyUI.RzCommand.DefaultDescriptor;
        RzCommandDialog = RizzyUI.RzCommandDialog.DefaultDescriptor;
        CommandInput = RizzyUI.CommandInput.DefaultDescriptor;
        CommandList = RizzyUI.CommandList.DefaultDescriptor;
        CommandEmpty = RizzyUI.CommandEmpty.DefaultDescriptor;
        CommandGroup = RizzyUI.CommandGroup.DefaultDescriptor;
        CommandItem = RizzyUI.CommandItem.DefaultDescriptor;
        CommandSeparator = RizzyUI.CommandSeparator.DefaultDescriptor;
        CommandShortcut = RizzyUI.CommandShortcut.DefaultDescriptor;
        CommandItemTemplate = RizzyUI.CommandItemTemplate.DefaultDescriptor;

        // RzDarkModeToggle Family
        RzDarkModeToggle = RizzyUI.RzDarkModeToggle.DefaultDescriptor;

        // RzDateEdit Family
        RzDateEdit = RizzyUI.RzDateEdit.DefaultDescriptor;

        // RzColorPicker Family
        RzColorPicker = RizzyUI.RzColorPicker.DefaultDescriptor;
        RzColorSwatch = RizzyUI.RzColorSwatch.DefaultDescriptor;

        // RzDialog Family
        RzDialog = RizzyUI.RzDialog.DefaultDescriptor;
        DialogContent = RizzyUI.DialogContent.DefaultDescriptor;
        DialogHeader = RizzyUI.DialogHeader.DefaultDescriptor;
        DialogFooter = RizzyUI.DialogFooter.DefaultDescriptor;
        DialogTitle = RizzyUI.DialogTitle.DefaultDescriptor;
        DialogTrigger = RizzyUI.DialogTrigger.DefaultDescriptor;
        DialogClose = RizzyUI.DialogClose.DefaultDescriptor;
        DialogDescription = RizzyUI.DialogDescription.DefaultDescriptor;

        // RzAlertDialog Family
        RzAlertDialog = RizzyUI.RzAlertDialog.DefaultDescriptor;
        AlertDialogContent = RizzyUI.AlertDialogContent.DefaultDescriptor;
        AlertDialogHeader = RizzyUI.AlertDialogHeader.DefaultDescriptor;
        AlertDialogFooter = RizzyUI.AlertDialogFooter.DefaultDescriptor;
        AlertDialogTitle = RizzyUI.AlertDialogTitle.DefaultDescriptor;
        AlertDialogDescription = RizzyUI.AlertDialogDescription.DefaultDescriptor;
        AlertDialogTrigger = RizzyUI.AlertDialogTrigger.DefaultDescriptor;
        AlertDialogAction = RizzyUI.AlertDialogAction.DefaultDescriptor;
        AlertDialogCancel = RizzyUI.AlertDialogCancel.DefaultDescriptor;

        // RzDropdownMenu Family
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


        // RzMenubar Family
        RzMenubar = RizzyUI.RzMenubar.DefaultDescriptor;
        MenubarMenu = RizzyUI.MenubarMenu.DefaultDescriptor;
        MenubarTrigger = RizzyUI.MenubarTrigger.DefaultDescriptor;
        MenubarContent = RizzyUI.MenubarContent.DefaultDescriptor;
        MenubarGroup = RizzyUI.MenubarGroup.DefaultDescriptor;
        MenubarLabel = RizzyUI.MenubarLabel.DefaultDescriptor;
        MenubarItem = RizzyUI.MenubarItem.DefaultDescriptor;
        MenubarCheckboxItem = RizzyUI.MenubarCheckboxItem.DefaultDescriptor;
        MenubarRadioGroup = RizzyUI.MenubarRadioGroup.DefaultDescriptor;
        MenubarRadioItem = RizzyUI.MenubarRadioItem.DefaultDescriptor;
        MenubarSeparator = RizzyUI.MenubarSeparator.DefaultDescriptor;
        MenubarShortcut = RizzyUI.MenubarShortcut.DefaultDescriptor;
        MenubarSub = RizzyUI.MenubarSub.DefaultDescriptor;
        MenubarSubTrigger = RizzyUI.MenubarSubTrigger.DefaultDescriptor;
        MenubarSubContent = RizzyUI.MenubarSubContent.DefaultDescriptor;

        // RzEmbeddedPreview Family
        RzEmbeddedPreview = RizzyUI.RzEmbeddedPreview.DefaultDescriptor;

        // RzEventViewer Family
        RzEventViewer = RizzyUI.RzEventViewer.DefaultDescriptor;

        // RzEmpty Family
        RzEmpty = RizzyUI.RzEmpty.DefaultDescriptor;
        EmptyHeader = RizzyUI.EmptyHeader.DefaultDescriptor;
        EmptyMedia = RizzyUI.EmptyMedia.DefaultDescriptor;
        EmptyTitle = RizzyUI.EmptyTitle.DefaultDescriptor;
        EmptyDescription = RizzyUI.EmptyDescription.DefaultDescriptor;
        EmptyContent = RizzyUI.EmptyContent.DefaultDescriptor;

        // RzField Family
        RzFieldSet = RizzyUI.RzFieldSet.DefaultDescriptor;
        FieldLegend = RizzyUI.FieldLegend.DefaultDescriptor;
        FieldGroup = RizzyUI.RzFieldGroup.DefaultDescriptor;
        Field = RizzyUI.FieldStyles.DefaultDescriptor;
        FieldContent = RizzyUI.FieldContent.DefaultDescriptor;
        FieldLabel = RizzyUI.FieldLabelStyles.DefaultDescriptor;
        FieldTitle = RizzyUI.FieldTitle.DefaultDescriptor;
        FieldDescription = RizzyUI.FieldDescription.DefaultDescriptor;
        FieldSeparator = RizzyUI.FieldSeparator.DefaultDescriptor;
        FieldError = RizzyUI.FieldError.DefaultDescriptor;
        Label = RizzyUI.Label.DefaultDescriptor;

        // RzFormSection Family
        RzFormSection = RizzyUI.RzFormSection.DefaultDescriptor;

        // RzIndicator Family
        RzIndicator = RizzyUI.RzIndicator.DefaultDescriptor;

        // RzInput Family
        RzInput = RizzyUI.FormInputStyles.DefaultDescriptor;
        RzInputText = RizzyUI.RzInputText.DefaultDescriptor;
        RzInputTextArea = RizzyUI.RzInputTextArea.DefaultDescriptor;
        RzFileInput = RizzyUI.RzFileInput.DefaultDescriptor;
        RzInputNumber = RizzyUI.RzInputNumberStyles.DefaultDescriptor;
        RzInputOTP = RizzyUI.RzInputOTP.DefaultDescriptor;
        InputOTPGroup = RizzyUI.InputOTPGroup.DefaultDescriptor;
        InputOTPSlot = RizzyUI.InputOTPSlot.DefaultDescriptor;
        InputOTPSeparator = RizzyUI.InputOTPSeparator.DefaultDescriptor;

        // RzInputGroup Family
        RzInputGroup = RizzyUI.RzInputGroup.DefaultDescriptor;
        InputGroupAddon = RizzyUI.InputGroupAddonStyles.DefaultDescriptor;
        InputGroupButton = RizzyUI.InputGroupButtonStyles.DefaultDescriptor;
        InputGroupText = RizzyUI.InputGroupText.DefaultDescriptor;
        InputGroupInput = RizzyUI.InputGroupInput.DefaultDescriptor;
        InputGroupTextarea = RizzyUI.InputGroupTextarea.DefaultDescriptor;

        // RzItem Family
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

        // RzLink Family
        RzLink = RizzyUI.RzLink.DefaultDescriptor;

        // RzMarkdown Family
        RzMarkdown = RizzyUI.RzMarkdown.DefaultDescriptor;

        // RzNativeSelect Family
        RzNativeSelect = RizzyUI.RzNativeSelectStyles.DefaultDescriptor;

        // RzNavigationMenu Family
        RzNavigationMenu = RizzyUI.RzNavigationMenu.DefaultDescriptor;
        NavigationMenuContent = RizzyUI.NavigationMenuContent.DefaultDescriptor;
        NavigationMenuItem = RizzyUI.NavigationMenuItem.DefaultDescriptor;
        NavigationMenuLink = RizzyUI.NavigationMenuLink.DefaultDescriptor;
        NavigationMenuList = RizzyUI.NavigationMenuList.DefaultDescriptor;
        NavigationMenuTrigger = RizzyUI.NavigationMenuTrigger.DefaultDescriptor;
        RzScrollArea = RizzyUI.RzScrollArea.DefaultDescriptor;
        ScrollBar = RizzyUI.ScrollBar.DefaultDescriptor;

        // RzPopover Family
        RzPopover = RizzyUI.RzPopover.DefaultDescriptor;
        PopoverTrigger = RizzyUI.PopoverTrigger.DefaultDescriptor;
        PopoverContent = RizzyUI.PopoverContent.DefaultDescriptor;

        // RzTooltip Family
        RzTooltip = RizzyUI.RzTooltip.DefaultDescriptor;
        TooltipTrigger = RizzyUI.TooltipTrigger.DefaultDescriptor;
        TooltipContent = RizzyUI.TooltipContent.DefaultDescriptor;
        TooltipProvider = RizzyUI.TooltipProvider.DefaultDescriptor;

        // RzProgress Family
        RzProgress = RizzyUI.RzProgress.DefaultDescriptor;

        // RzQuickReference Family
        RzQuickReference = RizzyUI.RzQuickReference.DefaultDescriptor;
        RzQuickReferenceContainer = RizzyUI.RzQuickReferenceContainer.DefaultDescriptor;

        // RzRadioGroup Family
        RzRadioGroup = RizzyUI.RzRadioGroupStyles.DefaultDescriptor;
        RadioGroupItem = RizzyUI.RadioGroupItemStyles.DefaultDescriptor;
        RadioGroupItemIndicator = RizzyUI.RadioGroupItemIndicator.DefaultDescriptor;

        // RzSearchButton Family
        RzSearchButton = RizzyUI.RzSearchButton.DefaultDescriptor;

        // RzSeparator Family
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

        // RzSidebar Family
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

        // RzSpinner Family
        RzSpinner = RizzyUI.RzSpinner.DefaultDescriptor;

        // RzSkeleton Family
        RzSkeleton = RizzyUI.RzSkeleton.DefaultDescriptor;

        // RzSteps Family
        RzSteps = RizzyUI.RzSteps.DefaultDescriptor;

        // RzSwitch Family
        RzSwitch = RizzyUI.RzSwitchStyles.DefaultDescriptor;

        // RzToggle Family
        RzToggle = RizzyUI.RzToggle.DefaultDescriptor;

        // RzTable Family
        RzTable = RizzyUI.RzTableStyles.DefaultDescriptor;
        TableBody = RizzyUI.TableBodyStyles.DefaultDescriptor;
        TableCell = RizzyUI.TableCellStyles.DefaultDescriptor;
        TableHeader = RizzyUI.TableHeaderStyles.DefaultDescriptor;
        TableHeaderCell = RizzyUI.TableHeaderCellStyles.DefaultDescriptor;
        TableFooter = RizzyUI.TableFooterStyles.DefaultDescriptor;
        TableRow = RizzyUI.TableRowStyles.DefaultDescriptor;
        TablePagination = RizzyUI.TablePaginationStyles.DefaultDescriptor;

        // RzTabs Family
        RzTabs = RizzyUI.RzTabs.DefaultDescriptor;
        TabsList = RizzyUI.TabsList.DefaultDescriptor;
        TabsTrigger = RizzyUI.TabsTrigger.DefaultDescriptor;
        TabsContent = RizzyUI.TabsContent.DefaultDescriptor;

        // Typography Family
        RzHeading = RizzyUI.RzHeading.DefaultDescriptor;
        RzKbd = RizzyUI.RzKbd.DefaultDescriptor;
        RzKbdGroup = RizzyUI.RzKbdGroup.DefaultDescriptor;
        RzParagraph = RizzyUI.RzParagraph.DefaultDescriptor;
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
