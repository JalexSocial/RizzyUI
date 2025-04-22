using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     A container component used to group related <see cref="RzDropdownMenuItem" /> components within an
///     <see cref="RzDropdown" />.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzDropdownSection : RzComponent
{
    /// <summary> Gets or sets the child content for this dropdown section, typically <see cref="RzDropdownMenuItem" />s. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzDropdownSection.Section);
    }
}