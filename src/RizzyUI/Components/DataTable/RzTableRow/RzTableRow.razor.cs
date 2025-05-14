using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
/// Represents a table row (<tr>) within an RzTable, typically used in Header, Body (RowTemplate), or Footer.
/// It primarily acts as a styled wrapper for its ChildContent, which should consist of RzTableHeaderCell or RzTableCell components.
/// Styling is determined by the active <see cref="RzTheme"/>.
/// </xmldoc>
[CascadingTypeParameter(nameof(TItem))] // Allows TItem to be inferred from parent RzTable or RzTableBody
public partial class RzTableRow<TItem> : RzComponent
{
    /// <summary>
    /// The data item for the current row, typically provided by the RzTableBody's RowTemplate context.
    /// This can be used for conditional styling or row-specific attributes if needed in the future,
    /// though it's not directly used by the base <tr> styling itself.
    /// </summary>
    [Parameter] public TItem? Item { get; set; }

    /// <summary>
    /// The content to be rendered inside the table row, typically RzTableHeaderCell or RzTableCell components.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "tr"; // This component directly renders a <tr> element.
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        var styles = Theme.RzTableRow; // Access the specific styles for RzTableRow
        // Merge AdditionalAttributes (especially 'class') with the base styles from the theme.
        return TwMerge.Merge(AdditionalAttributes, styles.TableRow);
    }
}