
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using RizzyUI.TailwindVariants;

namespace RizzyUI;

/// <summary>
/// A component for displaying descriptive text within a <see cref="DialogHeader"/>.
/// </summary>
public partial class DialogDescription : RzComponent<DialogDescription.Slots>
{
    /// <summary>
    /// Defines the default styling for the DialogDescription component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "text-muted-foreground text-sm"
    );

    /// <summary>
    /// Gets or sets the content to be rendered as the description.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "p";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.DialogDescription;

    /// <summary>
    /// Defines the slots available for styling in the DialogDescription component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}