
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// The trigger that opens the content of a <see cref="NavigationMenuItem"/>. This is a nested component.
/// </summary>
public partial class NavigationMenuTrigger : RzComponent
{
    /// <summary>
    /// The parent NavigationMenuItem component.
    /// </summary>
    [CascadingParameter]
    protected NavigationMenuItem? ParentItem { get; set; }

    /// <summary>
    /// The text or other content to display in the trigger.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// The unique ID of the trigger element.
    /// </summary>
    protected string TriggerId => $"{ParentItem?.Id}-trigger";

    /// <summary>
    /// The ID of the content panel this trigger controls.
    /// </summary>
    protected string ContentId => $"{ParentItem?.Id}-content";

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "button";

        if (Element.Equals("button", StringComparison.OrdinalIgnoreCase) && (AdditionalAttributes is null || !AdditionalAttributes.ContainsKey("type")))
        {
            AdditionalAttributes ??= new Dictionary<string, object>();
            AdditionalAttributes["type"] = "button";
        }
    }

    /// <inheritdoc/>
    protected override string? RootClass() => TwMerge.Merge(AdditionalAttributes, Theme.RzNavigationMenu.Trigger);
}