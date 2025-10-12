
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using RizzyUI.TailwindVariants;

namespace RizzyUI;

/// <summary>
/// A component for displaying the title within a <see cref="DialogHeader"/>.
/// </summary>
public partial class DialogTitle : RzComponent<DialogTitle.Slots>
{
    /// <summary>
    /// Defines the default styling for the DialogTitle component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "text-lg leading-none font-semibold"
    );

    [CascadingParameter]
    protected RzDialog? ParentDialog { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered as the title.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "h2";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.DialogTitle;

    /// <summary>
    /// Defines the slots available for styling in the DialogTitle component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}