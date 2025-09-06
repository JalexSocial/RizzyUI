
// src/RizzyUI/Components/Navigation/RzDropdown/Styling/DefaultRzDropdownStyles.cs
namespace RizzyUI;

/// <summary>
/// Provides default styles for RzDropdownMenu and its child components.
/// </summary>
public class DefaultRzDropdownMenuStyles : RzStylesBase.RzDropdownMenuStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultRzDropdownMenuStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzDropdownMenuStyles(RzTheme theme) : base(theme)
    {
    }

    // RzDropdownMenu (Root)
    /// <inheritdoc />
    public override string Container => "popover relative inline-block text-left"; // Base container
    /// <inheritdoc />
    public override string RelativeWrapper => ""; // No specific style needed for the Alpine x-data div itself

    // DropdownMenuTrigger
    /// <inheritdoc />
    public override string TriggerWrapper => "inline-flex"; // Allows trigger to be any inline-flex element

    // DropdownMenuContent
    /// <inheritdoc />
    public override string ContentContainer => 
        "absolute z-50 mt-1 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2";
        // Based on shadcn/ui, includes animation classes. Actual positioning is handled by floating-ui via Alpine.
    /// <inheritdoc />
    public override string ContentInnerContainer => ""; // No specific inner container style, padding is on ContentContainer

    // DropdownMenuLabel
    /// <inheritdoc />
    public override string Label => "px-2 py-1.5 text-sm font-semibold text-foreground"; // Based on shadcn/ui

    // DropdownMenuGroup
    /// <inheritdoc />
    public override string Group => "py-1"; // Grouping usually just needs some padding if items have their own

    // DropdownMenuItem
    /// <inheritdoc />
    public override string MenuItem =>
        "relative flex cursor-default select-none w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground"; // Based on shadcn/ui
    /// <inheritdoc />
    public override string MenuItemIcon => "mr-2 size-4 text-xl"; // Based on shadcn/ui

    /// <inheritdoc />
    public override string MenuItemShortcut => "ml-auto text-xs tracking-widest text-muted-foreground"; // Based on shadcn/ui

    // DropdownMenuSeparator
    /// <inheritdoc />
    public override string Separator => "-mx-1 my-1 h-px bg-border"; // Based on shadcn/ui

    // DropdownMenuSub (Container for sub-menu)
    /// <inheritdoc />
    public override string SubContainer => "relative"; // Sub-menu is also a dropdown

    // DropdownMenuSubTrigger
    /// <inheritdoc />
    public override string SubTrigger =>
        "flex cursor-default select-none w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent hover:bg-accent hover:text-accent-foreground"; // Based on shadcn/ui
    /// <inheritdoc />
    public override string SubTriggerChevron => "ml-auto size-4"; // Based on shadcn/ui

    // DropdownMenuSubContent
    /// <inheritdoc />
    public override string SubContentContainer =>
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg animate-in data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"; // Based on shadcn/ui
    /// <inheritdoc />
    public override string SubContentInnerContainer => "";
}