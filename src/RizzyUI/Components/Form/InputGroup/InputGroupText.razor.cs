
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A component for displaying plain text or icons within an `InputGroupAddon`.
/// </summary>
public partial class InputGroupText : RzComponent<InputGroupText.Slots>
{
    /// <summary>
    /// Defines the default styling for the InputGroupText component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "text-muted-foreground flex items-center gap-2 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"
    );

    /// <summary>
    /// Gets or sets the content to be rendered, typically text or an icon.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "span";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.InputGroupText;

    /// <summary>
    /// Defines the slots available for styling in the InputGroupText component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("input-group-text")]
        public string? Base { get; set; }
    }
}