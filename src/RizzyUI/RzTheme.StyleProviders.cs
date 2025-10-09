
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Tailwind classname providers for all components
/// </summary>
public partial class RzTheme
{
    // --- Component Style Properties ---

    /// <summary> Gets or sets the style definitions for the <see cref="RzAccordion" /> component. </summary>
    public virtual RzStylesBase.RzAccordionStylesBase RzAccordion { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="AccordionItem" /> component. </summary>
    public virtual RzStylesBase.AccordionItemStylesBase AccordionItem { get; }

    // RzAlert Family
    public virtual TvDescriptor<RzComponent<RzAlert.Slots>, RzAlert.Slots> RzAlert { get; set; }
    public virtual TvDescriptor<RzComponent<AlertTitle.Slots>, AlertTitle.Slots> AlertTitle { get; set; }
    public virtual TvDescriptor<RzComponent<AlertDescription.Slots>, AlertDescription.Slots> AlertDescription { get; set; }
    [Obsolete("This property is obsolete. Use the TvDescriptor-based properties for theming.")]
    public virtual RzStylesBase.RzAlertStylesBase RzAlertStyles { get; }
    [Obsolete("This property is obsolete. Use the TvDescriptor-based properties for theming.")]
    public virtual RzStylesBase.AlertTitleStylesBase AlertTitleStyles { get; }
    [Obsolete("This property is obsolete. Use the TvDescriptor-based properties for theming.")]
    public virtual RzStylesBase.AlertDescriptionStylesBase AlertDescriptionStyles { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzArticle" /> component. </summary>
    public virtual RzStylesBase.RzArticleStylesBase RzArticle { get; }

    /// <summary>
    /// Gets the style definitions for the <see cref="RzAspectRatio" /> component.
    /// </summary>
    public virtual RzStylesBase.RzAspectRatioStylesBase RzAspectRatio { get; }
    
    /// <summary>
    /// Gets the style definitions for the <see cref="RzAvatar" /> component.
    /// </summary>
    public virtual RzStylesBase.RzAvatarStylesBase RzAvatar { get; }
    
    /// <summary>
    /// Gets the style definitions for the <see cref="AvatarImage" /> component.
    /// </summary>
    public virtual RzStylesBase.AvatarImageStylesBase AvatarImage { get; }

    /// <summary>
    /// Gets the style definitions for the <see cref="AvatarFallback" /> component.
    /// </summary>
    public virtual RzStylesBase.AvatarFallbackStylesBase AvatarFallback { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzBadge" /> component. </summary>
    public virtual RzStylesBase.RzBadgeStylesBase RzBadge { get; }

    public virtual TvDescriptor<RzComponent<RzBreadcrumb.Slots>, RzBreadcrumb.Slots> RzBreadcrumb { get; set; }
    public virtual TvDescriptor<RzComponent<BreadcrumbList.Slots>, BreadcrumbList.Slots> BreadcrumbList { get; set; }
    public virtual TvDescriptor<RzComponent<BreadcrumbItem.Slots>, BreadcrumbItem.Slots> BreadcrumbItem { get; set; }
    public virtual TvDescriptor<RzComponent<BreadcrumbLink.Slots>, BreadcrumbLink.Slots> BreadcrumbLink { get; set; }
    public virtual TvDescriptor<RzComponent<BreadcrumbPage.Slots>, BreadcrumbPage.Slots> BreadcrumbPage { get; set; }
    public virtual TvDescriptor<RzComponent<BreadcrumbSeparator.Slots>, BreadcrumbSeparator.Slots> BreadcrumbSeparator { get; set; }
    public virtual TvDescriptor<RzComponent<BreadcrumbEllipsis.Slots>, BreadcrumbEllipsis.Slots> BreadcrumbEllipsis { get; set; }

    /// <summary>
    /// Gets or sets the style definitions for the <see cref="RzBrowser" /> component.
    /// </summary>
    public virtual RzStylesBase.RzBrowserStylesBase RzBrowser { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzButton" /> component. </summary>
    public virtual TvDescriptor<RzComponent<RzButton.Slots>, RzButton.Slots> RzButton { get; set; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzButtonGroup" /> component. </summary>
    public virtual RzStylesBase.RzButtonGroupStylesBase RzButtonGroup { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzCard" /> component. </summary>
    public virtual RzStylesBase.RzCardStylesBase RzCard { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="CardContent" /> component. </summary>
    public virtual RzStylesBase.CardContentStylesBase CardContent { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="CardAction" /> component. </summary>
    public virtual RzStylesBase.CardActionStylesBase CardAction { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="CardFooter" /> component. </summary>
    public virtual RzStylesBase.CardFooterStylesBase CardFooter { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="CardHeader" /> component. </summary>
    public virtual RzStylesBase.CardHeaderStylesBase CardHeader { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="CardDescription" /> component. </summary>
    public virtual RzStylesBase.CardDescriptionStylesBase CardDescription { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="CardTitle" /> component. </summary>
    public virtual RzStylesBase.CardTitleStylesBase CardTitle { get; }

    /// <summary> Gets the style definitions for the <see cref="RzCarousel" /> component family. </summary>
    public virtual RzStylesBase.RzCarouselStylesBase RzCarousel { get; }
    
    /// <summary> Gets or sets the style definitions for the <see cref="RzCheckboxGroup{TValue}" /> component. </summary>
    public virtual RzStylesBase.RzCheckboxGroupStylesBase RzCheckboxGroup { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzCheckboxGroupField{TValue}" /> component. </summary>
    public virtual RzStylesBase.RzCheckboxGroupFieldStylesBase RzCheckboxGroupField { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzCheckboxGroupItem{TValue}" /> component. </summary>
    public virtual RzStylesBase.RzCheckboxGroupItemStylesBase RzCheckboxGroupItem { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzCodeViewer" /> component. </summary>
    public virtual RzStylesBase.RzCodeViewerStylesBase RzCodeViewer { get; }

    /// <summary> Gets the style definitions for the <see cref="RzCollapsible" /> component. </summary>
    public virtual RzStylesBase.RzCollapsibleStylesBase RzCollapsible { get; }
    
    /// <summary> Gets or sets the style definitions for the <see cref="RzDarkmodeToggle" /> component. </summary>
    public virtual RzStylesBase.RzDarkmodeToggleStylesBase RzDarkmodeToggle { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzDateEdit" /> component. </summary>
    public virtual RzStylesBase.RzDateEditStylesBase RzDateEdit { get; }

    // RzDialog Family
    public virtual TvDescriptor<RzComponent<RzDialog.Slots>, RzDialog.Slots> RzDialog { get; set; }
    public virtual TvDescriptor<RzComponent<DialogContent.Slots>, DialogContent.Slots> DialogContent { get; set; }
    public virtual TvDescriptor<RzComponent<DialogHeader.Slots>, DialogHeader.Slots> DialogHeader { get; set; }
    public virtual TvDescriptor<RzComponent<DialogFooter.Slots>, DialogFooter.Slots> DialogFooter { get; set; }
    public virtual TvDescriptor<RzAsChildComponent<DialogTrigger.Slots>, DialogTrigger.Slots> DialogTrigger { get; set; }
    public virtual TvDescriptor<RzAsChildComponent<DialogClose.Slots>, DialogClose.Slots> DialogClose { get; set; }
    public virtual TvDescriptor<RzComponent<DialogTitle.Slots>, DialogTitle.Slots> DialogTitle { get; set; }
    public virtual TvDescriptor<RzComponent<DialogDescription.Slots>, DialogDescription.Slots> DialogDescription { get; set; }
    [Obsolete("This property is obsolete. Use the TvDescriptor-based properties for theming.")]
    public virtual RzStylesBase.RzDialogStylesBase RzDialogStyles { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzSeparator" /> component. </summary>
    public virtual RzStylesBase.RzSeparatorStylesBase RzSeparator { get; }

    /// <summary>
    /// Gets the style definitions for the <see cref="RzDropdownMenu" /> component and its children.
    /// </summary>
    public virtual RzStylesBase.RzDropdownMenuStylesBase RzDropdownMenu { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzEmbeddedPreview" /> component. </summary>
    public virtual RzStylesBase.RzEmbeddedPreviewStylesBase RzEmbeddedPreview { get; }
    
    // RzEmpty Family
    public virtual TvDescriptor<RzComponent<RzEmpty.Slots>, RzEmpty.Slots> RzEmpty { get; set; }
    public virtual TvDescriptor<RzComponent<EmptyHeader.Slots>, EmptyHeader.Slots> EmptyHeader { get; set; }
    public virtual TvDescriptor<RzComponent<EmptyMedia.Slots>, EmptyMedia.Slots> EmptyMedia { get; set; }
    public virtual TvDescriptor<RzComponent<EmptyTitle.Slots>, EmptyTitle.Slots> EmptyTitle { get; set; }
    public virtual TvDescriptor<RzComponent<EmptyDescription.Slots>, EmptyDescription.Slots> EmptyDescription { get; set; }
    public virtual TvDescriptor<RzComponent<EmptyContent.Slots>, EmptyContent.Slots> EmptyContent { get; set; }
    [Obsolete("This property is obsolete. Use the TvDescriptor-based properties for theming.")]
    public virtual RzStylesBase.RzEmptyStylesBase RzEmptyStyles { get; }
    
    /// <summary> Gets or sets the style definitions for the <see cref="RzField" /> component. </summary>
    public virtual RzStylesBase.RzFieldStylesBase RzField { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzFieldHelp" /> component. </summary>
    public virtual RzStylesBase.RzFieldHelpStylesBase RzFieldHelp { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzFieldLabel{TValue}" /> component. </summary>
    public virtual RzStylesBase.RzFieldLabelStylesBase RzFieldLabel { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzFormSection" /> component. </summary>
    public virtual RzStylesBase.RzFormSectionStylesBase RzFormSection { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzIndicator" /> component. </summary>
    public virtual RzStylesBase.RzIndicatorStylesBase RzIndicator { get; }
    
    /// <summary> Gets the style definitions for the <see cref="RzItemGroup" /> component. </summary>
    public virtual RzStylesBase.RzItemGroupStylesBase RzItemGroup { get; }
    /// <summary> Gets the style definitions for the <see cref="RzItemSeparator" /> component. </summary>
    public virtual RzStylesBase.RzItemSeparatorStylesBase RzItemSeparator { get; }
    /// <summary> Gets the style definitions for the <see cref="RzItem" /> component. </summary>
    public virtual RzStylesBase.RzItemStylesBase RzItem { get; }
    /// <summary> Gets the style definitions for the <see cref="ItemMedia" /> component. </summary>
    public virtual RzStylesBase.ItemMediaStylesBase ItemMedia { get; }
    /// <summary> Gets the style definitions for the <see cref="ItemContent" /> component. </summary>
    public virtual RzStylesBase.ItemContentStylesBase ItemContent { get; }
    /// <summary> Gets the style definitions for the <see cref="ItemTitle" /> component. </summary>
    public virtual RzStylesBase.ItemTitleStylesBase ItemTitle { get; }
    /// <summary> Gets the style definitions for the <see cref="ItemDescription" /> component. </summary>
    public virtual RzStylesBase.ItemDescriptionStylesBase ItemDescription { get; }
    /// <summary> Gets the style definitions for the <see cref="ItemActions" /> component. </summary>
    public virtual RzStylesBase.ItemActionsStylesBase ItemActions { get; }
    /// <summary> Gets the style definitions for the <see cref="ItemHeader" /> component. </summary>
    public virtual RzStylesBase.ItemHeaderStylesBase ItemHeader { get; }
    /// <summary> Gets the style definitions for the <see cref="ItemFooter" /> component. </summary>
    public virtual RzStylesBase.ItemFooterStylesBase ItemFooter { get; }
    
    /// <summary> Gets or sets the style definitions for the <see cref="RzLink" /> component. </summary>
    public virtual RzStylesBase.RzLinkStylesBase RzLink { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzMarkdown" /> component. </summary>
    public virtual RzStylesBase.RzMarkdownStylesBase RzMarkdown { get; }

    /// <summary>
    /// Gets the style definitions for the <see cref="RzNavigationMenu" /> component.
    /// </summary>
    public virtual RzStylesBase.RzNavigationMenuStylesBase RzNavigationMenu { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzNumberEdit{TValue}" /> component. </summary>
    public virtual RzStylesBase.RzNumberEditStylesBase RzNumberEdit { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzNumberField{TValue}" /> component. </summary>
    public virtual RzStylesBase.RzNumberFieldStylesBase RzNumberField { get; }
    
    // RzPopover Family
    public virtual TvDescriptor<RzComponent<RzPopover.Slots>, RzPopover.Slots> RzPopover { get; set; }
    public virtual TvDescriptor<RzAsChildComponent<PopoverTrigger.Slots>, PopoverTrigger.Slots> PopoverTrigger { get; set; }
    public virtual TvDescriptor<RzComponent<PopoverContent.Slots>, PopoverContent.Slots> PopoverContent { get; set; }
    [Obsolete("This property is obsolete. Use the TvDescriptor-based properties for theming.")]
    public virtual RzStylesBase.RzPopoverStylesBase RzPopoverStyles { get; }
    [Obsolete("This property is obsolete. Use the TvDescriptor-based properties for theming.")]
    public virtual RzStylesBase.PopoverTriggerStylesBase PopoverTriggerStyles { get; }
    [Obsolete("This property is obsolete. Use the TvDescriptor-based properties for theming.")]
    public virtual RzStylesBase.PopoverContentStylesBase PopoverContentStyles { get; }

    
    /// <summary> Gets or sets the style definitions for the <see cref="RzProgress" /> component. </summary>
    public virtual RzStylesBase.RzProgressStylesBase RzProgress { get; }

    // RzSheet Family
    public virtual TvDescriptor<RzComponent<RzSheet.Slots>, RzSheet.Slots> RzSheet { get; set; }
    public virtual TvDescriptor<RzComponent<SheetContent.Slots>, SheetContent.Slots> SheetContent { get; set; }
    public virtual TvDescriptor<RzComponent<SheetHeader.Slots>, SheetHeader.Slots> SheetHeader { get; set; }
    public virtual TvDescriptor<RzComponent<SheetFooter.Slots>, SheetFooter.Slots> SheetFooter { get; set; }
    public virtual TvDescriptor<RzComponent<SheetTitle.Slots>, SheetTitle.Slots> SheetTitle { get; set; }
    public virtual TvDescriptor<RzComponent<SheetDescription.Slots>, SheetDescription.Slots> SheetDescription { get; set; }
    [Obsolete("This property is obsolete. Use the TvDescriptor-based properties for theming.")]
    public virtual RzStylesBase.RzSheetStylesBase RzSheetStyles { get; }
    public virtual TvDescriptor<RzAsChildComponent<SheetTrigger.Slots>, SheetTrigger.Slots> SheetTrigger { get; set; }
    public virtual TvDescriptor<RzAsChildComponent<SheetClose.Slots>, SheetClose.Slots> SheetClose { get; set; }
    
    // RzSpinner
    public virtual TvDescriptor<RzComponent<RzSpinner.Slots>, RzSpinner.Slots> RzSpinner { get; set; }
    [Obsolete("This property is obsolete. Use the TvDescriptor-based properties for theming.")]
    public virtual RzStylesBase.RzSpinnerStylesBase RzSpinnerStyles { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzQuickReferenceContainer" /> component. </summary>
    public virtual RzStylesBase.RzQuickReferenceContainerStylesBase RzQuickReferenceContainer { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzQuickReference" /> component. </summary>
    public virtual RzStylesBase.RzQuickReferenceStylesBase RzQuickReference { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzRadioGroup{TValue}" /> component. </summary>
    public virtual RzStylesBase.RzRadioGroupStylesBase RzRadioGroup { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzRadioGroupField{TValue}" /> component. </summary>
    public virtual RzStylesBase.RzRadioGroupFieldStylesBase RzRadioGroupField { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzRadioGroupItem{TValue}" /> component. </summary>
    public virtual RzStylesBase.RzRadioGroupItemStylesBase RzRadioGroupItem { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzSearchButton" /> component. </summary>
    public virtual RzStylesBase.RzSearchButtonStylesBase RzSearchButton { get; }

    /// <summary> Gets the style definitions for the <see cref="RzSidebarProvider" /> component. </summary>
    public virtual RzStylesBase.RzSidebarProviderStylesBase RzSidebarProvider { get; }

    /// <summary> Gets the style definitions for the <see cref="Sidebar" /> component. </summary>
    public virtual RzStylesBase.SidebarStylesBase Sidebar { get; }

    /// <summary> Gets the style definitions for the <see cref="SidebarTrigger" /> component. </summary>
    public virtual RzStylesBase.SidebarTriggerStylesBase SidebarTrigger { get; }

    /// <summary> Gets the style definitions for the <see cref="SidebarHeader" /> component. </summary>
    public virtual RzStylesBase.SidebarHeaderStylesBase SidebarHeader { get; }

    /// <summary> Gets the style definitions for the <see cref="SidebarContent" /> component. </summary>
    public virtual RzStylesBase.SidebarContentStylesBase SidebarContent { get; }

    /// <summary> Gets the style definitions for the <see cref="SidebarFooter" /> component. </summary>
    public virtual RzStylesBase.SidebarFooterStylesBase SidebarFooter { get; }

    /// <summary> Gets the style definitions for the <see cref="SidebarGroup" /> component. </summary>
    public virtual RzStylesBase.SidebarGroupStylesBase SidebarGroup { get; }
    
    /// <summary> Gets the style definitions for the <see cref="SidebarGroupLabel" /> component. </summary>
    public virtual RzStylesBase.SidebarGroupLabelStylesBase SidebarGroupLabel { get; }

    /// <summary> Gets the style definitions for the <see cref="SidebarGroupContent" /> component. </summary>
    public virtual RzStylesBase.SidebarGroupContentStylesBase SidebarGroupContent { get; }

    /// <summary> Gets the style definitions for the <see cref="SidebarMenu" /> component. </summary>
    public virtual RzStylesBase.SidebarMenuStylesBase SidebarMenu { get; }

    /// <summary> Gets the style definitions for the <see cref="SidebarMenuItem" /> component. </summary>
    public virtual RzStylesBase.SidebarMenuItemStylesBase SidebarMenuItem { get; }

    /// <summary> Gets the style definitions for the <see cref="SidebarMenuButton" /> component. </summary>
    public virtual RzStylesBase.SidebarMenuButtonStylesBase SidebarMenuButton { get; }

    /// <summary> Gets the style definitions for the <see cref="SidebarMenuAction" /> component. </summary>
    public virtual RzStylesBase.SidebarMenuActionStylesBase SidebarMenuAction { get; }

    /// <summary> Gets the style definitions for the <see cref="SidebarMenuSub" /> component. </summary>
    public virtual RzStylesBase.SidebarMenuSubStylesBase SidebarMenuSub { get; }

    /// <summary> Gets the style definitions for the <see cref="SidebarMenuBadge" /> component. </summary>
    public virtual RzStylesBase.SidebarMenuBadgeStylesBase SidebarMenuBadge { get; }

    /// <summary> Gets the style definitions for the <see cref="SidebarRail" /> component. </summary>
    public virtual RzStylesBase.SidebarRailStylesBase SidebarRail { get; }
    
    /// <summary> Gets the style definitions for the <see cref="SidebarSeparator" /> component. </summary>
    public virtual RzStylesBase.SidebarSeparatorStylesBase SidebarSeparator { get; }
    
    /// <summary> Gets the style definitions for the <see cref="SidebarInset" /> component. </summary>
    public virtual RzStylesBase.SidebarInsetStylesBase SidebarInset { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzSteps" /> component. </summary>
    public virtual RzStylesBase.RzStepsStylesBase RzSteps { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzTable{TItem}" /> component. </summary>
    public virtual RzStylesBase.RzTableStylesBase RzTable { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzTableHeaderCell{TItem}" /> component. </summary>
    public virtual RzStylesBase.RzTableHeaderCellStylesBase RzTableHeaderCell { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzTableBody{TItem}" /> component. </summary>
    public virtual RzStylesBase.RzTableBodyStylesBase RzTableBody { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzTableRow{TItem}" /> component. </summary>
    public virtual RzStylesBase.RzTableRowStylesBase RzTableRow { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzTableCell{TItem}" /> component. </summary>
    public virtual RzStylesBase.RzTableCellStylesBase RzTableCell { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzPagination{TItem}" /> component. </summary>
    public virtual RzStylesBase.RzPaginationStylesBase RzPagination { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzTabs" /> component. </summary>
    public virtual RzStylesBase.RzTabsStylesBase RzTabs { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzTab" /> component. </summary>
    public virtual RzStylesBase.RzTabStylesBase RzTab { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzTabPanel" /> component. </summary>
    public virtual RzStylesBase.RzTabPanelStylesBase RzTabPanel { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzTabStrip" /> component. </summary>
    public virtual RzStylesBase.RzTabStripStylesBase RzTabStrip { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzTextEdit" /> component. </summary>
    public virtual RzStylesBase.RzTextEditStylesBase RzTextEdit { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzTextField" /> component. </summary>
    public virtual RzStylesBase.RzTextFieldStylesBase RzTextField { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzToggle" /> component. </summary>
    public virtual RzStylesBase.RzToggleStylesBase RzToggle { get; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzToggleField" /> component. </summary>
    public virtual RzStylesBase.RzToggleFieldStylesBase RzToggleField { get; }

    // Typography
    public virtual TvDescriptor<RzComponent<RzKbd.Slots>, RzKbd.Slots> RzKbd { get; set; }
    public virtual TvDescriptor<RzComponent<RzKbdGroup.Slots>, RzKbdGroup.Slots> RzKbdGroup { get; set; }
    public virtual TvDescriptor<RzComponent<RzHeading.Slots>, RzHeading.Slots> RzHeading { get; set; }
    public virtual TvDescriptor<RzComponent<RzParagraph.Slots>, RzParagraph.Slots> RzParagraph { get; set; }


    // Obsolete old properties
    [Obsolete("This property is obsolete. Use the TvDescriptor-based properties for theming.")]
    public virtual RzStylesBase.RzKbdStylesBase RzKbdStyles { get; }
    [Obsolete("This property is obsolete. Use the TvDescriptor-based properties for theming.")]
    public virtual RzStylesBase.RzKbdGroupStylesBase RzKbdGroupStyles { get; }
    [Obsolete("This property is obsolete. Use the TvDescriptor-based properties for theming.")]
    public virtual RzStylesBase.RzHeadingStylesBase RzHeadingStyles { get; }
    [Obsolete("This property is obsolete. Use the TvDescriptor-based properties for theming.")]
    public virtual RzStylesBase.RzParagraphStylesBase RzParagraphStyles { get; }
    [Obsolete("This property is obsolete. Use the TvDescriptor-based properties for theming.")]
    public virtual RzStylesBase.RzTypographyStylesBase RzTypographyStyles { get; }
}