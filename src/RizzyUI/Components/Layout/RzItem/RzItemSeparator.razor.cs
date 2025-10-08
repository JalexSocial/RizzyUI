
// src/RizzyUI/Components/Layout/RzItem/RzItemSeparator.razor.cs
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A visual separator for use within an <see cref="RzItemGroup"/>.
/// </summary>
public partial class RzItemSeparator : RzComponent
{
    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzItemSeparator.Separator);
    }
}