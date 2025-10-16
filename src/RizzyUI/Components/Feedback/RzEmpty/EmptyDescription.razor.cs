
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A component for displaying descriptive text within an <see cref="EmptyHeader"/>.
/// </summary>
public partial class EmptyDescription : RzComponent<EmptyDescription.Slots>
{
    /// <summary>
    /// Defines the default styling for the EmptyDescription component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4"
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
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.EmptyDescription;

    /// <summary>
    /// Defines the slots available for styling in the EmptyDescription component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}