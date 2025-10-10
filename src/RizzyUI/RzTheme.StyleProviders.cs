
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Tailwind classname providers for all components
/// </summary>
public partial class RzTheme
{
    // --- Component Style Properties ---

    // RzAlert Family
    public virtual TvDescriptor<RzComponent<RzAlert.Slots>, RzAlert.Slots> RzAlert { get; set; }
    public virtual TvDescriptor<RzComponent<AlertTitle.Slots>, AlertTitle.Slots> AlertTitle { get; set; }
    public virtual TvDescriptor<RzComponent<AlertDescription.Slots>, AlertDescription.Slots> AlertDescription { get; set; }

    // RzAvatar Family
    public virtual TvDescriptor<RzComponent<RzAvatar.Slots>, RzAvatar.Slots> RzAvatar { get; set; }

    // RzBadge
    public virtual TvDescriptor<RzComponent<RzBadge.Slots>, RzBadge.Slots> RzBadge { get; set; }

    // RzBreadcrumb Family
    public virtual TvDescriptor<RzComponent<RzBreadcrumb.Slots>, RzBreadcrumb.Slots> RzBreadcrumb { get; set; }
    public virtual TvDescriptor<RzComponent<BreadcrumbEllipsis.Slots>, BreadcrumbEllipsis.Slots> BreadcrumbEllipsis { get; set; }
    public virtual TvDescriptor<RzComponent<BreadcrumbItem.Slots>, BreadcrumbItem.Slots> BreadcrumbItem { get; set; }
    public virtual TvDescriptor<RzComponent<BreadcrumbLink.Slots>, BreadcrumbLink.Slots> BreadcrumbLink { get; set; }
    public virtual TvDescriptor<RzComponent<BreadcrumbList.Slots>, BreadcrumbList.Slots> BreadcrumbList { get; set; }
    public virtual TvDescriptor<RzComponent<BreadcrumbPage.Slots>, BreadcrumbPage.Slots> BreadcrumbPage { get; set; }
    public virtual TvDescriptor<RzComponent<BreadcrumbSeparator.Slots>, BreadcrumbSeparator.Slots> BreadcrumbSeparator { get; set; }

    // RzBrowser
    public virtual TvDescriptor<RzComponent<RzBrowser.Slots>, RzBrowser.Slots> RzBrowser { get; set; }
    
    // RzButton
    public virtual TvDescriptor<RzComponent<RzButton.Slots>, RzButton.Slots> RzButton { get; set; }

    // RzDialog Family
    public virtual TvDescriptor<RzComponent<RzDialog.Slots>, RzDialog.Slots> RzDialog { get; set; }
    public virtual TvDescriptor<RzAsChildComponent<DialogClose.Slots>, DialogClose.Slots> DialogClose { get; set; }
    public virtual TvDescriptor<RzComponent<DialogContent.Slots>, DialogContent.Slots> DialogContent { get; set; }
    public virtual TvDescriptor<RzComponent<DialogDescription.Slots>, DialogDescription.Slots> DialogDescription { get; set; }
    public virtual TvDescriptor<RzComponent<DialogFooter.Slots>, DialogFooter.Slots> DialogFooter { get; set; }
    public virtual TvDescriptor<RzComponent<DialogHeader.Slots>, DialogHeader.Slots> DialogHeader { get; set; }
    public virtual TvDescriptor<RzComponent<DialogTitle.Slots>, DialogTitle.Slots> DialogTitle { get; set; }
    public virtual TvDescriptor<RzAsChildComponent<DialogTrigger.Slots>, DialogTrigger.Slots> DialogTrigger { get; set; }

    // RzEmpty Family
    public virtual TvDescriptor<RzComponent<RzEmpty.Slots>, RzEmpty.Slots> RzEmpty { get; set; }
    public virtual TvDescriptor<RzComponent<EmptyContent.Slots>, EmptyContent.Slots> EmptyContent { get; set; }
    public virtual TvDescriptor<RzComponent<EmptyDescription.Slots>, EmptyDescription.Slots> EmptyDescription { get; set; }
    public virtual TvDescriptor<RzComponent<EmptyHeader.Slots>, EmptyHeader.Slots> EmptyHeader { get; set; }
    public virtual TvDescriptor<RzComponent<EmptyMedia.Slots>, EmptyMedia.Slots> EmptyMedia { get; set; }
    public virtual TvDescriptor<RzComponent<EmptyTitle.Slots>, EmptyTitle.Slots> EmptyTitle { get; set; }

