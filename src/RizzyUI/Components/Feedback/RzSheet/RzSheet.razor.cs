
using Microsoft.AspNetCore.Components;
using Rizzy.Utility;
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
    /// Gets the unique identifier used for <c>aria-labelledby</c> when a <see cref="SheetTitle"/> is rendered.
    /// </summary>
    internal string AriaLabelId { get; } = IdGenerator.UniqueId("rzshtttl");

    /// <summary>
    /// Gets the unique identifier used for <c>aria-describedby</c> when a <see cref="SheetDescription"/> is rendered.
    /// </summary>
    internal string AriaDescriptionId { get; } = IdGenerator.UniqueId("rzshtdesc");

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


    /// <summary>
    /// Gets or sets whether the sheet is modal. Modal sheets trap keyboard focus and expose <c>aria-modal="true"</c>.
    /// </summary>
    [Parameter]
    public bool Modal { get; set; } = true;

    /// <summary>
    /// Gets or sets whether outside pointer interactions dismiss the sheet.
    /// </summary>
    [Parameter]
    public bool DismissOnOutsideClick { get; set; } = true;

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzSheet;

    /// <summary>
    /// Defines the slots available for styling in the RzSheet component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}