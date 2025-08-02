
// src/RizzyUI/Components/Feedback/RzSheet/RzSheet.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A root component that manages the state for a sheet panel that slides in from the edge of the screen.
/// It provides context for its child components like <see cref="SheetTrigger"/> and <see cref="SheetContent"/>.
/// </summary>
/// <remarks>
/// As a root-level component, its name is prefixed with 'Rz'.
/// </remarks>
public partial class RzSheet : RzComponent
{
    /// <summary>
    /// Gets or sets the content of the sheet, which should include a <see cref="SheetTrigger"/>
    /// and a <see cref="SheetContent"/>. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets the initial open state of the sheet. This is an uncontrolled property.
    /// Defaults to false.
    /// </summary>
    [Parameter]
    public bool DefaultOpen { get; set; }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes);
    }
}