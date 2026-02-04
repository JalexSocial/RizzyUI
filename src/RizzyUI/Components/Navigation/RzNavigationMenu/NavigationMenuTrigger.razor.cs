
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// The trigger that opens the content of a <see cref="NavigationMenuItem"/>. This is a nested component.
/// </summary>
public partial class NavigationMenuTrigger : RzComponent<NavigationMenuTrigger.Slots>
{
    /// <summary>
    /// Defines the default styling for the NavigationMenuTrigger component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent/50"
    );

    /// <summary>
    /// The parent NavigationMenuItem component.
    /// </summary>
    [CascadingParameter]
    protected NavigationMenuItem? ParentItem { get; set; }

    /// <summary>
    /// The text or other content to display in the trigger.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// The unique ID of the trigger element.
    /// </summary>
    protected string TriggerId => $"{ParentItem?.Id}-trigger";

    /// <summary>
    /// The ID of the content panel this trigger controls.
    /// </summary>
    protected string ContentId => $"{ParentItem?.Id}-content";

    /// <summary>
    /// Trigger XRef is used to reference the trigger element in Alpine.js.
    /// </summary>
    protected string TriggerXRef => $"trigger_{ParentItem?.Id}";

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
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.NavigationMenuTrigger;

    /// <summary>
    /// Defines the slots available for styling in the NavigationMenuTrigger component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}