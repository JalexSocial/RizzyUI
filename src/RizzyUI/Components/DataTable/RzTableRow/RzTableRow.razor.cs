
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using System.Collections.Generic;
using Rizzy.Utility; // Required for List

namespace RizzyUI;

/// <xmldoc>
/// Represents a table row (<tr>) within an RzTable, typically used in Header, Body (RowTemplate), or Footer.
/// It primarily acts as a styled wrapper for its ChildContent, which should consist of RzTableHeaderCell or RzTableCell components.
/// Styling is determined by the active <see cref="RzTheme"/>, and can be influenced by parent RzTable properties like Striped and Hoverable.
/// </xmldoc>
[CascadingTypeParameter(nameof(TItem))] // Allows TItem to be inferred from parent RzTable or RzTableBody
public partial class RzTableRow<TItem> : RzComponent
{
    /// <summary>
    /// Cascaded parent RzTable instance.
    /// </summary>
    [CascadingParameter(Name = "ParentRzTable")]
    protected RzTable<TItem>? ParentRzTable { get; set; }

    /// <summary>
    /// Cascaded row index from RzTableBody. Null if not in a body context or if striping is disabled.
    /// </summary>
    [CascadingParameter(Name = "RowIndex")]
    protected int? RowIndex { get; set; }

    /// <summary>
    /// The data item for the current row, typically provided by the RzTableBody's RowTemplate context.
    /// This can be used for conditional styling or row-specific attributes if needed in the future,
    /// though it's not directly used by the base <tr> styling itself currently.
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
        Element = "tr";

        if (ParentRzTable != null)
        {
            Id = $"{ParentRzTable.TableBodyIdInternal}-row";
            
            if (RowIndex != null)
                Id += "-" + RowIndex;
            else
            {
                Id = IdGenerator.UniqueId(Id);
            }
        }
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        var styles = Theme.RzTableRow;
        var classBuilder = new List<string> { styles.TableRowBase };

        if (ParentRzTable is { Hoverable: true })
        {
            classBuilder.Add(styles.TableRowHover);
        }

        if (ParentRzTable is { Striped: true } && RowIndex.HasValue)
        {
            // Apply theme-based surface colors for striping
            // These Tailwind classes will respect the theme's definitions
            classBuilder.Add(RowIndex.Value % 2 == 0 ? "bg-surface" : "bg-surface-alt");
        }
        else if (ParentRzTable is { Striped: false })
        {
            // Ensure default row background if not striped
            classBuilder.Add("bg-surface");
        }


        return TwMerge.Merge(AdditionalAttributes, classBuilder.ToArray());
    }
}