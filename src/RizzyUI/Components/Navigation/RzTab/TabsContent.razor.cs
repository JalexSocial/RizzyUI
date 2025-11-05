
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// The content panel that is displayed when its associated <see cref="TabsTrigger"/> is active.
/// </summary>
public partial class TabsContent : RzComponent<TabsContent.Slots>
{
    /// <summary>
    /// Defines the default styling for the TabsContent component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex-1 outline-none"
    );

    [CascadingParameter]
    private RzTabs? ParentTabs { get; set; }

    /// <summary>
    /// A unique value that associates this content with a <see cref="TabsTrigger"/>. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public string Value { get; set; } = string.Empty;

    /// <summary>
    /// The content to be displayed inside the panel.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets the unique ID for the trigger element associated with this content.
    /// </summary>
    protected string TriggerId => $"{ParentTabs?.Id}-{Value}-trigger";

    /// <summary>
    /// Gets the unique ID for the content element.
    /// </summary>
    protected string ContentId => $"{ParentTabs?.Id}-{Value}-content";

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentTabs == null)
            throw new InvalidOperationException($"{nameof(TabsContent)} must be used within an {nameof(RzTabs)} component.");
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.TabsContent;

    /// <summary>
    /// Defines the slots available for styling in the TabsContent component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("tabs-content")]
        public string? Base { get; set; }
    }
}