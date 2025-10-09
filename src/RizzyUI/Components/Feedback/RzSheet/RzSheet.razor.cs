
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A root component that manages the state for a sheet panel that slides in from the edge of the screen.
/// It provides context for its child components like <see cref="SheetTrigger"/> and <see cref="SheetContent"/>.
/// </summary>
public partial class RzSheet : RzComponent<RzSheet.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzSheet component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "contents"
    );

    /// <summary>
    /// Gets or sets the content of the sheet, which should include a <see cref="SheetTrigger"/>
    /// and a <see cref="SheetContent"/>. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets the initial open state of the sheet. This is an uncontrolled property.
    /// Defaults to false.
    /// </summary>
    [Parameter]
    public bool DefaultOpen { get; set; }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzSheet;

    /// <summary>
    /// Defines the slots available for styling in the RzSheet component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}