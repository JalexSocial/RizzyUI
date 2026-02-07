
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A component to display text within a <see cref="RzButtonGroup"/>.
/// Can be rendered as a div or merged onto a child element.
/// </summary>
public partial class ButtonGroupText : RzAsChildComponent<ButtonGroupText.Slots>
{
    /// <summary>
    /// Defines the default styling for the ButtonGroupText component.
    /// </summary>
    public static readonly TvDescriptor<RzAsChildComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "bg-muted flex items-center gap-2 rounded-md border px-4 text-sm font-medium shadow-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"
    );

    /// <summary>
    /// Gets or sets the content to be rendered inside the text component.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
        {
            Element = "div";
        }
    }

    /// <inheritdoc />
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc />
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(AdditionalAttributes?.ToDictionary(kvp => kvp.Key, kvp => (object?)kvp.Value) ?? new Dictionary<string, object?>(), StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = Id,
            ["class"] = SlotClasses.GetBase(),
            ["data-slot"] = "button-group-text"
        };
        return attributes;
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzAsChildComponent<Slots>, Slots> GetDescriptor() => Theme.ButtonGroupText;

    /// <summary>
    /// Defines the slots available for styling in the ButtonGroupText component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("button-group-text")]
        public string? Base { get; set; }
    }
}