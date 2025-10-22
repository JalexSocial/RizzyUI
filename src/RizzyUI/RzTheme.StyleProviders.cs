
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

    public virtual TvDescriptor<RzComponent<RzCodeViewer.Slots>, RzCodeViewer.Slots> RzCodeViewer { get; set; }
    public virtual TvDescriptor<RzComponent<RzEmbeddedPreview.Slots>, RzEmbeddedPreview.Slots> RzEmbeddedPreview { get; set; }
    public virtual TvDescriptor<RzComponent<RzMarkdown.Slots>, RzMarkdown.Slots> RzMarkdown { get; set; }
    public virtual TvDescriptor<RzComponent<RzQuickReference.Slots>, RzQuickReference.Slots> RzQuickReference { get; set; }
    public virtual TvDescriptor<RzComponent<RzQuickReferenceContainer.Slots>, RzQuickReferenceContainer.Slots> RzQuickReferenceContainer { get; set; }
    
    // RzDropdownMenu Family
    public virtual TvDescriptor<RzComponent<RzDropdownMenu.Slots>, RzDropdownMenu.Slots> RzDropdownMenu { get; set; }
    public virtual TvDescriptor<RzComponent<DropdownMenuContent.Slots>, DropdownMenuContent.Slots> DropdownMenuContent { get; set; }
    public virtual TvDescriptor<RzComponent<DropdownMenuGroup.Slots>, DropdownMenuGroup.Slots> DropdownMenuGroup { get; set; }
    public virtual TvDescriptor<RzComponent<DropdownMenuItem.Slots>, DropdownMenuItem.Slots> DropdownMenuItem { get; set; }
    public virtual TvDescriptor<RzComponent<DropdownMenuLabel.Slots>, DropdownMenuLabel.Slots> DropdownMenuLabel { get; set; }
    public virtual TvDescriptor<RzComponent<DropdownMenuSeparator.Slots>, DropdownMenuSeparator.Slots> DropdownMenuSeparator { get; set; }
    public virtual TvDescriptor<RzComponent<DropdownMenuShortcut.Slots>, DropdownMenuShortcut.Slots> DropdownMenuShortcut { get; set; }
    public virtual TvDescriptor<RzComponent<DropdownMenuSub.Slots>, DropdownMenuSub.Slots> DropdownMenuSub { get; set; }
    public virtual TvDescriptor<RzComponent<DropdownMenuSubContent.Slots>, DropdownMenuSubContent.Slots> DropdownMenuSubContent { get; set; }
    public virtual TvDescriptor<RzComponent<DropdownMenuSubTrigger.Slots>, DropdownMenuSubTrigger.Slots> DropdownMenuSubTrigger { get; set; }
    public virtual TvDescriptor<RzAsChildComponent<DropdownMenuTrigger.Slots>, DropdownMenuTrigger.Slots> DropdownMenuTrigger { get; set; }

    // RzLink
    public virtual TvDescriptor<RzComponent<RzLink.Slots>, RzLink.Slots> RzLink { get; set; }

    // RzNavigationMenu Family
    public virtual TvDescriptor<RzComponent<RzNavigationMenu.Slots>, RzNavigationMenu.Slots> RzNavigationMenu { get; set; }
    public virtual TvDescriptor<RzComponent<NavigationMenuContent.Slots>, NavigationMenuContent.Slots> NavigationMenuContent { get; set; }
    public virtual TvDescriptor<RzComponent<NavigationMenuItem.Slots>, NavigationMenuItem.Slots> NavigationMenuItem { get; set; }
    public virtual TvDescriptor<RzAsChildComponent<NavigationMenuLink.Slots>, NavigationMenuLink.Slots> NavigationMenuLink { get; set; }
    public virtual TvDescriptor<RzComponent<NavigationMenuList.Slots>, NavigationMenuList.Slots> NavigationMenuList { get; set; }
    public virtual TvDescriptor<RzComponent<NavigationMenuTrigger.Slots>, NavigationMenuTrigger.Slots> NavigationMenuTrigger { get; set; }

    // RzSidebar Family
    public virtual TvDescriptor<RzComponent<RzSidebarProvider.Slots>, RzSidebarProvider.Slots> RzSidebarProvider { get; set; }
    public virtual TvDescriptor<RzComponent<Sidebar.Slots>, Sidebar.Slots> Sidebar { get; set; }
    public virtual TvDescriptor<RzComponent<SidebarContent.Slots>, SidebarContent.Slots> SidebarContent { get; set; }
    public virtual TvDescriptor<RzComponent<SidebarFooter.Slots>, SidebarFooter.Slots> SidebarFooter { get; set; }
    public virtual TvDescriptor<RzComponent<SidebarGroup.Slots>, SidebarGroup.Slots> SidebarGroup { get; set; }
    public virtual TvDescriptor<RzComponent<SidebarGroupContent.Slots>, SidebarGroupContent.Slots> SidebarGroupContent { get; set; }
    public virtual TvDescriptor<RzAsChildComponent<SidebarGroupLabel.Slots>, SidebarGroupLabel.Slots> SidebarGroupLabel { get; set; }
    public virtual TvDescriptor<RzComponent<SidebarHeader.Slots>, SidebarHeader.Slots> SidebarHeader { get; set; }
    public virtual TvDescriptor<RzComponent<SidebarInset.Slots>, SidebarInset.Slots> SidebarInset { get; set; }
    public virtual TvDescriptor<RzComponent<SidebarMenu.Slots>, SidebarMenu.Slots> SidebarMenu { get; set; }
    public virtual TvDescriptor<RzAsChildComponent<SidebarMenuAction.Slots>, SidebarMenuAction.Slots> SidebarMenuAction { get; set; }
    public virtual TvDescriptor<RzComponent<SidebarMenuBadge.Slots>, SidebarMenuBadge.Slots> SidebarMenuBadge { get; set; }
    public virtual TvDescriptor<RzAsChildComponent<SidebarMenuButton.Slots>, SidebarMenuButton.Slots> SidebarMenuButton { get; set; }
    public virtual TvDescriptor<RzComponent<SidebarMenuItem.Slots>, SidebarMenuItem.Slots> SidebarMenuItem { get; set; }
    public virtual TvDescriptor<RzComponent<SidebarMenuSub.Slots>, SidebarMenuSub.Slots> SidebarMenuSub { get; set; }
    public virtual TvDescriptor<RzComponent<SidebarRail.Slots>, SidebarRail.Slots> SidebarRail { get; set; }
    public virtual TvDescriptor<RzComponent<SidebarSeparator.Slots>, SidebarSeparator.Slots> SidebarSeparator { get; set; }
    public virtual TvDescriptor<RzComponent<SidebarTrigger.Slots>, SidebarTrigger.Slots> SidebarTrigger { get; set; }

    // --- Newly Migrated Components ---
    public virtual TvDescriptor<RzComponent<RzButtonGroup.Slots>, RzButtonGroup.Slots> RzButtonGroup { get; set; }
    public virtual TvDescriptor<RzComponent<RzCheckboxGroupSlots>, RzCheckboxGroupSlots> RzCheckboxGroup { get; set; }
    public virtual TvDescriptor<RzComponent<RzCheckboxGroupFieldSlots>, RzCheckboxGroupFieldSlots> RzCheckboxGroupField { get; set; }
    public virtual TvDescriptor<RzComponent<RzCheckboxGroupItemSlots>, RzCheckboxGroupItemSlots> RzCheckboxGroupItem { get; set; }
    public virtual TvDescriptor<RzComponent<RzDateEdit.Slots>, RzDateEdit.Slots> RzDateEdit { get; set; }
    public virtual TvDescriptor<RzComponent<RzField.Slots>, RzField.Slots> RzField { get; set; }
    public virtual TvDescriptor<RzComponent<RzFieldHelp.Slots>, RzFieldHelp.Slots> RzFieldHelp { get; set; }
    public virtual TvDescriptor<RzComponent<RzFieldLabelSlots>, RzFieldLabelSlots> RzFieldLabel { get; set; }
    public virtual TvDescriptor<RzComponent<RzFormSection.Slots>, RzFormSection.Slots> RzFormSection { get; set; }
    public virtual TvDescriptor<RzComponent<RzNumberEditSlots>, RzNumberEditSlots> RzNumberEdit { get; set; }
    public virtual TvDescriptor<RzComponent<RzNumberFieldSlots>, RzNumberFieldSlots> RzNumberField { get; set; }
    public virtual TvDescriptor<RzComponent<RzRadioGroupSlots>, RzRadioGroupSlots> RzRadioGroup { get; set; }
    public virtual TvDescriptor<RzComponent<RzRadioGroupFieldSlots>, RzRadioGroupFieldSlots> RzRadioGroupField { get; set; }
    public virtual TvDescriptor<RzComponent<RzRadioGroupItemSlots>, RzRadioGroupItemSlots> RzRadioGroupItem { get; set; }
    public virtual TvDescriptor<RzComponent<RzTabs.Slots>, RzTabs.Slots> RzTabs { get; set; }
    public virtual TvDescriptor<RzComponent<RzTab.Slots>, RzTab.Slots> RzTab { get; set; }
    public virtual TvDescriptor<RzComponent<RzTabPanel.Slots>, RzTabPanel.Slots> RzTabPanel { get; set; }
    public virtual TvDescriptor<RzComponent<RzTabStripSlots>, RzTabStripSlots> RzTabStrip { get; set; }
    public virtual TvDescriptor<RzComponent<RzTextEdit.Slots>, RzTextEdit.Slots> RzTextEdit { get; set; }
    public virtual TvDescriptor<RzComponent<RzTextField.Slots>, RzTextField.Slots> RzTextField { get; set; }
    public virtual TvDescriptor<RzComponent<RzToggle.Slots>, RzToggle.Slots> RzToggle { get; set; }
    public virtual TvDescriptor<RzComponent<RzToggleField.Slots>, RzToggleField.Slots> RzToggleField { get; set; }
    public virtual TvDescriptor<RzComponent<RzDarkModeToggle.Slots>, RzDarkModeToggle.Slots> RzDarkModeToggle { get; set; }
    public virtual TvDescriptor<RzComponent<RzTableSlots>, RzTableSlots> RzTable { get; set; }
    public virtual TvDescriptor<RzComponent<TableBodySlots>, TableBodySlots> TableBody { get; set; }
    public virtual TvDescriptor<RzComponent<TableCellSlots>, TableCellSlots> TableCell { get; set; }
    public virtual TvDescriptor<RzComponent<TableHeaderCellSlots>, TableHeaderCellSlots> TableHeaderCell { get; set; }
    public virtual TvDescriptor<RzComponent<TableRowSlots>, TableRowSlots> TableRow { get; set; }
    public virtual TvDescriptor<RzComponent<TablePaginationSlots>, TablePaginationSlots> TablePagination { get; set; }
}