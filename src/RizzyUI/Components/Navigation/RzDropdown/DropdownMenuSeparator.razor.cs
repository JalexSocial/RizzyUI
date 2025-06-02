
// src/RizzyUI/Components/Navigation/RzDropdown/DropdownMenuSeparator.razor.cs
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents a visual separator line within a <see cref="DropdownMenuContent"/> or <see cref="DropdownMenuGroup"/>.
/// </summary>
public partial class DropdownMenuSeparator : RzComponent
{
    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
        {
            Element = "hr";
        }
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzDropdownMenu.Separator);
    }
}