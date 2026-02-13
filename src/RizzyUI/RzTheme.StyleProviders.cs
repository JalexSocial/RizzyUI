using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// This partial class for RzTheme contains all the style provider properties for the RizzyUI components.
/// Each property holds a TvDescriptor that defines the default styling, slots, and variants for a component.
/// </summary>
public partial class RzTheme
{
    #region Data Table Components

    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.TableBody{TItem}"/> component. </summary>
    public virtual TvDescriptor<RzComponent<TableBodySlots>, TableBodySlots> TableBody { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.TableCell{TItem}"/> component. </summary>
    public virtual TvDescriptor<RzComponent<TableCellSlots>, TableCellSlots> TableCell { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.TableHeaderCell{TItem}"/> component. </summary>
    public virtual TvDescriptor<RzComponent<TableHeaderCellSlots>, TableHeaderCellSlots> TableHeaderCell { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.TablePagination{TItem}"/> component. </summary>
    public virtual TvDescriptor<RzComponent<TablePaginationSlots>, TablePaginationSlots> TablePagination { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.TableRow{TItem}"/> component. </summary>
    public virtual TvDescriptor<RzComponent<TableRowSlots>, TableRowSlots> TableRow { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzTable{TItem}"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzTableSlots>, RzTableSlots> RzTable { get; set; }

    #endregion

    #region Display Components

    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzAvatar"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzAvatar.Slots>, RzAvatar.Slots> RzAvatar { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzBadge"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzBadge.Slots>, RzBadge.Slots> RzBadge { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzIndicator"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzIndicator.Slots>, RzIndicator.Slots> RzIndicator { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzProgress"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzProgress.Slots>, RzProgress.Slots> RzProgress { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzSeparator"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzSeparator.Slots>, RzSeparator.Slots> RzSeparator { get; set; }

    #endregion

    #region Document Components

    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzArticle"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzArticle.Slots>, RzArticle.Slots> RzArticle { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzBrowser"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzBrowser.Slots>, RzBrowser.Slots> RzBrowser { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzCodeViewer"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzCodeViewer.Slots>, RzCodeViewer.Slots> RzCodeViewer { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzEmbeddedPreview"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzEmbeddedPreview.Slots>, RzEmbeddedPreview.Slots> RzEmbeddedPreview { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzMarkdown"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzMarkdown.Slots>, RzMarkdown.Slots> RzMarkdown { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzQuickReference"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzQuickReference.Slots>, RzQuickReference.Slots> RzQuickReference { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzQuickReferenceContainer"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzQuickReferenceContainer.Slots>, RzQuickReferenceContainer.Slots> RzQuickReferenceContainer { get; set; }

    #endregion

    #region Feedback Components

    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.AlertDescription"/> component. </summary>
    public virtual TvDescriptor<RzComponent<AlertDescription.Slots>, AlertDescription.Slots> AlertDescription { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.AlertTitle"/> component. </summary>
    public virtual TvDescriptor<RzComponent<AlertTitle.Slots>, AlertTitle.Slots> AlertTitle { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.DialogClose"/> component. </summary>
    public virtual TvDescriptor<RzAsChildComponent<DialogClose.Slots>, DialogClose.Slots> DialogClose { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.DialogContent"/> component. </summary>
    public virtual TvDescriptor<RzComponent<DialogContent.Slots>, DialogContent.Slots> DialogContent { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.DialogDescription"/> component. </summary>
    public virtual TvDescriptor<RzComponent<DialogDescription.Slots>, DialogDescription.Slots> DialogDescription { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.DialogFooter"/> component. </summary>
    public virtual TvDescriptor<RzComponent<DialogFooter.Slots>, DialogFooter.Slots> DialogFooter { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.DialogHeader"/> component. </summary>
    public virtual TvDescriptor<RzComponent<DialogHeader.Slots>, DialogHeader.Slots> DialogHeader { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.DialogTitle"/> component. </summary>
    public virtual TvDescriptor<RzComponent<DialogTitle.Slots>, DialogTitle.Slots> DialogTitle { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.DialogTrigger"/> component. </summary>
    public virtual TvDescriptor<RzAsChildComponent<DialogTrigger.Slots>, DialogTrigger.Slots> DialogTrigger { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.EmptyContent"/> component. </summary>
    public virtual TvDescriptor<RzComponent<EmptyContent.Slots>, EmptyContent.Slots> EmptyContent { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.EmptyDescription"/> component. </summary>
    public virtual TvDescriptor<RzComponent<EmptyDescription.Slots>, EmptyDescription.Slots> EmptyDescription { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.EmptyHeader"/> component. </summary>
    public virtual TvDescriptor<RzComponent<EmptyHeader.Slots>, EmptyHeader.Slots> EmptyHeader { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.EmptyMedia"/> component. </summary>
    public virtual TvDescriptor<RzComponent<EmptyMedia.Slots>, EmptyMedia.Slots> EmptyMedia { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.EmptyTitle"/> component. </summary>
    public virtual TvDescriptor<RzComponent<EmptyTitle.Slots>, EmptyTitle.Slots> EmptyTitle { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.PopoverContent"/> component. </summary>
    public virtual TvDescriptor<RzComponent<PopoverContent.Slots>, PopoverContent.Slots> PopoverContent { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.PopoverTrigger"/> component. </summary>
    public virtual TvDescriptor<RzAsChildComponent<PopoverTrigger.Slots>, PopoverTrigger.Slots> PopoverTrigger { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzAlert"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzAlert.Slots>, RzAlert.Slots> RzAlert { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzDialog"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzDialog.Slots>, RzDialog.Slots> RzDialog { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzEmpty"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzEmpty.Slots>, RzEmpty.Slots> RzEmpty { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzPopover"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzPopover.Slots>, RzPopover.Slots> RzPopover { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzTooltip"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzTooltip.Slots>, RzTooltip.Slots> RzTooltip { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.TooltipTrigger"/> component. </summary>
    public virtual TvDescriptor<RzAsChildComponent<TooltipTrigger.Slots>, TooltipTrigger.Slots> TooltipTrigger { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.TooltipContent"/> component. </summary>
    public virtual TvDescriptor<RzComponent<TooltipContent.Slots>, TooltipContent.Slots> TooltipContent { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.TooltipProvider"/> component. </summary>
    public virtual TvDescriptor<RzComponent<TooltipProvider.Slots>, TooltipProvider.Slots> TooltipProvider { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzSheet"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzSheet.Slots>, RzSheet.Slots> RzSheet { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzSpinner"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzSpinner.Slots>, RzSpinner.Slots> RzSpinner { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzSkeleton"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzSkeleton.Slots>, RzSkeleton.Slots> RzSkeleton { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.SheetClose"/> component. </summary>
    public virtual TvDescriptor<RzAsChildComponent<SheetClose.Slots>, SheetClose.Slots> SheetClose { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.SheetContent"/> component. </summary>
    public virtual TvDescriptor<RzComponent<SheetContent.Slots>, SheetContent.Slots> SheetContent { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.SheetDescription"/> component. </summary>
    public virtual TvDescriptor<RzComponent<SheetDescription.Slots>, SheetDescription.Slots> SheetDescription { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.SheetFooter"/> component. </summary>
    public virtual TvDescriptor<RzComponent<SheetFooter.Slots>, SheetFooter.Slots> SheetFooter { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.SheetHeader"/> component. </summary>
    public virtual TvDescriptor<RzComponent<SheetHeader.Slots>, SheetHeader.Slots> SheetHeader { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.SheetTitle"/> component. </summary>
    public virtual TvDescriptor<RzComponent<SheetTitle.Slots>, SheetTitle.Slots> SheetTitle { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.SheetTrigger"/> component. </summary>
    public virtual TvDescriptor<RzAsChildComponent<SheetTrigger.Slots>, SheetTrigger.Slots> SheetTrigger { get; set; }

    #endregion

    #region Form Components

    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzButton"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzButton.Slots>, RzButton.Slots> RzButton { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzButtonGroup"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzButtonGroup.Slots>, RzButtonGroup.Slots> RzButtonGroup { get; set; }
	/// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.ButtonGroupSeparator"/> component. </summary>
	public virtual TvDescriptor<RzComponent<ButtonGroupSeparator.Slots>, ButtonGroupSeparator.Slots> ButtonGroupSeparator { get; set; }
	/// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.ButtonGroupText"/> component. </summary>
	public virtual TvDescriptor<RzAsChildComponent<ButtonGroupText.Slots>, ButtonGroupText.Slots> ButtonGroupText { get; set; }
	/// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzCalendar"/> component. </summary>
	public virtual TvDescriptor<RzComponent<RzCalendar.Slots>, RzCalendar.Slots> RzCalendar { get; set; }    	
	/// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzCalendarProvider"/> component. </summary>
	public virtual TvDescriptor<RzComponent<RzCalendarProvider.Slots>, RzCalendarProvider.Slots> RzCalendarProvider { get; set; }	
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzDateEdit"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzDateEdit.Slots>, RzDateEdit.Slots> RzDateEdit { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzFormSection"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzFormSection.Slots>, RzFormSection.Slots> RzFormSection { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzSwitch"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzSwitchSlots>, RzSwitchSlots> RzSwitch { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzToggle"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzToggle.Slots>, RzToggle.Slots> RzToggle { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzNativeSelect{TValue}"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzNativeSelectSlots>, RzNativeSelectSlots> RzNativeSelect { get; set; }    
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzFieldSet"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzFieldSet.Slots>, RzFieldSet.Slots> RzFieldSet { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.FieldLegend"/> component. </summary>
    public virtual TvDescriptor<RzComponent<FieldLegend.Slots>, FieldLegend.Slots> FieldLegend { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RzFieldGroup"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzFieldGroup.Slots>, RzFieldGroup.Slots> FieldGroup { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.Field"/> component. </summary>
    public virtual TvDescriptor<RzComponent<FieldSlots>, FieldSlots> Field { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.FieldContent"/> component. </summary>
    public virtual TvDescriptor<RzComponent<FieldContent.Slots>, FieldContent.Slots> FieldContent { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.FieldLabel{TValue}"/> component. </summary>
    public virtual TvDescriptor<RzComponent<FieldLabelSlots>, FieldLabelSlots> FieldLabel { get; set; }

    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.FieldTitle"/> component. </summary>
    public virtual TvDescriptor<RzComponent<FieldTitle.Slots>, FieldTitle.Slots> FieldTitle { get; set; }

    /// <summary> Gets or sets the style definitions for the <c>RzInput</c> component. </summary>
    public virtual TvDescriptor<RzComponent<FormInputSlots>, FormInputSlots> RzInput { get; set; }

    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzInputText"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzInputText.Slots>, RzInputText.Slots> RzInputText { get; set; }

    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzInputTextArea"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzInputTextArea.Slots>, RzInputTextArea.Slots> RzInputTextArea { get; set; }

    /// <summary> Gets or sets the style definitions for the <see cref="RzInputCheckbox"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzInputCheckbox.Slots>, RzInputCheckbox.Slots> RzCheckbox { get; set; }

    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzCheckboxGroup{TValue}"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzCheckboxGroupSlots>, RzCheckboxGroupSlots> RzCheckboxGroup { get; set; }
    
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzCheckboxGroupItem{TValue}"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzCheckboxGroupItemSlots>, RzCheckboxGroupItemSlots> RzCheckboxGroupItem { get; set; }
    
	/// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.CheckboxGroupItemIndicator"/> component. </summary>
    public virtual TvDescriptor<RzComponent<CheckboxGroupItemIndicator.Slots>, CheckboxGroupItemIndicator.Slots> CheckboxGroupItemIndicator { get; set; }
    
	/// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzInputNumber{TValue}"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzInputNumberSlots>, RzInputNumberSlots> RzInputNumber { get; set; }

    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzRadioGroup{TValue}"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzRadioGroupSlots>, RzRadioGroupSlots> RzRadioGroup { get; set; }

    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RadioGroupItem{TValue}"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RadioGroupItemSlots>, RadioGroupItemSlots> RadioGroupItem { get; set; }

    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RadioGroupItemIndicator"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RadioGroupItemIndicator.Slots>, RadioGroupItemIndicator.Slots> RadioGroupItemIndicator { get; set; }

    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.FieldDescription"/> component. </summary>
    public virtual TvDescriptor<RzComponent<FieldDescription.Slots>, FieldDescription.Slots> FieldDescription { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.FieldSeparator"/> component. </summary>
    public virtual TvDescriptor<RzComponent<FieldSeparator.Slots>, FieldSeparator.Slots> FieldSeparator { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.FieldError"/> component. </summary>
    public virtual TvDescriptor<RzComponent<FieldError.Slots>, FieldError.Slots> FieldError { get; set; }

    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.Label"/> component. </summary>
    public virtual TvDescriptor<RzComponent<Label.Slots>, Label.Slots> Label { get; set; }

    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzInputGroup"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzInputGroup.Slots>, RzInputGroup.Slots> RzInputGroup { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.InputGroupAddon"/> component. </summary>
    public virtual TvDescriptor<RzComponent<InputGroupAddonSlots>, InputGroupAddonSlots> InputGroupAddon { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.InputGroupButton"/> component. </summary>
    public virtual TvDescriptor<RzComponent<InputGroupButtonSlots>, InputGroupButtonSlots> InputGroupButton { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.InputGroupText"/> component. </summary>
    public virtual TvDescriptor<RzComponent<InputGroupText.Slots>, InputGroupText.Slots> InputGroupText { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.InputGroupInput"/> component. </summary>
    public virtual TvDescriptor<RzComponent<InputGroupInput.Slots>, InputGroupInput.Slots> InputGroupInput { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.InputGroupTextarea"/> component. </summary>
    public virtual TvDescriptor<RzComponent<InputGroupTextarea.Slots>, InputGroupTextarea.Slots> InputGroupTextarea { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzCombobox{TItem, TValue}"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzComboboxSlots>, RzComboboxSlots> RzCombobox { get; set; }

    #endregion

    #region Layout Components

    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.AccordionItem"/> component. </summary>
    public virtual TvDescriptor<RzComponent<AccordionItem.Slots>, AccordionItem.Slots> AccordionItem { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.CardAction"/> component. </summary>
    public virtual TvDescriptor<RzComponent<CardAction.Slots>, CardAction.Slots> CardAction { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.CardContent"/> component. </summary>
    public virtual TvDescriptor<RzComponent<CardContent.Slots>, CardContent.Slots> CardContent { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.CardDescription"/> component. </summary>
    public virtual TvDescriptor<RzComponent<CardDescription.Slots>, CardDescription.Slots> CardDescription { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.CardFooter"/> component. </summary>
    public virtual TvDescriptor<RzComponent<CardFooter.Slots>, CardFooter.Slots> CardFooter { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.CardHeader"/> component. </summary>
    public virtual TvDescriptor<RzComponent<CardHeader.Slots>, CardHeader.Slots> CardHeader { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.CardTitle"/> component. </summary>
    public virtual TvDescriptor<RzComponent<CardTitle.Slots>, CardTitle.Slots> CardTitle { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.CarouselContent"/> component. </summary>
    public virtual TvDescriptor<RzComponent<CarouselContent.Slots>, CarouselContent.Slots> CarouselContent { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.CarouselItem"/> component. </summary>
    public virtual TvDescriptor<RzComponent<CarouselItem.Slots>, CarouselItem.Slots> CarouselItem { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.CarouselNext"/> component. </summary>
    public virtual TvDescriptor<RzAsChildComponent<CarouselNext.Slots>, CarouselNext.Slots> CarouselNext { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.CarouselPrevious"/> component. </summary>
    public virtual TvDescriptor<RzAsChildComponent<CarouselPrevious.Slots>, CarouselPrevious.Slots> CarouselPrevious { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.CollapsibleContent"/> component. </summary>
    public virtual TvDescriptor<RzComponent<CollapsibleContent.Slots>, CollapsibleContent.Slots> CollapsibleContent { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.CollapsibleTrigger"/> component. </summary>
    public virtual TvDescriptor<RzAsChildComponent<CollapsibleTrigger.Slots>, CollapsibleTrigger.Slots> CollapsibleTrigger { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.ItemActions"/> component. </summary>
    public virtual TvDescriptor<RzComponent<ItemActions.Slots>, ItemActions.Slots> ItemActions { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.ItemContent"/> component. </summary>
    public virtual TvDescriptor<RzComponent<ItemContent.Slots>, ItemContent.Slots> ItemContent { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.ItemDescription"/> component. </summary>
    public virtual TvDescriptor<RzComponent<ItemDescription.Slots>, ItemDescription.Slots> ItemDescription { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.ItemFooter"/> component. </summary>
    public virtual TvDescriptor<RzComponent<ItemFooter.Slots>, ItemFooter.Slots> ItemFooter { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.ItemHeader"/> component. </summary>
    public virtual TvDescriptor<RzComponent<ItemHeader.Slots>, ItemHeader.Slots> ItemHeader { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.ItemMedia"/> component. </summary>
    public virtual TvDescriptor<RzComponent<ItemMedia.Slots>, ItemMedia.Slots> ItemMedia { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzAccordion"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzAccordion.Slots>, RzAccordion.Slots> RzAccordion { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzAspectRatio"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzAspectRatio.Slots>, RzAspectRatio.Slots> RzAspectRatio { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzCard"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzCard.Slots>, RzCard.Slots> RzCard { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzCarousel"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzCarousel.Slots>, RzCarousel.Slots> RzCarousel { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzCollapsible"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzCollapsible.Slots>, RzCollapsible.Slots> RzCollapsible { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzItem"/> component. </summary>
    public virtual TvDescriptor<RzAsChildComponent<RzItem.Slots>, RzItem.Slots> RzItem { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzItemGroup"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzItemGroup.Slots>, RzItemGroup.Slots> RzItemGroup { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzItemSeparator"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzItemSeparator.Slots>, RzItemSeparator.Slots> RzItemSeparator { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzSearchButton"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzSearchButton.Slots>, RzSearchButton.Slots> RzSearchButton { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzSteps"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzSteps.Slots>, RzSteps.Slots> RzSteps { get; set; }

    #endregion

    #region Navigation Components

    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.BreadcrumbEllipsis"/> component. </summary>
    public virtual TvDescriptor<RzComponent<BreadcrumbEllipsis.Slots>, BreadcrumbEllipsis.Slots> BreadcrumbEllipsis { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.BreadcrumbItem"/> component. </summary>
    public virtual TvDescriptor<RzComponent<BreadcrumbItem.Slots>, BreadcrumbItem.Slots> BreadcrumbItem { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.BreadcrumbLink"/> component. </summary>
    public virtual TvDescriptor<RzComponent<BreadcrumbLink.Slots>, BreadcrumbLink.Slots> BreadcrumbLink { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.BreadcrumbList"/> component. </summary>
    public virtual TvDescriptor<RzComponent<BreadcrumbList.Slots>, BreadcrumbList.Slots> BreadcrumbList { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.BreadcrumbPage"/> component. </summary>
    public virtual TvDescriptor<RzComponent<BreadcrumbPage.Slots>, BreadcrumbPage.Slots> BreadcrumbPage { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.BreadcrumbSeparator"/> component. </summary>
    public virtual TvDescriptor<RzComponent<BreadcrumbSeparator.Slots>, BreadcrumbSeparator.Slots> BreadcrumbSeparator { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.DropdownMenuContent"/> component. </summary>
    public virtual TvDescriptor<RzComponent<DropdownMenuContent.Slots>, DropdownMenuContent.Slots> DropdownMenuContent { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.DropdownMenuGroup"/> component. </summary>
    public virtual TvDescriptor<RzComponent<DropdownMenuGroup.Slots>, DropdownMenuGroup.Slots> DropdownMenuGroup { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.DropdownMenuItem"/> component. </summary>
    public virtual TvDescriptor<RzComponent<DropdownMenuItem.Slots>, DropdownMenuItem.Slots> DropdownMenuItem { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.DropdownMenuLabel"/> component. </summary>
    public virtual TvDescriptor<RzComponent<DropdownMenuLabel.Slots>, DropdownMenuLabel.Slots> DropdownMenuLabel { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.DropdownMenuSeparator"/> component. </summary>
    public virtual TvDescriptor<RzComponent<DropdownMenuSeparator.Slots>, DropdownMenuSeparator.Slots> DropdownMenuSeparator { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.DropdownMenuShortcut"/> component. </summary>
    public virtual TvDescriptor<RzComponent<DropdownMenuShortcut.Slots>, DropdownMenuShortcut.Slots> DropdownMenuShortcut { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.DropdownMenuSub"/> component. </summary>
    public virtual TvDescriptor<RzComponent<DropdownMenuSub.Slots>, DropdownMenuSub.Slots> DropdownMenuSub { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.DropdownMenuSubContent"/> component. </summary>
    public virtual TvDescriptor<RzComponent<DropdownMenuSubContent.Slots>, DropdownMenuSubContent.Slots> DropdownMenuSubContent { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.DropdownMenuSubTrigger"/> component. </summary>
    public virtual TvDescriptor<RzComponent<DropdownMenuSubTrigger.Slots>, DropdownMenuSubTrigger.Slots> DropdownMenuSubTrigger { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.DropdownMenuTrigger"/> component. </summary>
    public virtual TvDescriptor<RzAsChildComponent<DropdownMenuTrigger.Slots>, DropdownMenuTrigger.Slots> DropdownMenuTrigger { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.NavigationMenuContent"/> component. </summary>
    public virtual TvDescriptor<RzComponent<NavigationMenuContent.Slots>, NavigationMenuContent.Slots> NavigationMenuContent { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.NavigationMenuItem"/> component. </summary>
    public virtual TvDescriptor<RzComponent<NavigationMenuItem.Slots>, NavigationMenuItem.Slots> NavigationMenuItem { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.NavigationMenuLink"/> component. </summary>
    public virtual TvDescriptor<RzAsChildComponent<NavigationMenuLink.Slots>, NavigationMenuLink.Slots> NavigationMenuLink { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.NavigationMenuList"/> component. </summary>
    public virtual TvDescriptor<RzComponent<NavigationMenuList.Slots>, NavigationMenuList.Slots> NavigationMenuList { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.NavigationMenuTrigger"/> component. </summary>
    public virtual TvDescriptor<RzComponent<NavigationMenuTrigger.Slots>, NavigationMenuTrigger.Slots> NavigationMenuTrigger { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzBreadcrumb"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzBreadcrumb.Slots>, RzBreadcrumb.Slots> RzBreadcrumb { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzDropdownMenu"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzDropdownMenu.Slots>, RzDropdownMenu.Slots> RzDropdownMenu { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzLink"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzLink.Slots>, RzLink.Slots> RzLink { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzNavigationMenu"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzNavigationMenu.Slots>, RzNavigationMenu.Slots> RzNavigationMenu { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzScrollArea"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzScrollArea.Slots>, RzScrollArea.Slots> RzScrollArea { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzSidebarProvider"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzSidebarProvider.Slots>, RzSidebarProvider.Slots> RzSidebarProvider { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzTabs"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzTabs.Slots>, RzTabs.Slots> RzTabs { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.ScrollBar"/> component. </summary>
    public virtual TvDescriptor<RzComponent<ScrollBar.Slots>, ScrollBar.Slots> ScrollBar { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.TabsList"/> component. </summary>
    public virtual TvDescriptor<RzComponent<TabsList.Slots>, TabsList.Slots> TabsList { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.TabsTrigger"/> component. </summary>
    public virtual TvDescriptor<RzAsChildComponent<TabsTrigger.Slots>, TabsTrigger.Slots> TabsTrigger { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.TabsContent"/> component. </summary>
    public virtual TvDescriptor<RzComponent<TabsContent.Slots>, TabsContent.Slots> TabsContent { get; set; }    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.Sidebar"/> component. </summary>
    public virtual TvDescriptor<RzComponent<Sidebar.Slots>, Sidebar.Slots> Sidebar { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.SidebarContent"/> component. </summary>
    public virtual TvDescriptor<RzComponent<SidebarContent.Slots>, SidebarContent.Slots> SidebarContent { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.SidebarFooter"/> component. </summary>
    public virtual TvDescriptor<RzComponent<SidebarFooter.Slots>, SidebarFooter.Slots> SidebarFooter { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.SidebarGroup"/> component. </summary>
    public virtual TvDescriptor<RzComponent<SidebarGroup.Slots>, SidebarGroup.Slots> SidebarGroup { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.SidebarGroupContent"/> component. </summary>
    public virtual TvDescriptor<RzComponent<SidebarGroupContent.Slots>, SidebarGroupContent.Slots> SidebarGroupContent { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.SidebarGroupLabel"/> component. </summary>
    public virtual TvDescriptor<RzAsChildComponent<SidebarGroupLabel.Slots>, SidebarGroupLabel.Slots> SidebarGroupLabel { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.SidebarHeader"/> component. </summary>
    public virtual TvDescriptor<RzComponent<SidebarHeader.Slots>, SidebarHeader.Slots> SidebarHeader { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.SidebarInset"/> component. </summary>
    public virtual TvDescriptor<RzComponent<SidebarInset.Slots>, SidebarInset.Slots> SidebarInset { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.SidebarMenu"/> component. </summary>
    public virtual TvDescriptor<RzComponent<SidebarMenu.Slots>, SidebarMenu.Slots> SidebarMenu { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.SidebarMenuAction"/> component. </summary>
    public virtual TvDescriptor<RzAsChildComponent<SidebarMenuAction.Slots>, SidebarMenuAction.Slots> SidebarMenuAction { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.SidebarMenuBadge"/> component. </summary>
    public virtual TvDescriptor<RzComponent<SidebarMenuBadge.Slots>, SidebarMenuBadge.Slots> SidebarMenuBadge { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.SidebarMenuButton"/> component. </summary>
    public virtual TvDescriptor<RzAsChildComponent<SidebarMenuButton.Slots>, SidebarMenuButton.Slots> SidebarMenuButton { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.SidebarMenuItem"/> component. </summary>
    public virtual TvDescriptor<RzComponent<SidebarMenuItem.Slots>, SidebarMenuItem.Slots> SidebarMenuItem { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.SidebarMenuSub"/> component. </summary>
    public virtual TvDescriptor<RzComponent<SidebarMenuSub.Slots>, SidebarMenuSub.Slots> SidebarMenuSub { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.SidebarRail"/> component. </summary>
    public virtual TvDescriptor<RzComponent<SidebarRail.Slots>, SidebarRail.Slots> SidebarRail { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.SidebarSeparator"/> component. </summary>
    public virtual TvDescriptor<RzComponent<SidebarSeparator.Slots>, SidebarSeparator.Slots> SidebarSeparator { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.SidebarTrigger"/> component. </summary>
    public virtual TvDescriptor<RzComponent<SidebarTrigger.Slots>, SidebarTrigger.Slots> SidebarTrigger { get; set; }

    #endregion

    #region Theme Components

    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzDarkModeToggle"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzDarkModeToggle.Slots>, RzDarkModeToggle.Slots> RzDarkModeToggle { get; set; }

    #endregion

    #region Typography Components

    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.ItemTitle"/> component. </summary>
    public virtual TvDescriptor<RzComponent<ItemTitle.Slots>, ItemTitle.Slots> ItemTitle { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzHeading"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzHeading.Slots>, RzHeading.Slots> RzHeading { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzKbd"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzKbd.Slots>, RzKbd.Slots> RzKbd { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzKbdGroup"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzKbdGroup.Slots>, RzKbdGroup.Slots> RzKbdGroup { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzParagraph"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzParagraph.Slots>, RzParagraph.Slots> RzParagraph { get; set; }

    #endregion

    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzCommand"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzCommand.Slots>, RzCommand.Slots> RzCommand { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.RzCommandDialog"/> component. </summary>
    public virtual TvDescriptor<RzComponent<RzCommandDialog.Slots>, RzCommandDialog.Slots> RzCommandDialog { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.CommandInput"/> component. </summary>
    public virtual TvDescriptor<RzComponent<CommandInput.Slots>, CommandInput.Slots> CommandInput { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.CommandList"/> component. </summary>
    public virtual TvDescriptor<RzComponent<CommandList.Slots>, CommandList.Slots> CommandList { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.CommandEmpty"/> component. </summary>
    public virtual TvDescriptor<RzComponent<CommandEmpty.Slots>, CommandEmpty.Slots> CommandEmpty { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.CommandGroup"/> component. </summary>
    public virtual TvDescriptor<RzComponent<CommandGroup.Slots>, CommandGroup.Slots> CommandGroup { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.CommandItem"/> component. </summary>
    public virtual TvDescriptor<RzComponent<CommandItem.Slots>, CommandItem.Slots> CommandItem { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.CommandSeparator"/> component. </summary>
    public virtual TvDescriptor<RzComponent<CommandSeparator.Slots>, CommandSeparator.Slots> CommandSeparator { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.CommandShortcut"/> component. </summary>
    public virtual TvDescriptor<RzComponent<CommandShortcut.Slots>, CommandShortcut.Slots> CommandShortcut { get; set; }
    /// <summary> Gets or sets the style definitions for the <see cref="RizzyUI.CommandItemTemplate"/> component. </summary>
	public virtual TvDescriptor<RzComponent<CommandItemTemplate.Slots>, CommandItemTemplate.Slots> CommandItemTemplate { get; set; }
}