    // RzIndicator
    public virtual TvDescriptor<RzComponent<RzIndicator.Slots>, RzIndicator.Slots> RzIndicator { get; set; }

    // RzPopover Family
    public virtual TvDescriptor<RzComponent<RzPopover.Slots>, RzPopover.Slots> RzPopover { get; set; }
    public virtual TvDescriptor<RzComponent<PopoverContent.Slots>, PopoverContent.Slots> PopoverContent { get; set; }
    public virtual TvDescriptor<RzAsChildComponent<PopoverTrigger.Slots>, PopoverTrigger.Slots> PopoverTrigger { get; set; }

    // RzProgress
    public virtual TvDescriptor<RzComponent<RzProgress.Slots>, RzProgress.Slots> RzProgress { get; set; }

    // RzSeparator
    public virtual TvDescriptor<RzComponent<RzSeparator.Slots>, RzSeparator.Slots> RzSeparator { get; set; }

    // RzSheet Family
    public virtual TvDescriptor<RzComponent<RzSheet.Slots>, RzSheet.Slots> RzSheet { get; set; }
    public virtual TvDescriptor<RzAsChildComponent<SheetClose.Slots>, SheetClose.Slots> SheetClose { get; set; }
    public virtual TvDescriptor<RzComponent<SheetContent.Slots>, SheetContent.Slots> SheetContent { get; set; }
    public virtual TvDescriptor<RzComponent<SheetDescription.Slots>, SheetDescription.Slots> SheetDescription { get; set; }
    public virtual TvDescriptor<RzComponent<SheetFooter.Slots>, SheetFooter.Slots> SheetFooter { get; set; }
    public virtual TvDescriptor<RzComponent<SheetHeader.Slots>, SheetHeader.Slots> SheetHeader { get; set; }
    public virtual TvDescriptor<RzComponent<SheetTitle.Slots>, SheetTitle.Slots> SheetTitle { get; set; }
    public virtual TvDescriptor<RzAsChildComponent<SheetTrigger.Slots>, SheetTrigger.Slots> SheetTrigger { get; set; }

    // RzSpinner
    public virtual TvDescriptor<RzComponent<RzSpinner.Slots>, RzSpinner.Slots> RzSpinner { get; set; }

    // Typography Family
    public virtual TvDescriptor<RzComponent<RzHeading.Slots>, RzHeading.Slots> RzHeading { get; set; }
    public virtual TvDescriptor<RzComponent<RzKbd.Slots>, RzKbd.Slots> RzKbd { get; set; }
    public virtual TvDescriptor<RzComponent<RzKbdGroup.Slots>, RzKbdGroup.Slots> RzKbdGroup { get; set; }
    public virtual TvDescriptor<RzComponent<RzParagraph.Slots>, RzParagraph.Slots> RzParagraph { get; set; }

