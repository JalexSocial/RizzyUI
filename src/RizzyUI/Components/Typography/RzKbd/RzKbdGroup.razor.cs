
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A component that groups multiple <see cref="RzKbd"/> components together.
/// </summary>
public partial class RzKbdGroup : RzComponent<RzKbdGroup.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzKbdGroup component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "inline-flex items-center gap-1"
    );

    /// <summary>
    /// Gets or sets the content to be rendered inside the group, typically multiple <see cref="RzKbd"/> components.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "kbd";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzKbdGroup;

    /// <summary>
    /// Defines the slots available for styling in the RzKbdGroup component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}