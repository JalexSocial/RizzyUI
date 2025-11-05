
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// The interactive button that activates its associated <see cref="TabsContent"/>.
/// Can be rendered as a button or merged onto a child element.
/// </summary>
public partial class TabsTrigger : RzAsChildComponent<TabsTrigger.Slots>
{
    /// <summary>
    /// Defines the default styling for the TabsTrigger component.
    /// </summary>
    public static readonly TvDescriptor<RzAsChildComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
    );

    [CascadingParameter]
    private RzTabs? ParentTabs { get; set; }

    /// <summary>
    /// A unique value that associates this trigger with a <see cref="TabsContent"/>. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public string Value { get; set; } = string.Empty;

    /// <summary>
    /// If true, the tab will be disabled and cannot be selected.
    /// </summary>
    [Parameter]
    public bool Disabled { get; set; }

    /// <summary>
    /// The content to be displayed inside the trigger button.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets the unique ID for the trigger element.
    /// </summary>
    protected string TriggerId => $"{ParentTabs?.Id}-{Value}-trigger";

    /// <summary>
    /// Gets the unique ID for the associated content element.
    /// </summary>
    protected string ContentId => $"{ParentTabs?.Id}-{Value}-content";

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentTabs == null)
            throw new InvalidOperationException($"{nameof(TabsTrigger)} must be used within an {nameof(RzTabs)} component.");

        Element = "button";
    }

    /// <inheritdoc />
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc />
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(AdditionalAttributes ?? new(), StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = TriggerId,
            ["class"] = SlotClasses.GetBase(),
            ["role"] = "tab",
            ["data-value"] = Value,
            ["aria-controls"] = ContentId,
            ["aria-disabled"] = Disabled ? "true" : null,
            // Alpine bindings
            ["x-on:click"] = "onTriggerClick",
            ["x-bind"] = "bindTrigger($el)"
        };
        return attributes;
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzAsChildComponent<Slots>, Slots> GetDescriptor() => Theme.TabsTrigger;

    /// <summary>
    /// Defines the slots available for styling in the TabsTrigger component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("tabs-trigger")]
        public string? Base { get; set; }
    }
}