    // --- Layout Components (Migrated) ---
    public virtual TvDescriptor<RzComponent<RzAccordion.Slots>, RzAccordion.Slots> RzAccordion { get; set; }
    public virtual TvDescriptor<RzComponent<AccordionItem.Slots>, AccordionItem.Slots> AccordionItem { get; set; }
    public virtual TvDescriptor<RzComponent<RzArticle.Slots>, RzArticle.Slots> RzArticle { get; set; }
    public virtual TvDescriptor<RzComponent<RzAspectRatio.Slots>, RzAspectRatio.Slots> RzAspectRatio { get; set; }
    public virtual TvDescriptor<RzComponent<RzCard.Slots>, RzCard.Slots> RzCard { get; set; }
    public virtual TvDescriptor<RzComponent<CardAction.Slots>, CardAction.Slots> CardAction { get; set; }
    public virtual TvDescriptor<RzComponent<CardContent.Slots>, CardContent.Slots> CardContent { get; set; }
    public virtual TvDescriptor<RzComponent<CardDescription.Slots>, CardDescription.Slots> CardDescription { get; set; }
    public virtual TvDescriptor<RzComponent<CardFooter.Slots>, CardFooter.Slots> CardFooter { get; set; }
    public virtual TvDescriptor<RzComponent<CardHeader.Slots>, CardHeader.Slots> CardHeader { get; set; }
    public virtual TvDescriptor<RzComponent<CardTitle.Slots>, CardTitle.Slots> CardTitle { get; set; }
    public virtual TvDescriptor<RzComponent<RzCarousel.Slots>, RzCarousel.Slots> RzCarousel { get; set; }
    public virtual TvDescriptor<RzComponent<CarouselContent.Slots>, CarouselContent.Slots> CarouselContent { get; set; }
    public virtual TvDescriptor<RzComponent<CarouselItem.Slots>, CarouselItem.Slots> CarouselItem { get; set; }
    public virtual TvDescriptor<RzAsChildComponent<CarouselNext.Slots>, CarouselNext.Slots> CarouselNext { get; set; }
    public virtual TvDescriptor<RzAsChildComponent<CarouselPrevious.Slots>, CarouselPrevious.Slots> CarouselPrevious { get; set; }
    public virtual TvDescriptor<RzComponent<RzCollapsible.Slots>, RzCollapsible.Slots> RzCollapsible { get; set; }
    public virtual TvDescriptor<RzComponent<CollapsibleContent.Slots>, CollapsibleContent.Slots> CollapsibleContent { get; set; }
    public virtual TvDescriptor<RzAsChildComponent<CollapsibleTrigger.Slots>, CollapsibleTrigger.Slots> CollapsibleTrigger { get; set; }
    public virtual TvDescriptor<RzAsChildComponent<RzItem.Slots>, RzItem.Slots> RzItem { get; set; }
    public virtual TvDescriptor<RzComponent<ItemActions.Slots>, ItemActions.Slots> ItemActions { get; set; }
    public virtual TvDescriptor<RzComponent<ItemContent.Slots>, ItemContent.Slots> ItemContent { get; set; }
    public virtual TvDescriptor<RzComponent<ItemDescription.Slots>, ItemDescription.Slots> ItemDescription { get; set; }
    public virtual TvDescriptor<RzComponent<ItemFooter.Slots>, ItemFooter.Slots> ItemFooter { get; set; }
    public virtual TvDescriptor<RzComponent<ItemHeader.Slots>, ItemHeader.Slots> ItemHeader { get; set; }
    public virtual TvDescriptor<RzComponent<RzItemGroup.Slots>, RzItemGroup.Slots> RzItemGroup { get; set; }
    public virtual TvDescriptor<RzComponent<ItemMedia.Slots>, ItemMedia.Slots> ItemMedia { get; set; }
    public virtual TvDescriptor<RzComponent<RzItemSeparator.Slots>, RzItemSeparator.Slots> RzItemSeparator { get; set; }
    public virtual TvDescriptor<RzComponent<ItemTitle.Slots>, ItemTitle.Slots> ItemTitle { get; set; }
    public virtual TvDescriptor<RzComponent<RzSearchButton.Slots>, RzSearchButton.Slots> RzSearchButton { get; set; }
    public virtual TvDescriptor<RzComponent<RzSteps.Slots>, RzSteps.Slots> RzSteps { get; set; }

