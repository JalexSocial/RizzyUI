using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     A container component for form fields, typically grouping a label, input, help text, and validation message.
///     Provides consistent spacing. Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzField : RzComponent
{
    /// <summary> The content to be rendered inside the field container (label, input, etc.). </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzField.Field);
    }
}