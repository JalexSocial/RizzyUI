
// src/RizzyUI/Components/Navigation/RzDropdown/DropdownMenuSubTrigger.razor.cs
using Blazicons;
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents the trigger element for a <see cref="DropdownMenuSub"/>, which opens a nested sub-menu.
/// It is typically styled like a <see cref="DropdownMenuItem"/> but includes a chevron icon.
/// </summary>
public partial class DropdownMenuSubTrigger : RzComponent
{
    /// <summary>
    /// Gets the parent <see cref="DropdownMenuSub"/> component.
    /// </summary>
    [CascadingParameter]
    protected DropdownMenuSub? ParentSubmenu { get; set; }

    /// <summary>
    /// Gets or sets the content of the sub-menu trigger, typically text. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets an optional icon to display before the trigger content.
    /// </summary>
    [Parameter]
    public SvgIcon? Icon { get; set; }

    /// <summary>
    /// Gets the ID for the sub-menu trigger element.
    /// </summary>
    protected string TriggerId => $"{ParentSubmenu?.Id}-subtrigger";

    /// <summary>
    /// Gets the ID of the sub-menu content element this trigger controls.
    /// </summary>
    protected string SubContentId => $"{ParentSubmenu?.Id}-subcontent";

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentSubmenu == null)
        {
            throw new InvalidOperationException($"{nameof(DropdownMenuSubTrigger)} must be used within a {nameof(DropdownMenuSub)}.");
        }
        if (string.IsNullOrEmpty(Element))
        {
            Element = "button"; // Default to button for accessibility
        }
        if (Element.Equals("button", StringComparison.OrdinalIgnoreCase) &&
            (AdditionalAttributes == null || !AdditionalAttributes.ContainsKey("type")))
        {
            AdditionalAttributes ??= new Dictionary<string, object>();
            AdditionalAttributes["type"] = "button";
        }
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzDropdownMenu.SubTrigger);
    }
}