    // --- Unmigrated Components (Legacy RzStylesBase) ---
    public virtual RzStylesBase.RzButtonGroupStylesBase RzButtonGroup { get; }
    public virtual RzStylesBase.RzCheckboxGroupStylesBase RzCheckboxGroup { get; }
    public virtual RzStylesBase.RzCheckboxGroupFieldStylesBase RzCheckboxGroupField { get; }
    public virtual RzStylesBase.RzCheckboxGroupItemStylesBase RzCheckboxGroupItem { get; }
    public virtual RzStylesBase.RzCodeViewerStylesBase RzCodeViewer { get; }
    public virtual RzStylesBase.RzDarkmodeToggleStylesBase RzDarkmodeToggle { get; }
    public virtual RzStylesBase.RzDateEditStylesBase RzDateEdit { get; }
    public virtual RzStylesBase.RzDropdownMenuStylesBase RzDropdownMenu { get; }
    public virtual RzStylesBase.RzEmbeddedPreviewStylesBase RzEmbeddedPreview { get; }
    public virtual RzStylesBase.RzFieldStylesBase RzField { get; }
    public virtual RzStylesBase.RzFieldHelpStylesBase RzFieldHelp { get; }
    public virtual RzStylesBase.RzFieldLabelStylesBase RzFieldLabel { get; }
    public virtual RzStylesBase.RzFormSectionStylesBase RzFormSection { get; }
    public virtual RzStylesBase.RzLinkStylesBase RzLink { get; }
    public virtual RzStylesBase.RzMarkdownStylesBase RzMarkdown { get; }
    public virtual RzStylesBase.RzNavigationMenuStylesBase RzNavigationMenu { get; }
    public virtual RzStylesBase.RzNumberEditStylesBase RzNumberEdit { get; }
    public virtual RzStylesBase.RzNumberFieldStylesBase RzNumberField { get; }
    public virtual RzStylesBase.RzQuickReferenceContainerStylesBase RzQuickReferenceContainer { get; }
    public virtual RzStylesBase.RzQuickReferenceStylesBase RzQuickReference { get; }
    public virtual RzStylesBase.RzRadioGroupStylesBase RzRadioGroup { get; }
    public virtual RzStylesBase.RzRadioGroupFieldStylesBase RzRadioGroupField { get; }
    public virtual RzStylesBase.RzRadioGroupItemStylesBase RzRadioGroupItem { get; }
    public virtual RzStylesBase.RzSidebarProviderStylesBase RzSidebarProvider { get; }
    public virtual RzStylesBase.SidebarStylesBase Sidebar { get; }
    public virtual RzStylesBase.SidebarTriggerStylesBase SidebarTrigger { get; }
    public virtual RzStylesBase.SidebarHeaderStylesBase SidebarHeader { get; }
    public virtual RzStylesBase.SidebarContentStylesBase SidebarContent { get; }
    public virtual RzStylesBase.SidebarFooterStylesBase SidebarFooter { get; }
    public virtual RzStylesBase.SidebarGroupStylesBase SidebarGroup { get; }
    public virtual RzStylesBase.SidebarGroupLabelStylesBase SidebarGroupLabel { get; }
    public virtual RzStylesBase.SidebarGroupContentStylesBase SidebarGroupContent { get; }
    public virtual RzStylesBase.SidebarMenuStylesBase SidebarMenu { get; }
    public virtual RzStylesBase.SidebarMenuItemStylesBase SidebarMenuItem { get; }
    public virtual RzStylesBase.SidebarMenuButtonStylesBase SidebarMenuButton { get; }
    public virtual RzStylesBase.SidebarMenuActionStylesBase SidebarMenuAction { get; }
    public virtual RzStylesBase.SidebarMenuSubStylesBase SidebarMenuSub { get; }
    public virtual RzStylesBase.SidebarMenuBadgeStylesBase SidebarMenuBadge { get; }
    public virtual RzStylesBase.SidebarRailStylesBase SidebarRail { get; }
    public virtual RzStylesBase.SidebarSeparatorStylesBase SidebarSeparator { get; }
    public virtual RzStylesBase.SidebarInsetStylesBase SidebarInset { get; }
    public virtual RzStylesBase.RzTableStylesBase RzTable { get; }
    public virtual RzStylesBase.RzTableHeaderCellStylesBase RzTableHeaderCell { get; }
    public virtual RzStylesBase.RzTableBodyStylesBase RzTableBody { get; }
    public virtual RzStylesBase.RzTableRowStylesBase RzTableRow { get; }
    public virtual RzStylesBase.RzTableCellStylesBase RzTableCell { get; }
    public virtual RzStylesBase.RzPaginationStylesBase RzPagination { get; }
    public virtual RzStylesBase.RzTabsStylesBase RzTabs { get; }
    public virtual RzStylesBase.RzTabStylesBase RzTab { get; }
    public virtual RzStylesBase.RzTabPanelStylesBase RzTabPanel { get; }
    public virtual RzStylesBase.RzTabStripStylesBase RzTabStrip { get; }
    public virtual RzStylesBase.RzTextEditStylesBase RzTextEdit { get; }
    public virtual RzStylesBase.RzTextFieldStylesBase RzTextField { get; }
    public virtual RzStylesBase.RzToggleStylesBase RzToggle { get; }
    public virtual RzStylesBase.RzToggleFieldStylesBase RzToggleField { get; }
}